import { Search, Library, Grid, Pin } from 'lucide-react';

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pinnedChats: string[];
  togglePin: (chatId: string) => void;
  loadChat: (chatId: string) => void;
  getSavedChats: () => any[];
}

export function Sidebar({
  searchQuery,
  setSearchQuery,
  pinnedChats,
  togglePin,
  loadChat,
  getSavedChats
}: SidebarProps) {
  return (
    <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* 顶部 Logo 和用户信息 */}
      <div className="p-4  border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI 助手</h1>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索对话..."
            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 
              rounded-lg text-sm text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="p-2 space-y-1">
        <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm
          text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <Grid className="w-4 h-4" />
          <span>所有对话</span>
        </button>
        <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm
          text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <Pin className="w-4 h-4" />
          <span>置顶对话</span>
        </button>
        <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm
          text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <Library className="w-4 h-4" />
          <span>历史记录</span>
        </button>
      </nav>

      {/* 置顶的对话 */}
      <div className="p-2">
        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">置顶对话</h3>
        <div className="space-y-1">
          {getSavedChats()
            .filter((chat: any) => pinnedChats.includes(chat.id))
            .map((chat: any) => (
              <button
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm
                  text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <span className="truncate">对话 {new Date(chat.id).toLocaleDateString()}</span>
                <Pin 
                  className="w-4 h-4 text-purple-500" 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(chat.id);
                  }}
                />
              </button>
            ))}
        </div>
      </div>

      {/* 最近的对话 */}
      <div className="flex-1 overflow-y-auto p-2">
        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">最近对话</h3>
        <div className="space-y-1">
          {getSavedChats()
            .filter((chat: any) => !pinnedChats.includes(chat.id))
            .map((chat: any) => (
              <button
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm
                  text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <span className="truncate">对话 {new Date(chat.id).toLocaleDateString()}</span>
                <Pin 
                  className="w-4 h-4 text-gray-400 hover:text-purple-500" 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(chat.id);
                  }}
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
} 