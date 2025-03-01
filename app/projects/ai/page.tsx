"use client";
import { ReactNode, useState } from "react";
import cloudbase from "@cloudbase/js-sdk";
import ReactMarkdown from 'react-markdown'

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
  const [showSavedChats, setShowSavedChats] = useState(false);
  
  // 添加清空对话功能
  const clearChat = () => {
    setMessages([]);
  };

  // 保存对话到localStorage
  const saveChat = () => {
    const timestamp = new Date().toISOString();
    const chat = {
      id: timestamp,
      messages: messages
    };
    const savedChats = JSON.parse(localStorage.getItem('savedChats') || '[]');
    localStorage.setItem('savedChats', JSON.stringify([...savedChats, chat]));
  };

  // 加载保存的对话
  const loadChat = (chatId: string) => {
    const savedChats = JSON.parse(localStorage.getItem('savedChats') || '[]');
    const chat = savedChats.find((c: any) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
    }
  };

  // 获取保存的对话列表
  const getSavedChats = () => {
    return JSON.parse(localStorage.getItem('savedChats') || '[]');
  };

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
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white dark:bg-gray-900">
      <div className="p-4 border-b-2 border-gray-100 dark:border-gray-700">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => setShowSavedChats(!showSavedChats)}
            className="px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 
              hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
          >
            {showSavedChats ? '隐藏历史' : '加载历史'}
          </button>
          <div className="flex space-x-4">
            <button
              onClick={clearChat}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 
                hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              清空对话
            </button>
            <button
              onClick={saveChat}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 
                hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              保存对话
            </button>
          </div>
        </div>
        
        {/* 历史对话列表 */}
        {showSavedChats && (
          <div className="mt-4 max-w-4xl mx-auto border-2 border-gray-100 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">已保存的对话</h3>
            <div className="space-y-2">
              {getSavedChats().map((chat: any) => (
                <div key={chat.id} className="flex items-center justify-between p-3 
                  bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(chat.id).toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      loadChat(chat.id);
                      setShowSavedChats(false);
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 
                      hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    加载
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 
        scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
        scrollbar-track-gray-100 dark:scrollbar-track-gray-800
        scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-6 rounded-2xl shadow-sm max-w-[85%] group ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-50 to-blue-100/80 dark:from-blue-950 dark:to-blue-950 border-2 border-blue-200 dark:border-blue-800"
                    : message.role === "thinking"
                    ? "bg-gradient-to-br from-amber-50 to-amber-100/80 dark:from-amber-950 dark:to-amber-950 border-2 border-amber-200 dark:border-amber-800"
                    : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium
                    ${message.role === "user" 
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-800 dark:to-blue-800" 
                      : "bg-gradient-to-br from-gray-500 to-gray-600 text-white dark:from-gray-700 dark:to-gray-700"}`}
                  >
                    {message.role === "user" ? "你" : "AI"}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-200">
                    {message.role === "user" 
                      ? "你" 
                      : message.role === "thinking"
                      ? "思考过程"
                      : "AI 助手"}
                  </div>
                </div>
                <div className="text-gray-800 dark:text-gray-300">
                  {message.role === 'assistant' ? (
                    <div className="prose dark:prose-invert max-w-none
                      prose-headings:text-gray-900 dark:prose-headings:text-gray-200
                      prose-p:text-gray-800 dark:prose-p:text-gray-300
                      prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                      prose-pre:bg-white dark:prose-pre:bg-gray-900
                      prose-pre:border-2 
                      prose-pre:border-gray-200 dark:prose-pre:border-gray-700
                      prose-a:text-blue-600 dark:prose-a:text-blue-400
                      prose-li:text-gray-800 dark:prose-li:text-gray-300"
                    >
                      <ReactMarkdown  
                        // @ts-ignore // 临时忽略类型错误
                        components={{
                          // @ts-ignore // 临时忽略类型错误
                          code({ node, inline, className, children, ...props }) {
                            return (
                              <code
                                className={`${className} ${
                                  inline 
                                    ? 'bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded-md text-sm text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700' 
                                    : 'block bg-white dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm border-2 border-gray-200 dark:border-gray-700'
                                }`}
                                {...props}
                              >
                                {children}
                              </code>
                            )
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-gray-100 dark:border-gray-700 p-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-800">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="请输入您的问题..."
                className="w-full p-3 pr-24 rounded-xl min-h-[80px] max-h-[160px] 
                  bg-white dark:bg-gray-900
                  border-2 border-gray-200 dark:border-gray-700
                  text-gray-800 dark:text-gray-200
                  placeholder-gray-400 dark:placeholder-gray-400
                  focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500 
                  focus:border-blue-500 dark:focus:border-blue-500
                  outline-none transition-all
                  shadow-sm
                  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
                  scrollbar-track-transparent
                  scrollbar-thumb-rounded-full"
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="absolute bottom-3 right-3 px-4 py-1.5 
                  bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                  dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900
                  text-white rounded-lg 
                  disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-600 dark:disabled:to-gray-600
                  disabled:text-gray-500 dark:disabled:text-gray-400
                  transition-all duration-200 
                  text-sm font-medium
                  shadow-sm"
              >
                {isLoading ? "思考中..." : "发送"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
