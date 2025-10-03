export type HealthResponse = {
    status: string
    version: string
    timestamp: string
    services: Record<string, string>
  }
  
  export type SessionCreateResponse = {
    session_id: string
    resume_token: string
    expires_at: string
    status: 'active' | 'completed'
  }
  
  export type SessionInfo = {
    id: string
    tenant_id: string
    status: string
    employee_code?: string
    department?: string
    position?: string
    grade?: string
    years_of_service?: number
    age_range?: string
    job_type?: string
    completion_percentage?: number
    created_at?: string
    updated_at?: string
    last_accessed_at?: string
  }
  
  export type GoalsGetResponse = {
    session_id: string
    employee: {
      code: string
      department: string
      position: string
      grade: string
    }
    goals: Array<{
      id: string
      type: 'future' | 'values' | 'actions'
      phase: 'g4_future' | 'g6_values' | 'g8_actions'
      content: string
      score: number
      is_final: boolean
      version: number
      created_at: string
      links: Array<{
        parent_goal_id: string
        link_type: string
        strength: number
      }>
    }>
    total: number
    completed: number
    summary: {
      avg_score: number
      duration_minutes: number
      message_count: number
      phases_completed: string[]
    }
    timestamp: string
  }
  
  // ✅ NEW TYPE for admin stats
  export type AdminStatsResponse = {
    active_tenants: number
    active_sessions: number
    completed_sessions: number
    total_goals_created: number
    avg_score: number
    avg_completion_rate: number
  }
  
  // ✅ NEW TYPE for audit logs
  export type AdminAuditLogsResponse = {
    logs: Array<{
      id: string
      action: string
      created_at: string
      payload: Record<string, unknown>
    }>
  }
  
  // ✅ NEW TYPE for RAG upload
  export type AdminRagUploadResponse = {
    success: boolean
    message?: string
  }
  
  async function getJSON<T>(path: string): Promise<T> {
    const res = await fetch(path, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Failed to load ${path}`)
    return res.json()
  }
  
  export const api = {
    health: () => getJSON<HealthResponse>('/mock/health.json'),
    createSession: () => getJSON<SessionCreateResponse>('/mock/session_create.json'),
    updateSessionInfo: (_payload: Partial<SessionInfo>) =>
      getJSON<SessionInfo>('/mock/session_put_info_response.json'),
    getGoals: () => getJSON<GoalsGetResponse>('/mock/goals_get.json'),
    resumeSession: (_token: string) => getJSON<SessionInfo>('/mock/session_resume.json'),
  
    // Admin ✅ with types
    adminStats: () => getJSON<AdminStatsResponse>('/mock/admin_stats_overview.json'),
    adminAuditLogs: () => getJSON<AdminAuditLogsResponse>('/mock/admin_audit_logs.json'),
    adminRagUpload: async (_file: File, _category: string, _metadata?: Record<string, string>) =>
      getJSON<AdminRagUploadResponse>('/mock/admin_rag_upload_response.json'),
  
    // Simple SSE-like simulator
    async *streamChatMock(fullText: string, chunkSize = 20, delayMs = 60) {
      for (let i = 0; i < fullText.length; i += chunkSize) {
        const chunk = fullText.slice(i, i + chunkSize)
        yield { event: 'message', data: { content: chunk } }
        if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs))
      }
      return { event: 'complete', data: { full_response: fullText } }
    },
  
    // Phase-specific stubs
    streamG4Collect() {
      const text =
        "Great vision. In the next 2 years, what role do you aim for, what skills will you build, and what team size do you want to lead?";
      return this.streamChatMock(text, 18, 25)
    },
    streamG6Collect() {
      const text =
        "List 3–5 core values important to you at work. Examples: learning, collaboration, integrity, growth, impact, balance.";
      return this.streamChatMock(text, 18, 25)
    },
    streamG8Collect() {
      const text =
        "Share specific actions for the next 6 months. Examples: certification, lead a project, mentor others, give talks, improve processes.";
      return this.streamChatMock(text, 18, 25)
    },
  }
  