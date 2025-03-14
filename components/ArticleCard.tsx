import Link from 'next/link';
import Image from 'next/image';

export default function ArticleCard({ post, viewMode = 'grid' }: { post: any, viewMode?: string }) {
  // 网格视图
  if (viewMode === 'grid') {
    return (
      <div className="group flex flex-col h-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
        <Link href={`/blog/articles/${post.slug}`}>
          <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            {post.image ? (
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <span className="text-4xl opacity-30">📝</span>
              </div>
            )}
            
            {/* 新内容标记 */}
            {isNewContent(post.date) && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                NEW
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-grow p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags && post.tags.slice(0, 3).map((tag: string) => (
                <span 
                  key={tag} 
                  className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-grow">
              {post.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
              <time className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(post.date)}
              </time>
              
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {formatReadingTime(post.readingTime)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
  
  // 列表视图
  return (
    <div className="group flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
      <Link href={`/blog/articles/${post.slug}`} className="flex w-full">
        <div className="relative h-auto w-32 md:w-48 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
          {post.image ? (
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <span className="text-4xl opacity-30">📝</span>
            </div>
          )}
          
          {/* 新内容标记 */}
          {isNewContent(post.date) && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              NEW
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow p-5">
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags && post.tags.slice(0, 3).map((tag: string)  => (
              <span 
                key={tag} 
                className="inline-block rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {post.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <time className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.date)}
            </time>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {formatReadingTime(post.readingTime)}
              </span>
              
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.views || '0'} 次阅读
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// 辅助函数
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function isNewContent(dateString: string) {
  const publishDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - publishDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7; // 7天内发布的内容标记为"新"
}

// 新增函数：格式化阅读时间
function formatReadingTime(readingTime: any) {
  if (!readingTime) return '5分钟';
  
  // 如果是对象，尝试获取minutes或text属性
  if (typeof readingTime === 'object') {
    if (readingTime.text) return readingTime.text;
    if (readingTime.minutes) return `${Math.ceil(readingTime.minutes)}分钟`;
    return '5分钟';
  }
  
  // 如果是字符串，直接返回
  return readingTime;
} 