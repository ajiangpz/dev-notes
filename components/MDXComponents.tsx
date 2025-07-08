import Image from './Image'
import CustomLink from './Link'
import Pre from './Pre'

import type { MDXComponents } from 'mdx/types'

export const components: MDXComponents = {
  Image,
  a: CustomLink as any,
  pre: Pre as any,

  
  // 增强标题样式
  h1: ({ className, ...props }: React.ComponentProps<'h1'>) => (
    <h1
      className={`mt-10 mb-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight ${className || ''}`}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<'h2'>) => (
    <h2
      className={`mt-8 mb-4 text-2xl font-bold text-gray-900 dark:text-white tracking-tight ${className || ''}`}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.ComponentProps<'h3'>) => (
    <h3
      className={`mt-6 mb-3 text-xl font-bold text-gray-900 dark:text-white tracking-tight ${className || ''}`}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<'h4'>) => (
    <h4
      className={`mt-5 mb-2 text-lg font-bold text-gray-900 dark:text-white tracking-tight ${className || ''}`}
      {...props}
    />
  ),
  
  // 优化段落样式
  p: ({ className, ...props }: React.ComponentProps<'p'>) => (
    <p
      className={` text-gray-700 dark:text-gray-300 leading-relaxed ${className || ''}`}
      {...props}
    />
  ),
  
  // 优化列表样式
  ul: ({ className, ...props }: React.ComponentProps<'ul'>) => (
    <ul
      className={`mb-6 ml-6 list-disc text-gray-700 dark:text-gray-300 ${className || ''}`}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.ComponentProps<'ol'>) => (
    <ol
      className={`mb-6 ml-6 list-decimal text-gray-700 dark:text-gray-300 ${className || ''}`}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.ComponentProps<'li'>) => (
    <li
      className={`mb-2 text-gray-700 dark:text-gray-300 ${className || ''}`}
      {...props}
    />
  ),
  
  // 优化引用块样式
  blockquote: ({ className, ...props }: React.ComponentProps<'blockquote'>) => (
    <blockquote
      className={`mb-6 border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 ${className || ''}`}
      {...props}
    />
  ),
  
  // 优化表格样式
  table: ({ className, ...props }: React.ComponentProps<'table'>) => (
    <div className="overflow-x-auto mb-6">
      <table
        className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className || ''}`}
        {...props}
      />
    </div>
  ),
  th: ({ className, ...props }: React.ComponentProps<'th'>) => (
    <th
      className={`px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 ${className || ''}`}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<'td'>) => (
    <td
      className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 ${className || ''}`}
      {...props}
    />
  ),
  
  // 优化代码样式
  code: ({ className, ...props }: React.ComponentProps<'code'>) => (
    <code
      className={`rounded  px-1.5 py-0.5 text-sm font-mono bg-card text-card-foreground ${className || ''}`}
      {...props}
    />
  ),
  
  // 优化水平线样式
  hr: (props: React.ComponentProps<'hr'>) => (
    <hr className="my-8 border-t border-gray-200 dark:border-gray-800" {...props} />
  ),
  
  // 添加自定义组件
  Tip: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4 border-l-4 border-blue-500">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">提示</h3>
          <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">{children}</div>
        </div>
      </div>
    </div>
  ),
  
  Warning: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 p-4 border-l-4 border-yellow-500">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">警告</h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">{children}</div>
        </div>
      </div>
    </div>
  ),
}

// 移除对 useMDXComponent 的依赖
export default function MDXComponents({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
