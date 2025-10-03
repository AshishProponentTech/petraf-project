// API Adapter - Switch between mock and production
import { apiClient } from './client'
import { mockApiClient } from './mock/client'

// Environment-based API selection
const isDevelopment = process.env.NODE_ENV === 'development'
const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || isDevelopment

export const api = useMock ? mockApiClient : apiClient

// Re-export types for convenience
export * from './types'

// Export both clients for testing
export { apiClient, mockApiClient }
