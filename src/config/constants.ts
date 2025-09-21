export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login/`,
  REGISTER: `${API_BASE_URL}/api/auth/register/`,
  USER: `${API_BASE_URL}/api/auth/user/`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password/`,
  DELETE_ACCOUNT: `${API_BASE_URL}/api/auth/delete-account/`,
  
  // Google authentication
  GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google/login/`,
  GOOGLE_REGISTER: `${API_BASE_URL}/api/auth/google/register/`,
  
  // Social platforms
  PLATFORMS: `${API_BASE_URL}/api/social/platforms/`,
  ACCOUNTS: `${API_BASE_URL}/api/social/accounts/`,
  CONNECT_PLATFORM: (platform: string) => `${API_BASE_URL}/api/social/connect/${platform}/`,
  DISCONNECT_ACCOUNT: (accountId: number) => `${API_BASE_URL}/api/social/disconnect/${accountId}/`,
  SOCIAL_CALLBACK: (platform: string) => `${API_BASE_URL}/api/social/callback/${platform}/`,
  
  // API Tokens
  TOKENS: `${API_BASE_URL}/api/tokens/`,
  TOKEN_DETAIL: (tokenId: number) => `${API_BASE_URL}/api/tokens/${tokenId}/`,
  
  // Social posting
  SOCIAL_POST: `${API_BASE_URL}/api/social/post/`,
  
  // Analytics
  ANALYTICS: `${API_BASE_URL}/api/social/analytics/`,
  ACCOUNT_ANALYTICS: (accountId: number) => `${API_BASE_URL}/api/social/analytics/${accountId}/`,
  REFRESH_ANALYTICS: (accountId: number) => `${API_BASE_URL}/api/social/analytics/${accountId}/refresh/`,
  DETAILED_ANALYTICS: (accountId: number) => `${API_BASE_URL}/api/social/analytics/${accountId}/detailed/`,
  DEBUG_ACCOUNT: (accountId: number) => `${API_BASE_URL}/api/social/debug/${accountId}/`,
  
  // Video management
  VIDEOS: (accountId: number) => `${API_BASE_URL}/api/social/videos/${accountId}/`,
  VIDEO_DETAILS: (accountId: number, videoId: string) => `${API_BASE_URL}/api/social/videos/${accountId}/${videoId}/`,
  UPDATE_VIDEO: (accountId: number, videoId: string) => `${API_BASE_URL}/api/social/videos/${accountId}/${videoId}/update/`,
  
  // YouTube platform settings (general, not video-specific)
  VIDEO_CATEGORIES: (accountId: number) => `${API_BASE_URL}/api/social/youtube/${accountId}/categories/`,
  SUPPORTED_LANGUAGES: (accountId: number) => `${API_BASE_URL}/api/social/youtube/${accountId}/languages/`,
}