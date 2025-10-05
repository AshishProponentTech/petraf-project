// API Adapter - conditionally use mock or real API client
import { apiClient } from './client'
import { mockApiClient } from './mock'

// Determine if we should use mock API
const useMockAPI = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'

// Export the appropriate client as `api`
export const api = useMockAPI ? mockApiClient : apiClient

// Re-export types for convenience
export * from './types'

// Export clients for direct access (useful for tests)
export { apiClient, mockApiClient }

// Helper function to check if using real API
export const isUsingRealAPI = () => !useMockAPI

// Helper function to get current API URL
export const getCurrentAPIUrl = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Log which API we're using
console.log(`[API Setup] Using ${useMockAPI ? 'mock' : 'real'} API`)

