import { Router } from "express";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const router = Router();

// API endpoint to securely provide configuration to the client
router.get("/", (req, res) => {
  // Only provide non-sensitive configuration or properly masked keys
  res.json({
    // Provide a flag indicating if the API key is configured
    hasOpenRouterApiKey: !!process.env.VITE_OPENROUTER_API_KEY,
  });
});

// Secure endpoint to get the API key - requires proper authentication in production
router.get("/api-key", (req, res) => {
  const apiKey = process.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ 
      error: "API key not configured on the server. Please set VITE_OPENROUTER_API_KEY in your .env file." 
    });
  }
  
  // In production, you would add authentication here
  // For now, we're providing the key directly, but in a real app
  // you would verify the user is authenticated before providing the key
  
  res.json({ 
    apiKey 
  });
});

export default router;
