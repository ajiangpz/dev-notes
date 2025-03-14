"use client";
import Link from 'next/link';

const paths = [
  {
    title: "JavaScript基础",
    description: "从变量、函数到闭包和作用域",
    steps: [
      { title: "变量和作用域", slug: "javascript/basics/variables-scope" },
      { title: "闭包", slug: "javascript/basics/closures" },
      { title: "this关键字", slug: "javascript/basics/this-keyword" },
    ],
    level: "初级",
    icon: "🚀"
  },
  {
    title: "算法入门",
    description: "掌握基本算法和数据结构",
    steps: [
      { title: "数组操作", slug: "algorithm/2sum-in-sorted-arr" },
      { title: "链表基础", slug: "algorithm/list" },
      { title: "随机初始化", slug: "algorithm/ran-to-init" },
    ],
    level: "中级",
    icon: "🧩"
  },
  {
    title: "图形编程",
    description: "WebGL和Canvas绘图技术",
    steps: [
      { title: "WebGL三角形", slug: "webgl/webgl-triangle" },
      { title: "Canvas构造", slug: "canvas/canvas-constract" },
    ],
    level: "高级",
    icon: "🎨"
  }
];
  
export default function LearningPath() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {paths.map((path, index) => (
        <div key={index} className="card border border-gray-200 dark:border-gray-800 p-6 rounded-xl bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl">{path.icon}</span>
            <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-100">
              {path.level}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2">{path.title}</h3>
          <p className="text-muted-foreground mb-6">{path.description}</p>
          <ol className="space-y-2 mb-6">
            {path.steps.map((step, stepIndex) => (
              <li key={stepIndex} className="flex items-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-100 mr-3">
                  {stepIndex + 1}
                </span>
                <Link href={`/blog/articles/${step.slug}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                  {step.title}
                </Link>
              </li>
            ))}
          </ol>
          <Link 
            href={`/blog/articles/${path.steps[0].slug}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            开始学习 <span className="ml-1">→</span>
          </Link>
        </div>
      ))}
    </div>
  );
} 