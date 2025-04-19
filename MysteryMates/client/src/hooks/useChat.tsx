import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '../types';
import { apiRequest } from '../lib/queryClient';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Count how many pairs of messages we've had
  // Each pair is a user message + AI response
  const messageCount = Math.floor(messages.length / 2);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Check if we've reached the limit and need to sign in
    if (messageCount >= 3 && !needsAuth) {
      setNeedsAuth(true);
      toast({
        title: "Sign in required",
        description: "You've reached the free message limit. Please sign in to continue.",
        variant: "destructive",
      });
      
      // Redirect to auth page after a short delay
      setTimeout(() => {
        setLocation("/auth");
      }, 2000);
      
      return;
    }
    
    // Don't allow more messages if auth is required
    if (needsAuth) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue using Black.GPT",
      });
      setLocation("/auth");
      return;
    }

    setIsLoading(true);
    
    try {
      const currentId = conversationId || uuidv4();
      
      // Add user message to UI immediately
      const tempUserMessage: Message = {
        id: Math.random(),
        content,
        role: 'user',
        createdAt: new Date().toISOString(),
        conversationId: currentId,
      };
      
      setMessages(prev => [...prev, tempUserMessage]);
      
      // Send message to API
      const response = await apiRequest('POST', '/api/chat', {
        message: content,
        conversationId: currentId,
      });
      
      const data = await response.json();
      
      // Update conversation ID if it's new
      if (!conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Add assistant response to UI
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserMessage.id), // Remove temp message
        data.userMessage, // Add actual user message from server
        data.assistantMessage, // Add assistant response
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, messageCount, needsAuth, setLocation, toast]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setNeedsAuth(false);
  }, []);

  return {
    messages,
    isLoading,
    conversationId,
    sendMessage,
    resetChat,
    needsAuth,
    messageCount,
  };
}
