/**
 * Environment variables management
 * This module provides a reliable way to access environment variables in the application
 */

// Define the structure of our environment variables
interface EnvVariables {
  OPENROUTER_API_KEY: string;
}

/**
 * Get environment variables from various sources
 * This function tries multiple methods to access environment variables
 */
function loadEnvVariables(): EnvVariables {
  // Default empty values
  const env: EnvVariables = {
    OPENROUTER_API_KEY: '',
  };
  
  try {
    // Method 1: Try to get from import.meta.env (standard Vite approach)
    if (typeof import.meta !== 'undefined' && 
        typeof import.meta.env !== 'undefined' && 
        import.meta.env.VITE_OPENROUTER_API_KEY) {
      env.OPENROUTER_API_KEY = String(import.meta.env.VITE_OPENROUTER_API_KEY).trim();
      console.log('Successfully loaded API key from environment variables');
    } else {
      console.warn('VITE_OPENROUTER_API_KEY not found in import.meta.env');
      
      // Try to fetch from server if client-side environment variable is not available
      if (typeof window !== 'undefined') {
        console.log('Will attempt to fetch API key from server');
      }
    }
  } catch (error) {
    console.error('Error accessing environment variables:', error);
  }
  
  return env;
}

// Load environment variables
export const env = loadEnvVariables();

/**
 * Validates that required environment variables are set
 * @throws Error if any required environment variable is missing
 */
export function validateEnv(): void {
  if (!env.OPENROUTER_API_KEY) {
    throw new Error(
      'OpenRouter API key not found. Please set VITE_OPENROUTER_API_KEY in your .env file.'
    );
  }
}
