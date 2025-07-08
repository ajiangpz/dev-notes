import "@/css/prism.css";
import "katex/dist/katex.css";
import { components } from "@/components/MDXComponents";
import { MDXLayoutRenderer } from "pliny/mdx-components";
import {
  sortPosts,
  coreContent,
  allCoreContent
} from "pliny/utils/contentlayer";
import type { Authors, Blog } from "contentlayer/generated";
import { allBlogs, allAuthors } from "contentlayer/generated";
import { Metadata } from "next";
import siteMetadata from "@/data/siteMetadata";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import TagList from "@/components/TagList";
import TableOfContents from "@/components/TableOfContents";

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  const slug = decodeURI(params.slug.join("/"));
  const post = allBlogs.find(p => p.slug === slug);
  const authorList = post?.authors || ["default"];
  const authorDetails = authorList.map(author => {
    const authorResults = allAuthors.find(p => p.slug === author);
    return coreContent(authorResults as Authors);
  });
  if (!post) {
    return;
  }

  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.lastmod || post.date).toISOString();
  const authors = authorDetails.map(author => author.name);
  let imageList = [siteMetadata.socialBanner];
  if (post.images) {
    imageList = typeof post.images === "string" ? [post.images] : post.images;
  }
  const ogImages = imageList.map(img => {
    return {
      url: img.includes("http") ? img : siteMetadata.siteUrl + img
    };
  });

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: "./",
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: imageList
    }
  };
}

export const generateStaticParams = async () => {
  return allBlogs.map(p => ({
    slug: p.slug.split("/").map(name => decodeURI(name))
  }));
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatReadingTime(readingTime: any) {
  if (!readingTime) return "5分钟";

  if (typeof readingTime === "object") {
    if (readingTime.text) return readingTime.text;
    if (readingTime.minutes) return `${Math.ceil(readingTime.minutes)}分钟`;
    return "5分钟";
  }

  return readingTime;
}

// 获取相关文章
function getRelatedPosts(currentPost: Blog, allPosts: any[], limit = 3) {
  // 如果没有标签，返回最新的文章
  if (!currentPost.tags || currentPost.tags.length === 0) {
    return allPosts
      .filter(post => post.slug !== currentPost.slug)
      .slice(0, limit);
  }

  // 计算文章相关性得分
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentPost.slug) // 排除当前文章
    .map(post => {
      // 如果文章没有标签，相关性为0
      if (!post.tags) return { ...post, score: 0 };

      // 计算共同标签数量
      const commonTags = post.tags.filter((tag: string) =>
        currentPost.tags.includes(tag)
      ).length;

      return {
        ...post,
        score: commonTags
      };
    })
    .filter(post => post.score > 0) // 只保留有共同标签的文章
    .sort((a, b) => b.score - a.score) // 按相关性排序
    .slice(0, limit); // 限制数量

  // 如果相关文章不足，补充最新文章
  if (relatedPosts.length < limit) {
    const neededPosts = limit - relatedPosts.length;
    const existingSlugs = relatedPosts.map(p => p.slug);

    const additionalPosts = allPosts
      .filter(
        post =>
          post.slug !== currentPost.slug && !existingSlugs.includes(post.slug)
      )
      .slice(0, neededPosts);

    return [...relatedPosts, ...additionalPosts];
  }

  return relatedPosts;
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const slug = decodeURI(params.slug.join("/"));

  // 获取文章内容
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs));
  const postIndex = sortedCoreContents.findIndex((p: any) => p.slug === slug);
  if (postIndex === -1) {
    return notFound();
  }

  const prev = sortedCoreContents[postIndex + 1];
  const next = sortedCoreContents[postIndex - 1];
  const post = allBlogs.find(p => p.slug === slug) as Blog;
  const authorList = post?.authors || ["default"];
  const authorDetails = authorList.map(author => {
    const authorResults = allAuthors.find(p => p.slug === author);
    return coreContent(authorResults as Authors);
  });
  const jsonLd = post.structuredData;
  jsonLd["author"] = authorDetails.map(author => {
    return {
      "@type": "Person",
      name: author.name
    };
  });

  // 获取相关文章
  const relatedPosts = getRelatedPosts(post, sortedCoreContents, 3);

  return (
    <>  
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
        <div className="flex flex-col xl:flex-row xl:space-x-8">
          {/* 主内容区 */}
          <article className="xl:w-3/4">
            {/* 文章头部 */}
            <div className="mb-8">
              <Link
                href="/blog/articles"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors mt-4"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                返回文章列表
              </Link>

              {/* 标签 */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-4">
                  <TagList tags={post.tags} />
                </div>
              )}

              {/* 标题 */}
              <h1 className="text-3xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-4xl sm:leading-none md:text-5xl">
                {post.title}
              </h1>



              {/* 元数据 */}
              <div className="mt-6 flex flex-wrap items-center text-gray-500 dark:text-gray-400">
                {/* 作者 */}
                <div className="mr-6 flex items-center">
                  {authorDetails.map(author => (
                    <div key={author.name} className="flex items-center">
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={24}
                          height={24}
                          alt={author.name}
                          className="rounded-full mr-2"
                        />
                      )}
                      <span>{author.name}</span>
                    </div>
                  ))}
                </div>

                {/* 日期 */}  
                <time className="mr-6" dateTime={post.date}>
                  {formatDate(post.date)}
                </time>

                {/* 阅读时间 */}
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>{formatReadingTime(post.readingTime)}</span>
                </div>
              </div>
            </div>

            {/* 特色图片 */}
            {post.images && (
              <div className="relative mb-10 h-64 w-full overflow-hidden rounded-xl sm:h-80 md:h-96">
                <Image
                  src={post.images}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* 文章内容 */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg prose-headings:scroll-mt-20">
              <MDXLayoutRenderer
                code={post.body.code}
                components={components}
                toc={post.toc}
              />
            </div>

            {/* 文章底部 */}
            <div className="mt-12  pt-8">

              {/* 相关文章 */}
              {/* {relatedPosts.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    相关文章
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedPosts.map(relatedPost => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/articles/${relatedPost.slug}`}
                        className="group block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                      >
                        <div className="p-4">
                          <h4 className="font-medium text-foreground group-hover:text-primary dark:group-hover:text-primary-light line-clamp-2 mb-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-muted line-clamp-2">
                            {relatedPost.description || relatedPost.summary}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )} */}

              {/* 上一篇/下一篇导航 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev && (
                  <Link
                    href={`/blog/articles/${prev.slug}`}
                    className="group p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      上一篇
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {prev.title}
                    </h4>
                  </Link>
                )}

                {next && (
                  <Link
                    href={`/blog/articles/${next.slug}`}
                    className="group p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors sm:text-right"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center sm:justify-end">
                      下一篇
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {next.title}
                    </h4>
                  </Link>
                )}
              </div>
            </div>
          </article>

          {/* 侧边栏 */}
          <aside className="hidden xl:block xl:w-1/4">
            <div className="sticky top-28">
              {/* 目录 */}
              {post.toc && post.toc.length > 0 && (
                <TableOfContents toc={post.toc} />
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
