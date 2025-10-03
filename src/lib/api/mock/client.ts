// Mock API Client - For development
import { 
  HealthResponse, 
  SessionCreateResponse,
  SessionInfo,
  ChatStreamResponse,
  GoalsGetResponse,
  AdminStatsResponse,
  AdminAuditLogsResponse,
  AdminRagUploadResponse
} from '../types'

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json()
}

class MockApiClient {
  // Simple SSE-like simulator: yields chunks over time
  async *streamChatMock(fullText: string, chunkSize = 20, delayMs = 60): AsyncGenerator<ChatStreamResponse> {
    yield { event: 'start', data: { phase: 'g4_future', step: 'collect', timestamp: new Date().toISOString() } }
    
    for (let i = 0; i < fullText.length; i += chunkSize) {
      const chunk = fullText.slice(i, i + chunkSize)
      yield { 
        event: 'message', 
        data: { 
          content: chunk,
          phase: 'g4_future',
          step: 'collect',
          chunk_index: Math.floor(i / chunkSize) + 1
        } 
      }
      if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs))
    }
    
    yield { 
      event: 'complete', 
      data: { 
        full_response: fullText,
        chunks: Math.ceil(fullText.length / chunkSize),
        tokens_used: { input: 245, output: 178, total: 423 },
        latency_ms: 2340,
        timestamp: new Date().toISOString()
      } 
    }
  }

  // Health Check
  async health(): Promise<HealthResponse> {
    return getJSON<HealthResponse>('/mock/health.json')
  }

  // Session Management
  async createSession(): Promise<SessionCreateResponse> {
    return getJSON<SessionCreateResponse>('/mock/session_create.json')
  }

  async updateSessionInfo(_payload: any): Promise<SessionInfo> {
    return getJSON<SessionInfo>('/mock/session_put_info_response.json')
  }

  async resumeSession(_token: string): Promise<SessionInfo> {
    return getJSON<SessionInfo>('/mock/session_resume.json')
  }

  // Chat Streaming - Phase-specific responses
  async *streamChat(phase: 'g4_future' | 'g6_values' | 'g8_actions', _request: any): AsyncGenerator<ChatStreamResponse> {
    const responses = {
      g4_future: "That's a wonderful vision! Becoming a senior engineer and leading a team shows great ambition. Based on Sunrise Corp's career framework, the path from L4 to L5 Senior Engineer typically requires:\n\n• 3+ years of experience (you're at 3 already!)\n• Technical leadership in 2+ projects\n• Mentoring junior developers\n• System design expertise\n\nLet's make this more specific! Tell me: What specific technical areas do you want to master? And how many people would you like to lead?",
      
      g6_values: "Excellent! Now let's explore your core values. 🌟\n\nWhat 3-5 values are most important to you in your work?\n\nExamples: innovation, collaboration, integrity, growth, impact, balance\n\nUnderstanding your values ensures your goals align with what truly matters.",
      
      g8_actions: "Perfect! Now for the most important part: What specific actions will you take? 🎯\n\nBased on your goal to become a Senior Engineer leading a team, what concrete steps will you take in the next 6 months?\n\nThink about:\n• Skills to develop\n• Projects to lead\n• People to mentor\n• Courses to complete"
    }

    const text = responses[phase]
    yield* this.streamChatMock(text, 18, 25)
  }

  // Goals
  async getGoals(): Promise<GoalsGetResponse> {
    return getJSON<GoalsGetResponse>('/mock/goals_get.json')
  }

  // Admin APIs
  async adminStats(): Promise<AdminStatsResponse> {
    return getJSON<AdminStatsResponse>('/mock/admin_stats_overview.json')
  }

  async adminAuditLogs(): Promise<AdminAuditLogsResponse> {
    return getJSON<AdminAuditLogsResponse>('/mock/admin_audit_logs.json')
  }

  async adminRagUpload(_file: File, _category: string, _metadata?: Record<string, string>): Promise<AdminRagUploadResponse> {
    return getJSON<AdminRagUploadResponse>('/mock/admin_rag_upload_response.json')
  }
}

// Export mock instance
export const mockApiClient = new MockApiClient()
export default mockApiClient
