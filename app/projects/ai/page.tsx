"use client";
import { useState } from "react";
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import cloudbase from "@cloudbase/js-sdk";
import { Message } from './types';

const app = cloudbase.init({
  env: process.env.NEXT_PUBLIC_CLOUDBASE_ENV_ID as string,
});
const auth = app.auth({
  persistence: "local",
});

let aiModel: any;

// 初始化 AI 模型
const initAiModel = async () => {
  try {
    await auth.signInAnonymously();
    // @ts-ignore - 暂时忽略类型错误
    const ai = await app.ai();
    aiModel = ai.createModel("deepseek");
  } catch (error) {
    console.error("AI 模型初始化失败:", error);
  }
};

initAiModel();

export default function AiPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSavedChats, setShowSavedChats] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  
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

  // 添加置顶功能
  const togglePin = (chatId: string) => {
    setPinnedChats(prev => 
      prev.includes(chatId) 
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
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
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        pinnedChats={pinnedChats}
        togglePin={togglePin}
        loadChat={loadChat}
        getSavedChats={getSavedChats}
      />
      <MainContent
        messages={messages}
        prompt={prompt}
        setPrompt={setPrompt}
        handleSubmit={handleSubmit}
        loadChat={loadChat}
        getSavedChats={getSavedChats}
        isLoading={isLoading}
        showSavedChats={showSavedChats}
        setShowSavedChats={setShowSavedChats}
        clearChat={clearChat}
        saveChat={saveChat}
      />
    </div>
  );
}
