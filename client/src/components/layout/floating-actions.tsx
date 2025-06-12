import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ChatBot } from "@/components/ui/chat-bot";

export default function FloatingActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Live Chat Button */}
        <Button
          className="card-3d bg-black hover:bg-gray-800 text-white w-14 h-14 rounded-full shadow-3d hover:shadow-3d-hover transition-all animate-pulse-glow p-0"
          title="Live Chat"
          onClick={() => setIsChatOpen(true)}
        >
          <MessageCircle size={24} />
        </Button>
      </div>

      <Drawer open={isChatOpen} onOpenChange={setIsChatOpen} side="left">
        <DrawerContent className="h-[90vh]">
          <ChatBot />
        </DrawerContent>
      </Drawer>
    </>
  );
}
