
"use client";

export default function TrendingTech() {
  const trends = [
    { name: "React Server Components", category: "前端框架", hot: 95 },
    { name: "WebGPU", category: "图形技术", hot: 90 },
    { name: "Rust WASM", category: "性能优化", hot: 85 },
    { name: "CSS Container Queries", category: "样式", hot: 80 },
    { name: "AI 辅助编程", category: "开发工具", hot: 98 },
    { name: "边缘计算", category: "基础设施", hot: 75 },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trends.map((trend, index) => (
        <div key={index} className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
          <div className="mr-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"
                style={{ opacity: trend.hot / 100 }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                {trend.hot}%
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold">{trend.name}</h3>
            <p className="text-sm text-muted-foreground">{trend.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 