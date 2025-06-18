import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatBot } from "@/components/ui/chat-bot";

export default function FloatingActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div 
        className="fixed bottom-6 right-6 z-50" 
        role="complementary" 
        aria-label="Chat controls"
      >
        <Button
          className="card-3d bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-3d hover:shadow-3d-hover transition-all animate-pulse-glow p-0"
          aria-label="Open chat"
          onClick={() => setIsChatOpen(true)}
          data-state={isChatOpen ? "open" : "closed"}
        >
          <MessageCircle size={24} aria-hidden="true" />
          <span className="sr-only">Chat with Freya, The Kairo's cat</span>
        </Button>
      </div>

      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}
