"use client"
import { use, useEffect, useState } from 'react'

// 定义自己的TOC类型
interface TOCItem {
  value: string
  url: string
  depth: number
}

export default function TableOfContents({ toc }: { toc: TOCItem[] }) {
  const [activeId, setActiveId] = useState('')
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )
    
    const headings = document.querySelectorAll('h2, h3, h4')
    headings.forEach((heading) => {
      observer.observe(heading)
    })
    
    return () => {
      headings.forEach((heading) => {
        observer.unobserve(heading)
      })
    }
  }, [])
  
  if (!toc || toc.length === 0) return null
  
  return (
    <div className="hidden xl:block">
      <div className="sticky top-28">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
          目录
        </h3>
        <nav className="max-h-[calc(100vh-10rem)] overflow-auto pr-2 custom-scrollbar">
          <ul className="space-y-2 text-sm">
            {toc.map((heading) => {
              const isActive = activeId === heading.url.slice(1)
              
              return (
                <li 
                  key={heading.url}
                  className={`${
                    heading.depth === 2 ? 'pl-0' : heading.depth === 3 ? 'pl-4' : 'pl-8'
                  }`}
                >
                  <a
                    href={heading.url}
                    className={`block py-1 transition-colors ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.querySelector(heading.url)?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }}
                  >
                    {heading.value}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
} 