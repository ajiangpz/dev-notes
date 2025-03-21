"use client";

import { ThemeProvider } from "next-themes";
import siteMetadata from "@/data/siteMetadata";
import { useEffect, useState } from "react";

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  // 防止服务器/客户端不匹配
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 如果未挂载，先返回一个占位符，避免水合不匹配
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  // 仅在客户端渲染后显示内容
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={siteMetadata.theme}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
