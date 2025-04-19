import { useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { EmptyState } from "@/components/EmptyState";
import { useChat } from "@/hooks/useChat";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function Home() {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    resetChat, 
    needsAuth, 
    messageCount 
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#343541] text-white">
      <Header onNewChat={resetChat} />
      
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "120px" }}>
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Show sign in prompt after 3 message exchanges */}
            {needsAuth && (
              <div className="max-w-[800px] mx-auto py-6 px-4">
                <div className="bg-[#444654] p-6 rounded-lg text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    You've reached the free limit
                  </h3>
                  <p className="text-[#ACACBE] mb-4">
                    Sign in to continue using Black.GPT and get access to more features
                  </p>
                  <Link href="/auth">
                    <Button className="bg-[#10A37F] hover:bg-[#0D8C6D] text-white">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign in to continue
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Show remaining messages counter */}
      {messageCount > 0 && messageCount < 3 && !needsAuth && (
        <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-[#2A2B32] py-1 px-3 rounded-full text-xs text-[#ACACBE]">
          {3 - messageCount} message{3 - messageCount !== 1 ? 's' : ''} remaining before sign in
        </div>
      )}
      
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
}
