const config = {
  // Hardcoded for production - Vercel not reading env vars
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://ssi-identity-backend.onrender.com/api'
    : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api')
};

console.log('🔧 CONFIG:', config.apiUrl);

export default config;
