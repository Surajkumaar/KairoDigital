import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { env, validateEnv } from "../../lib/env";

// Function to convert plain text with markdown-like syntax to HTML
function formatMessage(text: string): string {
  if (!text) return '';
  
  // Process the text line by line to handle bullet points properly
  const lines = text.split('\n');
  let inList = false;
  let formatted = '';
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Headers (# Header)
    if (line.match(/^#+\s+(.+)$/)) {
      const level = line.match(/^(#+)/)?.[0].length || 1;
      const headerText = line.replace(/^#+\s+/, '');
      formatted += `<h${Math.min(level, 6)} class="font-bold text-lg mt-2 mb-1">${headerText}</h${Math.min(level, 6)}>`;
      continue;
    }
    
    // Bullet points
    if (line.match(/^\s*[-*]\s+(.+)$/)) {
      const bulletContent = line.replace(/^\s*[-*]\s+/, '');
      
      if (!inList) {
        formatted += '<ul class="list-disc pl-5 my-2">';
        inList = true;
      }
      
      formatted += `<li>${bulletContent}</li>`;
    } else {
      // Close list if we were in one
      if (inList) {
        formatted += '</ul>';
        inList = false;
      }
      
      // Regular paragraph
      if (line.trim() !== '') {
        formatted += `<p class="my-1">${line}</p>`;
      } else {
        formatted += '<br>';
      }
    }
  }
  
  // Close any open list
  if (inList) {
    formatted += '</ul>';
  }
  
  // Bold text (** or __)
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic text (* or _)
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>');
  
  return formatted;
}

interface Message {
  type: "user" | "bot";
  content: string;
}



export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>(
    [
      {
        type: "bot",
        content: "👋 Hi! I'm your digital marketing assistant. How can I help you today?",
      },
    ]
  );
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Additional fallback for scrolling the container directly
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };
  
  useEffect(() => {
    const content = `Company Name: Kairo Digital

Overview:
Kairo Digital is your one-stop creative powerhouse for everything from stunning websites to scroll-worthy content. We specialize in crafting digital experiences that look beautiful and perform flawlessly. Founded in 2025, Kairo Digital is committed to transforming businesses into impactful digital brands through a combination of strategy, storytelling, and smart technology.

We are more than a service provider—we are your creative collaborators. Our work blends design with performance, innovation with consistency, and art with business outcomes.

---

Core Services:

1. Website Development
Build Your Online Presence.

We craft sleek, fast, and scalable websites tailored to meet your business goals. Whether you need a personal portfolio, corporate site, or a full-fledged e-commerce platform, we design web experiences that are:
- Mobile-friendly and responsive
- Visually striking yet functional
- Optimized for SEO and performance
- Easy to manage and update

Our development process focuses on user experience (UX), speed, and business conversion, ensuring your site isn't just pretty—it performs.

2. Social Media Marketing
Engage and GROW.

Our social media strategies are designed to do more than get likes—we help you build real relationships with your audience that drive results. We manage everything from content creation to campaign execution, including:
- Strategy tailored to your brand
- Platform-specific content plans (Instagram, Facebook, LinkedIn, etc.)
- Branded posts, reels, and stories
- Analytics and performance tracking

We believe in organic growth fueled by consistency, creativity, and deep understanding of your audience.

3. Video Production
Bring Your Brand Story to Life.

Video is the most powerful medium today—and we use it to tell your story in a way that connects, inspires, and converts. Our video production services include:
- Brand introduction videos
- Social media reels and shorts
- Corporate/promotional films
- Event and product videos

Each video is conceptualized, scripted, shot, and edited with precision to reflect your brand's essence and grab attention in seconds.

---

Our Vision:
To be the digital agency that ambitious brands trust — known for our bold ideas, flawless design, and unmatched storytelling. We envision a digital future where creativity meets technology to fuel real business growth, and we're here to lead that future with innovative, world-class digital services.

Our Mission:
To empower brands to thrive in the digital landscape through intelligent, visually compelling, and result-oriented solutions. Whether it's a website, a video, or a marketing strategy, our focus is on building meaningful connections between brands and their audiences.

---

Who Are We?

At Kairo Digital, we're a tight-knit team of creators, developers, strategists, and storytellers who love turning ideas into impact. We don't just make things look good—we make them work smart.

We combine:
- Artistry with analytics
- Visual design with technical strength
- Storytelling with strategy
To deliver complete digital experiences.

---

Why Choose Kairo Digital?

- We don't just deliver services—we co-create with you as partners.
- We blend creativity with functionality to make your brand memorable.
- We focus on performance, from your website speed to your video's engagement rate.
- Every piece of work is driven by results—whether that's conversions, visibility, or engagement.

In short: We're not just building websites, strategies, or videos — we're building meaningful digital experiences that grow your business.

---

Highlights of Our Services:

Website Development:
- Mobile-first design
- E-commerce integration (Shopify, WooCommerce)
- SEO-ready structure
- CMS flexibility (WordPress, custom builds)

Social Media Marketing:
- Reels, posts, and stories tailored to trends
- Paid ad strategy and management
- Performance analytics and reports
- Monthly growth strategies

Video Production:
- Script to screen service
- Social media optimized edits
- On-location shoots and interviews
- Emotional storytelling through visuals

---

Frequently Asked Questions (FAQs):

Q: What does Kairo Digital do?
A: We offer website development, social media marketing, and video production services for brands looking to grow digitally.

Q: What industries do you work with?
A: We work with startups, small businesses, personal brands, service companies, and e-commerce businesses across various industries.

Q: Can you manage my entire digital presence?
A: Yes. We can handle everything from website creation to managing your social media and producing videos for your campaigns.

Q: How is your service different from others?
A: We don't just deliver creative work—we ensure it performs. Everything we do is based on a blend of strategy, creativity, and business insight.

Q: How can I get started?
A: Just contact us via email or Instagram, or fill the form on our website for a free consultation.

---

Contact Information:
Email: kairoxdigital@gmail.com
Instagram: @kairo_digital_
Website: https://kairodigital.in/

---

Relevant Keywords and Tags (for search indexing):
digital agency, website design, website development, social media marketing, video production, brand storytelling, SEO websites, digital marketing, Kairo Digital, content creation, reels for business, branding, creative agency Chennai, visual marketing, e-commerce website builder

---

Date of Establishment: 2025
Based in: India`;

    setSystemPrompt(`You are an AI assistant for Kairo Digital, a digital agency specializing in website development, social media marketing, and video production.

${content}

CRITICAL INSTRUCTIONS:
1. ONLY provide information that is explicitly mentioned in the content above
2. DO NOT make up or infer information that is not directly stated in the content
3. If asked about something not covered in the content, politely state that you don't have that specific information
4. Always cite information directly from the provided content
5. Use exact phrases and terminology from the content whenever possible

FORMATTING INSTRUCTIONS:
1. Structure your responses with clear headings, bullet points, and short paragraphs
2. Use markdown formatting: # for headings, - or * for bullet points
3. Bold important terms using ** or __ syntax
4. Keep each paragraph or bullet point brief and focused
5. Add line breaks between sections for better readability
6. Organize information logically by service type or topic

Remember: You represent Kairo Digital, established in 2025 and based in India. Stay strictly within the information provided in the content above.`);
  }, []);
  
  // Get API key from environment variables
  const getApiKey = () => {
    try {
      // Validate that all required environment variables are set
      validateEnv();
      return env.OPENROUTER_API_KEY;
    } catch (error) {
      console.error('Environment validation error:', error);
      throw new Error('API key not available. Please check your environment configuration.');
    }
  };

  const processMessage = async (message: string) => {
    try {
      // Debug: Log environment variable status safely with proper checks
      console.log('Environment check:', {
        envExists: typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined',
        apiKeyExists: typeof import.meta !== 'undefined' && 
                     typeof import.meta.env !== 'undefined' && 
                     typeof import.meta.env.VITE_OPENROUTER_API_KEY !== 'undefined',
        apiKeyLength: typeof import.meta !== 'undefined' && 
                     typeof import.meta.env !== 'undefined' && 
                     import.meta.env.VITE_OPENROUTER_API_KEY ? 
                     String(import.meta.env.VITE_OPENROUTER_API_KEY).length : 0
      });
      
      // Get API key - this will throw an error if not found
      const apiKey = getApiKey();
      
      // Debug: Log API key status (safely)
      console.log('API key status:', {
        exists: !!apiKey,
        length: apiKey ? apiKey.length : 0,
        firstChars: apiKey && apiKey.length > 5 ? apiKey.substring(0, 5) + '...' : 'none'
      });
      
      // Debug: Log request details (without sensitive data)
      console.log('Making API request to OpenRouter');
      
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
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
      });
      
      // Debug: Log response status
      console.log('API response status:', response.status, response.statusText);
      
      if (!response.ok) {
        // Try to get detailed error information
        let errorDetail = '';
        try {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            errorDetail = errorData.error?.message || errorData.message || errorText;
          } catch (parseError) {
            errorDetail = errorText;
          }
        } catch (readError) {
          console.error('Failed to read error response:', readError);
          errorDetail = 'Unknown error';
        }
        
        throw new Error(`API request failed with status ${response.status}: ${errorDetail}`);
      }

      // Parse the successful response
      let data;
      try {
        data = await response.json();
        console.log('API response data structure:', Object.keys(data));
      } catch (parseError) {
        console.error('Failed to parse API response:', parseError);
        throw new Error('Failed to parse API response');
      }
      
      // Extract the message content
      const messageContent = data.choices?.[0]?.message?.content;
      if (!messageContent) {
        console.warn('No message content in API response:', data);
      }
      
      return messageContent || "I apologize, but I couldn't generate a response.";
      
    } catch (error: any) {
      // Detailed error logging
      console.error('Error in chat interaction:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = "I'm sorry, I encountered an error processing your request.";
      
      // Provide more specific error messages based on the error
      if (error.message?.includes("API key")) {
        errorMessage = "API key error: Please check that VITE_OPENROUTER_API_KEY is correctly set in your .env file. Current status: " + 
          (typeof import.meta !== 'undefined' && 
           typeof import.meta.env !== 'undefined' && 
           import.meta.env.VITE_OPENROUTER_API_KEY ? "Key exists but may be invalid" : "Key not found");
      } else if (error.message?.includes("429")) {
        errorMessage = "Rate limit exceeded: The API is receiving too many requests. Please try again in a moment.";
      } else if (error.message?.includes("401") || error.message?.includes("403")) {
        errorMessage = "Authentication error: Your API key may be invalid or expired. Please check your VITE_OPENROUTER_API_KEY in .env file.";
      } else if (error.message) {
        // Include the actual error message for better debugging
        errorMessage = `Error: ${error.message}`;
      }
      
      return errorMessage;
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
      
      // Add bot response to messages
      setMessages((prev) => [...prev, {
        type: "bot",
        content: botResponse
      }]);
      
      // Scroll to the latest message after a short delay to ensure rendering is complete
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error in chat interaction:', error);
      setMessages((prev) => [...prev, {
        type: "bot",
        content: "I'm sorry, but I encountered an error. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
      {/* Header - fixed height */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
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
      
      {/* Messages container with fixed height */}
      <div className="h-[350px] overflow-auto p-4" id="messages-container">
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
                } animate-in fade-in slide-in-from-bottom-3 select-text`}
              >
                <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
              </div>
            </div>
          ))}
          {/* Empty div for scrolling to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - fixed at bottom with guaranteed visibility */}
      <form onSubmit={handleSendMessage} className="p-4 mt-auto border-t dark:border-slate-800 bg-white dark:bg-black">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 dark:bg-slate-800 dark:border-slate-700"
            disabled={isLoading}
            autoFocus
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
