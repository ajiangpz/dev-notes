import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface MdxMeta {
  title: string;
  date: string;
  tags?: string[];
  draft?: boolean;
}

interface MdxStats {
  articleCount: number;
  categoryCount: number;
  tagCount: number;
  runningDays: number;
}

export async function getMdxStats(): Promise<MdxStats> {
  // 临时返回模拟数据，之后可以替换为真实数据
  return {
    articleCount: 0,
    categoryCount: 0,
    tagCount: 0,
    runningDays: Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24))
  };
} 