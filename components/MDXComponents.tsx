import Image from "./Image";
import CustomLink from "./Link";
import Pre from "./Pre";

import type { MDXComponents } from "mdx/types";

export const components: MDXComponents = {
  Image,
  a: CustomLink as any,
  pre: Pre as any,

  // 增强标题样式
  h1: ({ className, ...props }: React.ComponentProps<"h1">) => (
    <h1
      className={`mt-10 mb-6 text-3xl font-extrabold text-foreground tracking-tight ${className || ""}`}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.ComponentProps<"h2">) => (
    <h2
      className={`mt-8 mb-4 text-2xl font-bold text-foreground tracking-tight ${className || ""}`}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className={`mt-6 mb-3 text-xl font-bold text-foreground tracking-tight ${className || ""}`}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.ComponentProps<"h4">) => (
    <h4
      className={`mt-5 mb-2 text-lg font-bold text-foreground tracking-tight ${className || ""}`}
      {...props}
    />
  ),

  // 优化段落样式
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={`mb-4 text-muted leading-relaxed ${className || ""}`}
      {...props}
    />
  ),

  // 优化列表样式
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul
      className={`mb-6 ml-6 list-disc text-muted ${className || ""}`}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol
      className={`mb-6 ml-6 list-decimal text-muted ${className || ""}`}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={`text-muted ${className || ""}`} {...props} />
  ),

  // 优化引用块样式
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={`mb-6 border-l-4 border-primary pl-4 italic text-muted ${className || ""}`}
      {...props}
    />
  ),

  // 优化表格样式
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="overflow-x-auto mb-6">
      <table
        className={`min-w-full divide-y divide-border ${className || ""}`}
        {...props}
      />
    </div>
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={`px-4 py-3 text-left text-sm font-semibold text-foreground bg-secondary ${className || ""}`}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td
      className={`px-4 py-3 text-sm text-muted border-t border-border ${className || ""}`}
      {...props}
    />
  ),

  // 优化代码样式
  code: ({ className, ...props }: React.ComponentProps<"code">) => (
    <code
      className={`rounded bg-code text-code-foreground px-2 py-2 text-sm font-mono ${className || ""}`}
      {...props}
    />
  ),

  // 优化水平线样式
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="my-8 border-t border-border" {...props} />
  ),

  // 添加自定义组件
  Tip: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 rounded-lg bg-primary-light p-4 border-l-4 border-primary">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-primary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-primary-dark">提示</h3>
          <div className="mt-2 text-sm text-primary">{children}</div>
        </div>
      </div>
    </div>
  ),

  Warning: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 rounded-lg bg-warning-light p-4 border-l-4 border-warning">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-warning"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-warning-dark">警告</h3>
          <div className="mt-2 text-sm text-warning">{children}</div>
        </div>
      </div>
    </div>
  ),
};

// 移除对 useMDXComponent 的依赖
export default function MDXComponents({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
