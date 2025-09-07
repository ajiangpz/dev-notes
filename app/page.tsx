"use client";
import Link from "next/link";
import { useEffect } from "react";
import { allBlogs } from "contentlayer/generated";

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
      {/* 最新文章 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold my-8 text-foreground">最新文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="card group hover:-translate-y-1 transition-all duration-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md border border-border bg-background"
            >
              <Link href={`/blog/articles/${post.slug}`}>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags &&
                      post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary-light text-primary-dark"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <h3 className="mb-2 text-xl font-bold leading-tight text-foreground group-hover:underline transition-colors">
                    {post.title}
                  </h3>

                  <p className="mb-4 text-sm line-clamp-2 text-muted">
                    {post.summary}
                  </p>

                  <div className="pt-3 mt-2 flex items-center justify-between border-t border-border">
                    <time className="text-xs text-muted">
                      {new Date(post.date).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
