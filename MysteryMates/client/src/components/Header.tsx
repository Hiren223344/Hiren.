import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, User, History, LogIn, Menu, X } from "lucide-react";
import { Link } from "wouter";

interface HeaderProps {
  onNewChat: () => void;
}

export function Header({ onNewChat }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[#4D4D4F] relative">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          className="text-[#ACACBE] hover:text-white p-2 mr-1"
        >
          <History className="h-5 w-5" />
        </Button>
        <span className="font-bold text-lg">Black.GPT</span>
      </div>

      {/* Mobile menu button */}
      <div className="block md:hidden">
        <Button
          variant="ghost"
          className="text-[#ACACBE] hover:text-white p-2"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={onNewChat} 
          className="text-[#ACACBE] hover:text-white text-sm"
        >
          New chat
        </Button>
        <Button 
          variant="ghost" 
          className="text-[#ACACBE] hover:text-white flex items-center text-sm"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        <Link href="/auth">
          <Button
            variant="ghost"
            className="text-[#ACACBE] hover:text-white flex items-center text-sm"
          >
            <LogIn className="h-4 w-4 mr-1" />
            Sign In
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="text-[#ACACBE] hover:text-white p-2"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#202123] shadow-lg z-50 md:hidden">
          <div className="flex flex-col p-3">
            <Button 
              variant="ghost" 
              onClick={() => {
                onNewChat();
                setMobileMenuOpen(false);
              }} 
              className="text-[#ACACBE] hover:text-white text-sm justify-start py-3"
            >
              New chat
            </Button>
            <Button 
              variant="ghost" 
              className="text-[#ACACBE] hover:text-white flex items-center text-sm justify-start py-3"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Link href="/auth" className="w-full">
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#ACACBE] hover:text-white flex items-center text-sm justify-start py-3 w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-[#ACACBE] hover:text-white py-3 text-sm justify-start"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
