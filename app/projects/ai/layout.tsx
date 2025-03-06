import { Metadata } from 'next'
import { ThemeToggle } from './components/ThemeToggle'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'AI 助手',
  description: '基于 Deepseek 的智能对话助手',
}

export default function AiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="p-4 bg-gray-50 dark:bg-gray-950">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </Providers>
  );
} 