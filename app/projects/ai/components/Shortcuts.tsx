interface Shortcut {
  title: string;
  prompt: string;
  icon: React.ReactNode;
}

import { CodeIcon, LightbulbIcon } from 'lucide-react';
const shortcuts: Shortcut[] = [
  {
    title: "代码解释",
    prompt: "请解释这段代码的功能：",
    icon: <CodeIcon className="w-5 h-5" />
  },
  {
    title: "优化建议",
    prompt: "请给出这段代码的优化建议：", 
    icon: <LightbulbIcon className="w-5 h-5" />
  },
  // ... 更多快捷指令
];