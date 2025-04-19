import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { Search, Lightbulb, MoreHorizontal, Mic, ArrowUpCircle, Image, Camera } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [activeButton, setActiveButton] = useState<"search" | "reason" | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    await onSendMessage(message);
    setMessage("");
    setActiveButton(null);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  };

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter key (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleSearchClick = () => {
    setActiveButton(activeButton === "search" ? null : "search");
    // Just focus the textarea without adding text
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleReasonClick = () => {
    setActiveButton(activeButton === "reason" ? null : "reason");
    // Just focus the textarea without adding text
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleImageUpload = () => {
    // Create a file input and trigger it
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        alert(`Image selected: ${file.name}. This would be uploaded in a real app.`);
        // In a real app, you would upload the file and then send a message with the image URL
      }
    };
    fileInput.click();
    setShowMenu(false);
  };

  const handleCamera = () => {
    // In a real app, this would open a camera capture interface
    alert("Camera functionality would be integrated here in a complete app.");
    setShowMenu(false);
  };
  
  const handleMic = () => {
    // In a real app, this would activate voice input
    alert("Voice input would be activated here in a complete app.");
  };

  return (
    <div className="fixed bottom-0 w-full bg-[#343541] border-t border-[#4D4D4F] pb-6 pt-4">
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-3 overflow-x-auto pb-1">
            <button 
              onClick={handleSearchClick}
              className={`flex items-center text-xs px-2 sm:px-3 py-1.5 ${
                activeButton === "search" 
                  ? "bg-primary/80 text-white" 
                  : "bg-[#40414F] text-[#ACACBE]"
              } hover:bg-[#2A2B32] transition rounded flex-shrink-0`}
            >
              <Search className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button 
              onClick={handleReasonClick}
              className={`flex items-center text-xs px-2 sm:px-3 py-1.5 ${
                activeButton === "reason" 
                  ? "bg-primary/80 text-white" 
                  : "bg-[#40414F] text-[#ACACBE]"
              } hover:bg-[#2A2B32] transition rounded flex-shrink-0`}
            >
              <Lightbulb className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Reason</span>
            </button>
            <div className="relative flex-shrink-0">
              <button 
                onClick={toggleMenu}
                className="text-xs px-2 sm:px-3 py-1.5 bg-[#40414F] hover:bg-[#2A2B32] transition rounded text-[#ACACBE]"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
              
              {showMenu && (
                <div className="absolute bottom-full mb-2 right-0 bg-[#2A2B32] rounded-md shadow-lg overflow-hidden z-10 w-36">
                  <button 
                    onClick={handleImageUpload}
                    className="flex items-center w-full text-left px-3 py-2 text-sm text-[#ACACBE] hover:bg-[#40414F]"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Upload Image
                  </button>
                  <button 
                    onClick={handleCamera}
                    className="flex items-center w-full text-left px-3 py-2 text-sm text-[#ACACBE] hover:bg-[#40414F]"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center bg-[#40414F] rounded-md border border-[#4D4D4F]">
              <textarea 
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="What can I help with?"
                className="w-full bg-transparent border-0 max-h-[200px] h-[44px] px-3 py-2 text-white focus:outline-none resize-none"
                disabled={isLoading}
              />
              <div className="flex-shrink-0 flex items-center px-3 space-x-3">
                <button 
                  type="button" 
                  onClick={handleMic}
                  className="text-[#ACACBE] hover:text-white p-1"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <button 
                  type="submit" 
                  className={`text-white rounded-lg p-1 ${
                    message.trim() && !isLoading 
                      ? "bg-[#10A37F] hover:bg-opacity-90" 
                      : "bg-[#40414F] cursor-not-allowed"
                  }`}
                  disabled={!message.trim() || isLoading}
                >
                  <ArrowUpCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="text-center text-xs text-[#ACACBE] pt-2">
          Black.GPT can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
}
