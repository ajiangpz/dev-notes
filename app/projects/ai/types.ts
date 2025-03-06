export interface ChatHistory {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

export interface Message {
  role: "user" | "assistant" | "thinking";
  content: string;
} 