export interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  conversationId: string;
}

export interface ChatState {
  messages: Message[];
  conversationId: string | null;
  isLoading: boolean;
}
