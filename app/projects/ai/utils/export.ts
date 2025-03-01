export function exportChat(messages: Message[], format: 'markdown' | 'pdf' | 'json') {
  switch (format) {
    case 'markdown':
      return messages.map(m => 
        `### ${m.role === 'user' ? '用户' : 'AI助手'}\n\n${m.content}\n`
      ).join('\n');
    
    case 'json':
      return JSON.stringify(messages, null, 2);
      
    case 'pdf':
      // 使用 jspdf 等库实现 PDF 导出
      break;
  }
} 