// API Client - Production implementation
import { 
  HealthResponse, 
  SessionCreateRequest, 
  SessionCreateResponse,
  SessionInfoRequest,
  SessionInfo,
  ChatStreamRequest,
  ChatStreamResponse,
  GoalsGetResponse,
  SessionResumeRequest,
  AdminStatsResponse,
  AdminAuditLogsResponse,
  AdminRagUploadRequest,
  AdminRagUploadResponse
} from './types'

class ApiClient {
  private baseURL: string
  private tenantId: string

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', tenantId: string = '550e8400-e29b-41d4-a716-446655440000') {
    this.baseURL = baseURL
    this.tenantId = tenantId
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      'X-Tenant-ID': this.tenantId,
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  private async streamRequest(endpoint: string, body: any): Promise<ReadableStream<Uint8Array>> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': this.tenantId,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Stream Error: ${response.status} ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    return response.body
  }

  // Health Check
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/health')
  }

  // Session Management
  async createSession(metadata?: SessionCreateRequest['metadata']): Promise<SessionCreateResponse> {
    return this.request<SessionCreateResponse>('/api/session/create', {
      method: 'POST',
      body: JSON.stringify({ metadata }),
    })
  }

  async updateSessionInfo(sessionId: string, info: SessionInfoRequest): Promise<SessionInfo> {
    return this.request<SessionInfo>(`/api/session/${sessionId}/info`, {
      method: 'PUT',
      body: JSON.stringify(info),
    })
  }

  async resumeSession(token: string): Promise<SessionInfo> {
    return this.request<SessionInfo>('/api/session/resume', {
      method: 'POST',
      body: JSON.stringify({ resume_token: token }),
    })
  }

  // Chat Streaming
  async *streamChat(phase: 'g4_future' | 'g6_values' | 'g8_actions', request: ChatStreamRequest): AsyncGenerator<ChatStreamResponse> {
    const stream = await this.streamRequest(`/api/chat/${phase}/stream`, request)
    const reader = stream.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const event = line.slice(7)
            const nextLine = lines[lines.indexOf(line) + 1]
            if (nextLine?.startsWith('data: ')) {
              const data = JSON.parse(nextLine.slice(6))
              yield { event: event as any, data }
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  // Goals
  async getGoals(sessionId: string, finalOnly: boolean = true): Promise<GoalsGetResponse> {
    return this.request<GoalsGetResponse>(`/api/goals/session/${sessionId}?final_only=${finalOnly}`)
  }

  // Admin APIs
  async adminStats(): Promise<AdminStatsResponse> {
    return this.request<AdminStatsResponse>('/api/admin/stats/overview', {
      headers: {
        'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_sk_sunrise_abc123xyz789',
      },
    })
  }

  async adminAuditLogs(sessionId?: string, limit: number = 50): Promise<AdminAuditLogsResponse> {
    const params = new URLSearchParams({ limit: limit.toString() })
    if (sessionId) params.append('session_id', sessionId)
    
    return this.request<AdminAuditLogsResponse>(`/api/admin/audit-logs?${params}`, {
      headers: {
        'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_sk_sunrise_abc123xyz789',
      },
    })
  }

  async adminRagUpload(tenantId: string, request: AdminRagUploadRequest): Promise<AdminRagUploadResponse> {
    const formData = new FormData()
    formData.append('file', request.file)
    formData.append('category', request.category)
    if (request.metadata) {
      formData.append('metadata', JSON.stringify(request.metadata))
    }

    const response = await fetch(`${this.baseURL}/api/admin/rag/upload/${tenantId}`, {
      method: 'POST',
      headers: {
        'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_sk_sunrise_abc123xyz789',
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
