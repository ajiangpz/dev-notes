'use client';

import { useState, useRef, ReactNode } from 'react';

interface PreProps {
  children: ReactNode;
  className?: string;
}

const Pre = ({ children, className = '', ...props }: PreProps) => {
  const textInput = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (textInput.current && textInput.current.textContent) {
      navigator.clipboard.writeText(textInput.current.textContent);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="relative group">
      <pre className={`${className} relative`} {...props}>
        <div ref={textInput}>{children}</div>
      </pre>
      <button
        aria-label="复制代码"
        type="button"
        className={`absolute right-2 top-2 h-8 w-8 rounded border bg-gray-700 p-1 dark:bg-gray-800 ${
          copied
            ? 'border-green-400 focus:border-green-400 focus:outline-none'
            : 'border-gray-300 dark:border-gray-700'
        }`}
        onClick={onCopy}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          className={copied ? 'text-green-400' : 'text-gray-300'}
        >
          {copied ? (
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </>
          ) : (
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </>
          )}
        </svg>
      </button>
    </div>
  );
};

export default Pre; 