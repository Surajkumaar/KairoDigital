import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";

interface Message {
  type: "user" | "bot";
  content: string;
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: "👋 Hi! I'm your digital marketing assistant. How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { type: "user", content: inputMessage.trim() } as Message;
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response (replace with actual API call later)
    setTimeout(() => {
      const botMessage = {
        type: "bot",
        content: "Thanks for your message! Our team will get back to you soon.",
      } as Message;
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };
  return (    <div className="flex flex-col h-full bg-white dark:bg-black">
      <div className="p-4 bg-gradient-to-r from-black to-gray-800 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Kairo Digital Assistant</h2>
            <p className="text-sm text-white/80">Always here to help</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                } animate-in fade-in slide-in-from-bottom-3`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-slate-800">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 dark:bg-slate-800 dark:border-slate-700"
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
