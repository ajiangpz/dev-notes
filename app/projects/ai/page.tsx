"use client";
import { useState } from "react";
import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({
  env: process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID as string,
});
const auth = app.auth({
  persistence: "local",
});

// 定义消息类型
interface Message {
  role: "user" | "assistant" | "thinking";
  content: string;
}

let aiModel: any;
(async () => {
  try {
    await auth.signInAnonymously();
    const ai = await app.ai();
    aiModel = ai.createModel("deepseek");
  } catch (error) {
    console.error("AI 模型初始化失败:", error);
  }
})();

export default function Ai() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiModel || !prompt.trim()) return;

    setIsLoading(true);

    // 添加用户消息到对话历史
    const userMessage: Message = { role: "user", content: prompt };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const res = await aiModel.streamText({
        model: "deepseek-r1",
        messages: messages
          .filter(msg => msg.role !== "thinking") // 过滤掉思考过程
          .concat(userMessage)
          .map(msg => ({
            role: msg.role === "thinking" ? "assistant" : msg.role,
            content: msg.content,
          })),
      });

      let thinkingContent = "";
      let assistantResponse = "";
      
      // 添加一个空的思考消息
      setMessages(prev => [...prev, { role: "thinking", content: "" }]);

      for await (let data of res.dataStream) {
        const think = data?.choices?.[0]?.delta?.reasoning_content;
        const text = data?.choices?.[0]?.delta?.content;
        
        if (think) {
          thinkingContent += think;
          // 更新思考消息
          setMessages(prev => {
            const newMessages = [...prev];
            const thinkingMessage = newMessages[newMessages.length - 1];
            if (thinkingMessage.role === "thinking") {
              thinkingMessage.content = thinkingContent;
            }
            return newMessages;
          });
        }
        if (text) {
          assistantResponse += text;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage?.role === "assistant") {
              lastMessage.content = assistantResponse;
              return newMessages;
            } else {
              return [...prev, { role: "assistant", content: assistantResponse }];
            }
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "发生错误，请稍后重试" 
      }]);
    } finally {
      setIsLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4 pb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]"
                  : message.role === "thinking"
                  ? "bg-yellow-50 dark:bg-yellow-900/50 mr-auto max-w-[80%]"
                  : "bg-gray-100 dark:bg-gray-800 mr-auto max-w-[80%]"
              }`}
            >
              <div className="font-bold mb-1 dark:text-gray-200">
                {message.role === "user" 
                  ? "你" 
                  : message.role === "thinking"
                  ? "思考过程"
                  : "AI"}
              </div>
              <div className="whitespace-pre-wrap dark:text-gray-300">
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t dark:border-gray-700 p-4">
        <div className="max-w-2xl mx-auto relative">
          <form onSubmit={handleSubmit}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="请输入您的问题..."
              className="w-full p-4 pr-24 border rounded-lg min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              {isLoading ? "思考中..." : "发送"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
