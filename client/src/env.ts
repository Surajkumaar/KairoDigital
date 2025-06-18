// Environment variables accessor
// This file provides a consistent way to access environment variables in the application

/**
 * Environment variables used in the application
 */
export const env = {
  // OpenRouter API key for AI chat completions
  OPENROUTER_API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY || '',
};

/**
 * Validates that all required environment variables are set
 * @throws Error if any required environment variable is missing
 */
export function validateEnv(): void {
  const requiredVars = [
    { key: 'OPENROUTER_API_KEY', value: env.OPENROUTER_API_KEY }
  ];

  const missingVars = requiredVars
    .filter(v => !v.value)
    .map(v => v.key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      `Please check your .env file and ensure these variables are set.`
    );
  }
}
