// API Client - Production implementation
import { 
  HealthResponse, 
  SessionCreateRequest, 
  SessionCreateResponse,
  SessionInfoRequest,
  SessionInfo,
  SessionResponse,
  ChatStreamRequest,
  ChatStreamResponse,
  ChatRequest,
  ChatResponse,
  ConversationHistoryRequest,
  ConversationHistoryResponse,
  MessageStatsResponse,
  GoalsGetResponse,
  GoalSummaryResponse,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalLinkRequest,
  GoalLinkResponse,
  SessionResumeRequest,
  SessionStateResponse,
  ConversationStateResponse,
  FSMStateResponse,
  SessionAdvanceStepResponse,
  TenantResponse,
  TenantConfigResponse,
  TokenValidateRequest,
  TokenValidateResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  TokenRevokeRequest,
  Employee,
  CreateEmployeeRequest,
  EmployeeTokenRequest,
  EmployeeTokenResponse,
  EmployeeSession,
  AdminStatsResponse,
  AdminAuditLogsResponse,
  AdminRagUploadRequest,
  AdminRagUploadResponse
} from './types'

class ApiClient {
  private baseURL: string
  private tenantId: string

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', tenantId: string = process.env.NEXT_PUBLIC_TENANT_ID || '550e8400-e29b-41d4-a716-446655440000') {
    // In development mode, use relative URLs to leverage Next.js API proxy
    const isDev = process.env.NODE_ENV === 'development'
    this.baseURL = isDev ? '' : baseURL
    
    // Use tenant ID from localStorage if available (from admin login)
    this.tenantId = typeof window !== 'undefined' 
      ? localStorage.getItem('tenant_id') || tenantId
      : tenantId
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

  async getSession(sessionId: string): Promise<SessionResponse> {
    return this.request<SessionResponse>(`/api/session/${sessionId}`)
  }

  async completeSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/session/${sessionId}/complete`, {
      method: 'POST',
    })
  }

  // Session State Management
  async getSessionState(sessionId: string): Promise<SessionStateResponse> {
    return this.request<SessionStateResponse>(`/api/session/${sessionId}/state`)
  }

  async getConversationState(sessionId: string): Promise<ConversationStateResponse> {
    return this.request<ConversationStateResponse>(`/api/session/${sessionId}/state`)
  }

  async getFSMState(sessionId: string): Promise<FSMStateResponse> {
    return this.request<FSMStateResponse>(`/api/session/${sessionId}/fsm`)
  }

  async advanceStep(sessionId: string): Promise<SessionAdvanceStepResponse> {
    return this.request<SessionAdvanceStepResponse>(`/api/session/${sessionId}/advance-step`, {
      method: 'POST',
    })
  }

  // Chat Streaming
  async *streamChat(phase: string, request: ChatStreamRequest): AsyncGenerator<ChatStreamResponse> {
    const stream = await this.streamRequest(`/api/chat/${phase}/stream`, request)
    const reader = stream.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const events = chunk.split('\n\n').filter(e => e.trim())

        for (const event of events) {
          if (event.startsWith('data:')) {
            const lines = event.split('\n')
            let eventType = null
            let eventData = null

            for (const line of lines) {
              if (line.startsWith('data: event:')) {
                eventType = line.replace('data: event:', '').trim()
              } else if (line.startsWith('data: data:')) {
                eventData = JSON.parse(line.replace('data: data:', '').trim())
              }
            }

            if (eventType && eventData) {
              yield { event: eventType as any, data: eventData }
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  // Chat Methods
  async chat(phase: string, request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/api/chat/${phase}`, {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getConversationHistory(request: ConversationHistoryRequest): Promise<ConversationHistoryResponse> {
    return this.request<ConversationHistoryResponse>('/api/chat/history', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getMessageStats(sessionId: string): Promise<MessageStatsResponse> {
    return this.request<MessageStatsResponse>(`/api/chat/stats/${sessionId}`)
  }

  // Goals
  async getGoals(sessionId: string, finalOnly: boolean = true): Promise<GoalsGetResponse> {
    return this.request<GoalsGetResponse>(`/api/goals/session/${sessionId}?final_only=${finalOnly}`)
  }

  async getGoalSummary(sessionId: string): Promise<GoalSummaryResponse> {
    return this.request<GoalSummaryResponse>(`/api/goals/session/${sessionId}/summary`)
  }

  async createGoal(request: CreateGoalRequest): Promise<Goal> {
    return this.request<Goal>('/api/goals/create', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getGoal(goalId: string): Promise<Goal> {
    return this.request<Goal>(`/api/goals/${goalId}`)
  }

  async updateGoal(goalId: string, request: UpdateGoalRequest): Promise<Goal> {
    return this.request<Goal>(`/api/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    })
  }

  async deleteGoal(goalId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/goals/${goalId}`, {
      method: 'DELETE',
    })
  }

  async createGoalLink(request: GoalLinkRequest): Promise<GoalLinkResponse> {
    return this.request<GoalLinkResponse>('/api/goals/link', {
      method: 'POST',
      body: JSON.stringify(request),
    })
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

  // Tenant Management
  async getTenants(): Promise<TenantResponse[]> {
    return this.request<TenantResponse[]>('/api/admin/tenants', {
      headers: {
        'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_sk_sunrise_abc123xyz789',
      },
    })
  }

  async getTenantConfig(tenantId: string): Promise<TenantConfigResponse> {
    return this.request<TenantConfigResponse>(`/api/admin/tenants/${tenantId}/config`, {
      headers: {
        'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_sk_sunrise_abc123xyz789',
      },
    })
  }

  async updateTenantConfig(tenantId: string, config: Record<string, any>): Promise<TenantConfigResponse> {
    return this.request<TenantConfigResponse>(`/api/admin/tenants/${tenantId}/config`, {
      method: 'PUT',
      headers: {
        'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_sk_sunrise_abc123xyz789',
      },
      body: JSON.stringify({ config }),
    })
  }

  async getTenantStats(tenantId: string): Promise<AdminStatsResponse> {
    return this.request<AdminStatsResponse>(`/api/admin/stats/tenant/${tenantId}`, {
      headers: {
        'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_KEY || 'admin_sk_sunrise_abc123xyz789',
      },
    })
  }

  // Token Management
  async validateToken(request: TokenValidateRequest): Promise<TokenValidateResponse> {
    return this.request<TokenValidateResponse>('/api/token/validate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async refreshToken(request: TokenRefreshRequest): Promise<TokenRefreshResponse> {
    return this.request<TokenRefreshResponse>('/api/token/refresh', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async revokeToken(request: TokenRevokeRequest): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/token/revoke', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async verifyApiToken(): Promise<{ valid: boolean; token_type?: string }> {
    return this.request<{ valid: boolean; token_type?: string }>('/api/token/verify-api-token')
  }

  // Employee Management
  async getEmployees(): Promise<Employee[]> {
    const adminKey = typeof window !== 'undefined' ? localStorage.getItem('admin_key') : null
    return this.request<Employee[]>('/api/admin/employees', {
      headers: {
        'X-Admin-Key': adminKey || process.env.NEXT_PUBLIC_ADMIN_KEY || '',
      },
    })
  }

  async createEmployee(request: CreateEmployeeRequest): Promise<Employee> {
    const adminKey = typeof window !== 'undefined' ? localStorage.getItem('admin_key') : null
    return this.request<Employee>('/api/admin/employees', {
      method: 'POST',
      headers: {
        'X-Admin-Key': adminKey || process.env.NEXT_PUBLIC_ADMIN_KEY || '',
      },
      body: JSON.stringify(request),
    })
  }

  async generateEmployeeToken(request: EmployeeTokenRequest): Promise<EmployeeTokenResponse> {
    const adminKey = typeof window !== 'undefined' ? localStorage.getItem('admin_key') : null
    return this.request<EmployeeTokenResponse>('/api/admin/employees/token', {
      method: 'POST',
      headers: {
        'X-Admin-Key': adminKey || process.env.NEXT_PUBLIC_ADMIN_KEY || '',
      },
      body: JSON.stringify(request),
    })
  }

  async getEmployeeSessions(): Promise<EmployeeSession[]> {
    const adminKey = typeof window !== 'undefined' ? localStorage.getItem('admin_key') : null
    return this.request<EmployeeSession[]>('/api/admin/employees/sessions', {
      headers: {
        'X-Admin-Key': adminKey || process.env.NEXT_PUBLIC_ADMIN_KEY || '',
      },
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
