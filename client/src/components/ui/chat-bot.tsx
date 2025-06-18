import { useState, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";

interface Message {
  type: "user" | "bot";
  content: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        type: "bot",
        content: "👋 Hi! I'm Freya, your digital marketing assistant. How can I help you today?",
      },
    ]
  );
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");  useEffect(() => {
    const content = `Company Name: Kairo Digital

Overview:
Kairo Digital is your one-stop creative powerhouse for everything from stunning websites to scroll-worthy content. We specialize in crafting digital experiences that look beautiful and perform flawlessly. Founded in 2025, Kairo Digital is committed to transforming businesses into impactful digital brands through a combination of strategy, storytelling, and smart technology.

[... Rest of the content from Chatbotcontent.txt ...]`;

    setSystemPrompt(`You are a Core member representing our organization. Always answer in a clean, first-person tone like a knowledgeable member of the team. Avoid explaining reasoning steps, just give direct answers.

You are an AI assistant for Kairo Digital, a digital agency specializing in website development, social media marketing, and video production. 

${content}

Always be helpful, professional, and knowledgeable about Kairo Digital's services. Provide specific, relevant information from the company details above when answering questions. Keep your responses concise and focused on Kairo Digital's services and capabilities.`);
  }, []);  const getApiKey = () => {
    // Debug: Log all environment variables
    console.log('Environment variables:', import.meta.env);
    
    // Try to get the API key from environment variables
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    console.log('Raw API key:', apiKey);
    
    if (!apiKey || apiKey === "undefined" || apiKey === "null") {
      console.error('API key is missing. Available env vars:', Object.keys(import.meta.env));
      throw new Error('OpenRouter API key is not configured. Please check your .env.local file and restart the development server.');
    }
    
    // Remove any quotes from the API key
    return apiKey.replace(/["']/g, '');
  };

  const processMessage = async (message: string) => {
    try {
      const apiKey = getApiKey();
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": `${window.location.origin}`,
            "X-Title": "Kairo Digital Assistant"
          },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct", // Free model from OpenRouter
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(m => ({
              role: m.type === "user" ? "user" : "assistant",
              content: m.content
            })),
            { role: "user", content: message }
          ]
        })
      });      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('OpenRouter API Error:', errorData || response.statusText);
        
        if (response.status === 401) {
          console.error('API Key:', import.meta.env.VITE_OPENROUTER_API_KEY ? 'Present' : 'Missing');
          throw new Error("Authentication failed. Please make sure you have added your OpenRouter API key to the .env.local file and restarted the development server.");
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        } else {
          throw new Error(`Chat service error: ${errorData?.error?.message || response.statusText}`);
        }
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";    } catch (error) {
      console.error('Error in chat interaction:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return "Network error: Unable to connect to the chat service. Please check your internet connection and ensure the API key is correctly set up.";
      }
      
      return error instanceof Error ? error.message : "I apologize, but I'm having trouble connecting right now. Please try again later.";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMessage = { type: "user", content: inputMessage.trim() } as Message;
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get response from API
      const botResponse = await processMessage(userMessage.content);
      
      const botMessage = {
        type: "bot",
        content: botResponse,
      } as Message;
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat interaction:', error);
      setMessages((prev) => [...prev, {
        type: "bot",
        content: "I'm sorry, but I encountered an error. Please try again later.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 h-[500px] bg-white dark:bg-black rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-10">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Freya, The Kairo's cat</h2>
              <p className="text-sm text-white/80">Always here to help</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </Button>
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
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-600 text-white shadow-lg"
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
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
