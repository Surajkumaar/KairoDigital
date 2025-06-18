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
  
  // Ensure the API key is properly formatted (trim any whitespace)
  const formattedApiKey = apiKey.trim();
  
  // Validate that the API key looks reasonable
  if (formattedApiKey.length < 10) {
    return res.status(500).json({
      error: "API key appears to be invalid (too short). Please check your VITE_OPENROUTER_API_KEY in .env file."
    });
  }
  
  // In production, you would add authentication here
  // For now, we're providing the key directly, but in a real app
  // you would verify the user is authenticated before providing the key
  
  // Log that the API key was successfully retrieved (without showing the key)
  console.log(`API key successfully retrieved. Key length: ${formattedApiKey.length}`);
  
  res.json({ 
    apiKey: formattedApiKey 
  });
});

export default router;
