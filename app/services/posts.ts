// 定义文章类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  featured?: boolean;
  image?: string;
  views?: number;
}

// 模拟数据 - 实际项目中可能从数据库或CMS获取
const posts: Post[] = [
  {
    id: '1',
    title: 'Next.js 13 新特性详解',
    slug: 'nextjs-13-features',
    date: '2023-10-15',
    description: '探索 Next.js 13 带来的 App Router、Server Components 等革命性变化。',
    content: '这里是文章的完整内容...',
    category: '前端开发',
    tags: ['Next.js', 'React', '前端框架'],
    featured: true,
    views: 1000
  },
  {
    id: '2',
    title: 'TypeScript 高级类型技巧',
    slug: 'typescript-advanced-types',
    date: '2023-09-28',
    description: '掌握 TypeScript 中的条件类型、映射类型和类型体操技巧。',
    content: '这里是文章的完整内容...',
    category: '编程语言',
    tags: ['TypeScript', '类型系统', '前端开发'],
    featured: true,
    views: 800
  },
  {
    id: '3',
    title: 'CSS Grid 布局实战指南',
    slug: 'css-grid-layout-guide',
    date: '2023-09-10',
    description: '从基础到高级，全面掌握 CSS Grid 布局的各种技巧。',
    content: '这里是文章的完整内容...',
    category: 'CSS',
    tags: ['CSS', '网页设计', '响应式设计'],
    featured: true,
    views: 600
  },
  {
    id: '4',
    title: 'React 性能优化最佳实践',
    slug: 'react-performance-optimization',
    date: '2023-08-22',
    description: '通过实际案例学习如何优化 React 应用性能，提升用户体验。',
    content: '这里是文章的完整内容...',
    category: '前端开发',
    tags: ['React', '性能优化', 'JavaScript'],
    featured: true,
    views: 400
  },
  {
    id: '5',
    title: '使用 Tailwind CSS 构建现代界面',
    slug: 'modern-ui-with-tailwind-css',
    date: '2023-08-05',
    description: '探索如何利用 Tailwind CSS 快速构建美观且响应式的用户界面。',
    content: '这里是文章的完整内容...',
    category: 'CSS',
    tags: ['Tailwind CSS', 'UI设计', '前端开发'],
    featured: true,
    views: 200
  },
  {
    id: '6',
    title: 'Node.js 微服务架构设计',
    slug: 'nodejs-microservices-architecture',
    date: '2023-07-18',
    description: '从单体应用迁移到微服务架构的实践经验与技术选型。',
    content: '这里是文章的完整内容...',
    category: '后端开发',
    tags: ['Node.js', '微服务', '系统架构'],
    featured: true,
    views: 100
  }
];

/**
 * 获取最新的博客文章
 * @param count 需要获取的文章数量
 * @returns 按日期排序的最新文章
 */
export async function getRecentPosts(count: number = 5): Promise<Post[]> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 按日期排序并返回指定数量的文章
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/**
 * 获取所有博客文章
 * @returns 所有文章
 */
export async function getAllPosts(): Promise<Post[]> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 根据slug获取单篇文章
 * @param slug 文章的slug
 * @returns 找到的文章或null
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const post = posts.find(p => p.slug === slug);
  return post || null;
}

/**
 * 获取所有分类
 * @returns 唯一分类列表
 */
export async function getAllCategories(): Promise<string[]> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const categories = new Set(posts.map(post => post.category));
  return Array.from(categories);
}

/**
 * 获取所有标签
 * @returns 唯一标签列表
 */
export async function getAllTags(): Promise<string[]> {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const tags = new Set(posts.flatMap(post => post.tags));
  return Array.from(tags);
} 