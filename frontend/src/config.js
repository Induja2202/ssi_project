const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
};

// Debug log
console.log('🔧 CONFIG LOADED:');
console.log('API URL:', config.apiUrl);
console.log('Environment:', process.env.NODE_ENV);
console.log('All REACT_APP vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP')));

export default config;
