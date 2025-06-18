/**
 * Environment variables check utility
 * This file helps debug environment variable loading issues
 */

// Log environment variables to help debug
console.log('Environment Variables Check:');
console.log('---------------------------');

// Check if import.meta.env exists
console.log('import.meta.env exists:', typeof import.meta.env !== 'undefined');

// List all available environment variables from import.meta.env
console.log('Available environment variables:');
try {
  const envVars = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));
  console.log(envVars);
  
  // Check specific environment variables
  console.log('VITE_OPENROUTER_API_KEY exists:', 
    typeof import.meta.env.VITE_OPENROUTER_API_KEY !== 'undefined');
  
  if (import.meta.env.VITE_OPENROUTER_API_KEY) {
    // Only show first few characters for security
    const apiKey = String(import.meta.env.VITE_OPENROUTER_API_KEY);
    const maskedKey = apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5);
    console.log('VITE_OPENROUTER_API_KEY value (masked):', maskedKey);
  }
} catch (error) {
  console.error('Error accessing environment variables:', error);
}

// Export a dummy function to make this a valid module
export function checkEnv(): void {
  console.log('Environment check complete');
}
