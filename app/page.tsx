"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { allBlogs } from "contentlayer/generated";
import dynamic from "next/dynamic";

import TrendingTech from "@/components/TrendingTech";
import LearningPath from "@/components/LearningPath";

const posts = allBlogs
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 6);

export default function Home() {
  useEffect(() => {}, []);

  // 获取所有分类
  // const categories = [
  //   ...new Set(allBlogs.flatMap(post => post.tags || []))
  // ];

  return (
    <>
      {/* Three.js 英雄区 */}

      {/* 最新文章 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          最新文章
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="card group hover:-translate-y-1 transition-all duration-200 border border-gray-200  dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md bg-white dark:bg-gray-800"
            >
              <Link href={`/blog/articles/${post.slug}`}>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags &&
                      post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>

                  <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {post.summary}
                  </p>

                  <div className="pt-3 mt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <time className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.date).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {/* <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>阅读量: {post.views || "5分钟"}</span>
                    </div> */}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 学习路径 */}
      <section className="mb-16" id="learning-paths">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          学习路径
        </h2>
        <LearningPath />
      </section>

      {/* 技术趋势 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          技术雷达
        </h2>
        <TrendingTech />
      </section>
    </>
  );
}
