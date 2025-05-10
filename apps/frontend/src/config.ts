// API configuration
// For development: Uses VITE_API_URL from .env.development (http://localhost:4000)
// For production: Uses VITE_API_URL from .env.production or falls back to the Railway URL
// 
// To use a different backend URL:
// 1. Update VITE_API_URL in the appropriate .env file, or
// 2. Change the fallback URL below
const API_URL = import.meta.env.VITE_API_URL || 'https://simplepollo-production.up.railway.app';

export const config = {
  apiUrl: API_URL,
};

export default config; 