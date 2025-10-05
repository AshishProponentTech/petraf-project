// Mock API Client
import { SessionCreateRequest, SessionCreateResponse, Session } from '../types';

// Mock API client implementation
class MockApiClient {
  // Mock session creation
  async createSession(request?: SessionCreateRequest): Promise<SessionCreateResponse> {
    console.log('[Mock API] Creating session with request:', request);
    
    // Generate a mock session ID
    const sessionId = `mock-session-${Date.now()}`;
    
    return {
      session_id: sessionId,
      resume_token: `mock-token-${sessionId}`,
    };
  }
  
  // Add other API methods as needed
}

// Export the mock client
export const mockApiClient = new MockApiClient();