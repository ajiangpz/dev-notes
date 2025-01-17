import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface PostMeta {
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  views?: number;
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.mdx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

export async function getBlogStats() {
  try {
    const postsDirectory = path.join(process.cwd(), '/data/articles');
    const allFiles = getAllFiles(postsDirectory);
    
    // 收集所有分类和标签
    const categories = new Set<string>();
    const tags = new Set<string>();
    
    // 读取每个文件的 frontmatter
    for (const file of allFiles) {
      const fileContents = fs.readFileSync(file, 'utf8');
      const { data } = matter(fileContents) as unknown as { data: PostMeta };
      
      // 收集分类
      data.categories?.forEach(category => categories.add(category));
      // 收集标签
      data.tags?.forEach(tag => tags.add(tag));
    }

    // 计算运行天数
    const firstPost = allFiles
      .map(file => matter(fs.readFileSync(file, 'utf8')).data as PostMeta)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    const startDate = firstPost ? new Date(firstPost.date) : new Date();
    const runningDays = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      postCount: allFiles.length,
      categoryCount: categories.size,
      tagCount: tags.size,
      runningDays,
    };
  } catch (error) {
    console.error('获取博客统计信息失败:', error);
    return {
      postCount: 0,
      categoryCount: 0,
      tagCount: 0,
      runningDays: 0,
    };
  }
} 