import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from './services/posts';

import FeaturedPostCard from '@/components/FeaturedPostCard';
// import CategoryList from '@/components/CategoryList';
import TrendingTech from '@/components/TrendingTech';
import LearningPath from '@/components/LearningPath';

export default async function Home() {
  const posts = await getAllPosts();
  const featuredPosts = posts.filter(post => post.featured).slice(0, 3);
  const recentPosts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
  
  // 获取所有分类
  const categories = [...new Set(posts.flatMap(post => post.tags || []))];
  
  return (
    <>
      {/* 英雄区 */}
      <div className="relative h-[70vh] w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 mb-12">
        <div className="absolute inset-0 bg-[url('/static/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative flex h-full flex-col items-center justify-center text-center px-4">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            探索前端技术的深度与广度
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-white/80">
            从基础概念到高级应用，这里有你需要的一切前端知识
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/blog" 
              className="rounded-lg bg-white px-6 py-3 text-lg font-medium text-blue-600 shadow-lg hover:bg-gray-100 transition-all"
            >
              浏览文章
            </Link>
            <Link 
              href="#learning-paths" 
              className="rounded-lg bg-white/20 backdrop-blur-sm px-6 py-3 text-lg font-medium text-white hover:bg-white/30 transition-all"
            >
              学习路径
            </Link>
          </div>
        </div>
      </div>
      
      {/* 精选文章 */}
      {/* <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white relative">
            <span className="relative z-10">精选文章</span>
            <span className="absolute bottom-0 left-0 w-1/2 h-3 bg-blue-100 dark:bg-blue-900/50 -z-0"></span>
          </h2>
          <Link 
            href="/blog" 
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all font-medium"
          >
            查看全部 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <FeaturedPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section> */}
      
      {/* 分类浏览 */}
      {/* <section className="mb-16" id="categories">
        <h2 className="text-3xl font-bold mb-8">按主题浏览</h2>
        <CategoryList categories={categories} />
      </section> */}
      
      {/* 最新文章 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">最新文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <div key={post.slug} className="card group hover:-translate-y-1 transition-all duration-200 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md">
              <Link href={`/blog/${post.slug}`}>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags && post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {post.description}
                  </p>
                  
                  <div className="pt-3 mt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <time className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>阅读量: {post.views || '5分钟'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
      
      {/* 学习路径 */}
      <section className="mb-16" id="learning-paths">
        <h2 className="text-3xl font-bold mb-8">学习路径</h2>
        <LearningPath />
      </section>
      
      {/* 技术趋势 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">技术雷达</h2>
        <TrendingTech />
      </section>
      

    </>
  );
}
