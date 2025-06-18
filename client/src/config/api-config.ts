// api-config.ts
// Configuration for API keys and endpoints

// Define environment variables interface to help TypeScript understand our env vars
interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY: string;
}

// Extend the import.meta interface
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Get the OpenRouter API key from environment variables
 * This function handles different ways Vite might expose environment variables
 */
export const getOpenRouterApiKey = (): string => {
  let apiKey: string | undefined;
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Try to access the environment variable through import.meta.env
    try {
      apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    } catch (e) {
      console.error('Error accessing import.meta.env:', e);
    }
  }
  
  if (!apiKey) {
    throw new Error(
      'OpenRouter API key not found. Please ensure VITE_OPENROUTER_API_KEY is set in your .env file ' +
      'and that your Vite configuration is correctly loading it.'
    );
  }
  
  // Clean the API key by removing any quotes or whitespace
  return apiKey.toString().replace(/["'\s]/g, '');
};

// API endpoints
export const API_ENDPOINTS = {
  OPENROUTER_CHAT: 'https://openrouter.ai/api/v1/chat/completions'
};
