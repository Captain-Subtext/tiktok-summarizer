export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000',
  ENDPOINTS: {
    TEST_VIDEOS: '/api/test-videos',
    TEST_SUMMARY_PROCESS: '/api/test-summary/process',
    TEST_SUMMARY_CREATE: '/api/test-summary/create'
  }
} as const;

// Helper to build API URLs
export function buildApiUrl(
  endpoint: keyof typeof API_CONFIG.ENDPOINTS,
  params?: Record<string, string>
): string {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
  if (!params) return url;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, value);
  });
  
  return `${url}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
} 