import React from 'react';
import Link from 'next/link';

interface TagListProps {
  tags: string[];
  selectedTags?: string[];
  onTagClick?: (tag: string) => void;
}

export default function TagList({ tags, selectedTags = [], onTagClick }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        
        if (onTagClick) {
          // 可点击版本
          return (
            <button
              key={tag}
              onClick={() => onTagClick(tag)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
              {isSelected && (
                <svg className="w-3 h-3 ml-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              )}
            </button>
          );
        }
        
        // 链接版本
        return (
          <Link
            key={tag}
            href={`/blog/tags/${tag}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {tag}
          </Link>
        );
      })}
    </div>
  );
} 