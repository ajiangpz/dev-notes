import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface MainContentProps {
  messages: Message[];
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  showSavedChats: boolean;
  setShowSavedChats: (show: boolean) => void;
  clearChat: () => void;
  saveChat: () => void;
  loadChat: (chatId: string) => void;
  getSavedChats: () => any[];
}

export function MainContent({
  messages,
  prompt,
  setPrompt,
  handleSubmit,
  isLoading,
  showSavedChats,
  setShowSavedChats,
  clearChat,
  saveChat,

}: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* 顶部操作栏 - 调整高度和样式 */}
      <div className="flex-shrink-0 p-4  border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="h-full max-w-3xl mx-auto px-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">新对话</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChat}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium
                text-gray-700 dark:text-gray-300 
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                hover:bg-gray-50 dark:hover:bg-gray-800
                rounded-md transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清空对话
            </button>
            <button
              onClick={saveChat}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium
                text-white
                bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800
                rounded-md transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              保存对话
            </button>
          </div>
        </div>
      </div>

      {/* 消息列表区域 - 调整内边距 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800'} rounded-lg px-4 py-3 shadow-sm`}>
                {message.role === 'assistant' ? (
                  <div className="text-sm prose dark:prose-invert max-w-none
                        prose-p:text-gray-800 dark:prose-p:text-gray-300
                      prose-code:text-gray-800 dark:prose-code:text-gray-300">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-sm">{message.content}</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 底部输入区域 - 调整样式 */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-3xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="relative flex">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="输入消息..."
              className="w-full p-3 pr-24 rounded-lg border border-gray-200 dark:border-gray-700 
                focus:ring-2 focus:ring-purple-500 focus:border-transparent
                bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute right-2 bottom-2 px-4 py-1.5
                bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800
                text-white rounded-md transition-colors duration-200
                disabled:bg-gray-300 dark:disabled:bg-gray-600
                disabled:cursor-not-allowed"
            >
              {isLoading ? '发送中...' : '发送'}
            </button>
          </form>
        </div>
      </div>
    </div >
  );
} 