"use client";
import { useState, useEffect } from 'react';
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";

import { useRouter, useSearchParams } from 'next/navigation';

// 组件
import TagList from '@/components/TagList';
import ArticleCard from '@/components/ArticleCard';
import ViewToggle from '@/components/ViewToggle';
import Pagination from "@/components/Pagination";
import SearchBar from '@/components/SearchBar';

// 常量 - 减少每页显示的文章数量
const POSTS_PER_PAGE = 6;

export default function ArticlesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 客户端状态
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // 获取所有文章
  const posts = allCoreContent(sortPosts(allBlogs));

  // 提取所有标签并计算每个标签的文章数量
  const allTags: Record<string, number> = {};
  posts.forEach((post: any) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        if (allTags[tag]) {
          allTags[tag]++;
        } else {
          allTags[tag] = 1;
        }
      });
    }
  });

  // 按文章数量排序标签
  const sortedTags = Object.keys(allTags).sort((a, b) => allTags[b] - allTags[a]);

  // 从URL同步状态
  useEffect(() => {
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1');
    const view = searchParams.get('view') || 'grid';
    const query = searchParams.get('q') || '';
    
    setSelectedTags(tags);
    setCurrentPage(page);
    setViewMode(view);
    setSearchQuery(query);
    
    // 检测是否为移动设备
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [searchParams]);

  // 更新URL参数
  const updateUrlParams = (params: Record<string, string | string[] | number | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          newParams.set(key, value.join(','));
        } else {
          newParams.delete(key);
        }
      } else {
        newParams.set(key, String(value));
      }
    });
    
    router.push(`/blog/articles?${newParams.toString()}`);
  };

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    updateUrlParams({ tags: newTags, page: 1 });
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateUrlParams({ q: value || null, page: 1 });
  };

  // 处理视图切换
  const handleViewChange = (view: string) => {
    setViewMode(view);
    updateUrlParams({ view });
  };

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams({ page });
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 清除所有筛选
  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
    setCurrentPage(1);
    router.push('/blog/articles');
  };

  // 根据选中的标签和搜索词过滤文章
  const filteredPosts = posts.filter((post: any) => {
    // 标签筛选
    const tagMatch = selectedTags.length === 0 || 
      (post.tags && selectedTags.every(tag => post.tags.includes(tag)));
    
    // 搜索筛选
    const searchMatch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return tagMatch && searchMatch;
  });

  // 分页
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const displayPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // 热门文章（示例数据）
  const popularPosts = posts.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 移动端筛选按钮 */}
      {isMobile && (
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            筛选
            {selectedTags.length > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                {selectedTags.length}
              </span>
            )}
          </button>
          
          <ViewToggle
            currentView={viewMode}
            onChange={handleViewChange}
          />
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* 左侧边栏 - 标签筛选 */}
        <aside className={`${isMobile ? (showMobileFilters ? 'block' : 'hidden') : 'block'} md:block md:w-64 flex-shrink-0`}>
          <div className="md:sticky md:top-36 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">标签筛选</h2>
                {selectedTags.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    清除
                  </button>
                )}
              </div>

              <div className="mb-4">
                <SearchBar
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {sortedTags.map((tag) => (
                  <div
                    key={tag}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-colors ${selectedTags.includes(tag)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{tag}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-0.5">
                        {allTags[tag]}
                      </span>
                      {selectedTags.includes(tag) && (
                        <svg className="w-4 h-4 ml-1.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 右侧主内容 - 文章列表 */}
        <main className="flex-1">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {selectedTags.length > 0
                ? `${selectedTags.join(' + ')} 相关文章`
                : '所有文章'}
            </h1>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                共 {filteredPosts.length} 篇文章
              </span>

              {!isMobile && (
                <ViewToggle
                  currentView={viewMode}
                  onChange={handleViewChange}
                />
              )}
            </div>
          </div>

          {/* 文章列表 */}
          {displayPosts.length > 0 ? (
            <>
              <div className={`grid ${viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
              } gap-5 mb-6`}>
                {displayPosts.map((post: any) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onChange={handlePageChange}
                  basePath="/blog/articles"
                  queryParams={{
                    tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
                    view: viewMode,
                    q: searchQuery || undefined
                  }}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 mb-4 text-gray-300 dark:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
                未找到相关文章
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
                尝试调整筛选条件或搜索关键词，以查找更多内容
              </p>
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                查看所有文章
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
