import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const { theme } = useTheme();
  
  return (
    <div className="relative group">
      <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? oneDark : oneLight}
      >
        {code}
      </SyntaxHighlighter>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
      >
        复制
      </button>
    </div>
  );
} 