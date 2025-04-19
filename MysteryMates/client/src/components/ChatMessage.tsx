import { Message } from "../types";
import { ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { useState, useEffect } from 'react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [isLoading, setIsLoading] = useState(true); // Added state for loading

  useEffect(() => {
    // Simulate loading time for bot messages
    if (!isUser) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Adjust delay as needed
      return () => clearTimeout(timer);
    }
  }, [isUser]);


  return (
    <div className={`py-3 sm:py-5 px-2 sm:px-4 ${isUser ? 'bg-[#444654]' : ''}`}>
      <div className="max-w-[800px] mx-auto">
        {isUser ? (
          // User message - right aligned
          <div className="flex justify-end">
            <div className="max-w-[90%] sm:max-w-[80%]">
              <div className="prose prose-sm sm:prose text-white float-right">
                {message.content.split("\n").map((paragraph, i) => (
                  <p key={i} className="m-0 text-white">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Assistant message - left aligned
          <div>
            <div className="max-w-[90%] sm:max-w-[80%]">
              <div className="prose prose-sm sm:prose text-white">
                {message.content.split("\n").map((paragraph, i) => (
                  <p key={i} className={`mb-2 text-white ${isLoading ? 'typing-animation' : ''}`}>{paragraph}</p>
                ))}
              </div>

              <div className="flex mt-2 space-x-2">
                <button 
                  className="p-1 text-[#ACACBE] hover:text-white"
                  onClick={() => {
                    // In a real app, this would submit feedback to the server
                    alert('Thanks for the positive feedback!');
                  }}
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button 
                  className="p-1 text-[#ACACBE] hover:text-white"
                  onClick={() => {
                    // In a real app, this would submit feedback to the server
                    alert('Thanks for the feedback. We\'ll improve our responses.');
                  }}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <button 
                  className="p-1 text-[#ACACBE] hover:text-white"
                  onClick={() => {
                    navigator.clipboard.writeText(message.content);
                    alert('Message copied to clipboard!');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}