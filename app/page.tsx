import { getBlogStats } from './services/stats';

export default async function Home() {
  const stats = await getBlogStats();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">我的博客</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 border rounded-lg text-center hover:shadow-lg transition-shadow bg-white">
            <div className="text-2xl font-bold text-blue-600">
              {stats.postCount}
            </div>
            <div className="text-gray-600">文章总数</div>
          </div>
          <div className="p-4 border rounded-lg text-center hover:shadow-lg transition-shadow bg-white">
            <div className="text-2xl font-bold text-green-600">
              {stats.categoryCount}
            </div>
            <div className="text-gray-600">分类数</div>
          </div>
          <div className="p-4 border rounded-lg text-center hover:shadow-lg transition-shadow bg-white">
            <div className="text-2xl font-bold text-purple-600">
              {stats.tagCount}
            </div>
            <div className="text-gray-600">标签数</div>
          </div>
          <div className="p-4 border rounded-lg text-center hover:shadow-lg transition-shadow bg-white">
            <div className="text-2xl font-bold text-orange-600">
              {stats.runningDays}
            </div>
            <div className="text-gray-600">运行天数</div>
          </div>
        </div>

      </div>
    </main>
  );
}
