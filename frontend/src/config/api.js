// API Configuration
// Hardcoded backend URL - update this with your Render backend URL
const RENDER_BACKEND_URL = 'https://taskflow-backend-67ob.onrender.com';

const getApiBaseUrl = () => {
  // In production (Vercel), use the Render backend URL
  if (import.meta.env.PROD) {
    // First try environment variable
    if (import.meta.env.VITE_API_URL) {
      console.log('✅ Using VITE_API_URL from environment:', import.meta.env.VITE_API_URL);
      return import.meta.env.VITE_API_URL;
    }
    // Fallback to hardcoded URL
    const fallbackUrl = `${RENDER_BACKEND_URL}/api`;
    console.warn('⚠️ VITE_API_URL not set! Using fallback:', fallbackUrl);
    console.warn('💡 Set VITE_API_URL in Vercel: Settings → Environment Variables');
    return fallbackUrl;
  }
  // In development, use the Vite proxy
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

  // Log API configuration for debugging
  if (typeof window !== 'undefined') {
    console.log('🌐 API Configuration:', {
      isProduction: import.meta.env.PROD,
      apiBaseUrl: API_BASE_URL,
      viteApiUrl: import.meta.env.VITE_API_URL || 'NOT SET',
      currentUrl: window.location.href,
    });
    
    // Test API connection on load (with longer timeout for production)
    const testUrl = API_BASE_URL.includes('/api') 
      ? API_BASE_URL.replace('/api', '') + '/api/health'
      : API_BASE_URL + '/health';
    
    const timeout = import.meta.env.PROD ? 10000 : 5000; // 10s for production, 5s for dev
    
    fetch(testUrl, { 
      method: 'GET',
      signal: AbortSignal.timeout(timeout)
    })
      .then(res => res.json())
      .then(data => console.log('✅ Backend connection test:', data))
      .catch(err => {
        if (err.name === 'TimeoutError') {
          console.warn('⚠️ Backend connection test timed out - backend may be starting up (this is normal on Render free tier)');
        } else {
          console.warn('⚠️ Backend connection test failed:', err.message);
        }
      });
  }

