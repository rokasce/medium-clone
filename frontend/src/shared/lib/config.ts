const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  APP_NAME: 'Medium Clone',
  VERSION: '1.0.0',
} as const;

export default config;
