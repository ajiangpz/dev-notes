import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange?: (page: number) => void;
  basePath?: string;
  queryParams?: Record<string, string | undefined>;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onChange,
  basePath = '/blog/articles', 
  queryParams = {} 
}: PaginationProps) {
  // 如果只有一页，不显示分页
  if (totalPages <= 1) return null;
  
  // 构建页面链接
  const createPageLink = (page: number) => {
    const params = new URLSearchParams();
    
    // 添加当前的查询参数
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    // 添加页码
    params.set('page', page.toString());
    
    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
  };
  
  // 确定要显示哪些页码
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 否则，显示当前页附近的页码
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // 如果起始页不是第一页，添加省略号
      if (startPage > 1) {
        pageNumbers.unshift('...');
        pageNumbers.unshift(1);
      }
      
      // 如果结束页不是最后一页，添加省略号
      if (endPage < totalPages) {
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  // 处理页面点击
  const handlePageClick = (page: number) => {
    if (onChange) {
      onChange(page);
      return;
    }
  };
  
  return (
    <nav className="flex justify-center mt-8" aria-label="分页导航">
      <ul className="inline-flex flex-wrap items-center gap-1">
        {/* 上一页按钮 */}
        <li>
          {currentPage > 1 ? (
            onChange ? (
              <button
                onClick={() => handlePageClick(currentPage - 1)}
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label="上一页"
              >
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </button>
            ) : (
              <Link
                href={createPageLink(currentPage - 1)}
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label="上一页"
              >
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </Link>
            )
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-md text-gray-300 bg-white border border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600">
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </span>
          )}
        </li>
        
        {/* 页码 */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <li key={`ellipsis-${index}`}>
                <span className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                  ...
                </span>
              </li>
            );
          }
          
          const pageNumber = page as number;
          return (
            <li key={pageNumber}>
              {pageNumber === currentPage ? (
                <span className="flex items-center justify-center w-10 h-10 rounded-md text-blue-600 border border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {pageNumber}
                </span>
              ) : onChange ? (
                <button
                  onClick={() => handlePageClick(pageNumber)}
                  className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {pageNumber}
                </button>
              ) : (
                <Link
                  href={createPageLink(pageNumber)}
                  className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  {pageNumber}
                </Link>
              )}
            </li>
          );
        })}
        
        {/* 下一页按钮 */}
        <li>
          {currentPage < totalPages ? (
            onChange ? (
              <button
                onClick={() => handlePageClick(currentPage + 1)}
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label="下一页"
              >
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              </button>
            ) : (
              <Link
                href={createPageLink(currentPage + 1)}
                className="flex items-center justify-center w-10 h-10 rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label="下一页"
              >
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              </Link>
            )
          ) : (
            <span className="flex items-center justify-center w-10 h-10 rounded-md text-gray-300 bg-white border border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600">
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
              </svg>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
} 