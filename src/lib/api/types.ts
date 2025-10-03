// API Types - Aligned with backend documentation

export type HealthResponse = {
  status: string
  version: string
  timestamp: string
  services: {
    database: string
    redis: string
    openai: string
  }
}

export type SessionCreateRequest = {
  metadata?: {
    source: string
    device: string
  }
}

export type SessionCreateResponse = {
  session_id: string
  resume_token: string
  expires_at: string
  status: 'active' | 'completed'
}

export type SessionInfoRequest = {
  employee_code: string
  department: string
  position: string
  grade: string
  years_of_service: number
  age_range: string
  job_type: string
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

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  phase?: 'g4_future' | 'g6_values' | 'g8_actions'
  step?: 'collect' | 'refine' | 'score'
  chunk_index?: number
}

export type ChatStreamRequest = {
  session_id: string
  message: string
  step: 'collect' | 'refine' | 'score'
  context?: Record<string, any>
}

export type ChatStreamResponse = {
  event: 'start' | 'message' | 'complete'
  data: {
    content?: string
    phase?: string
    step?: string
    chunk_index?: number
    full_response?: string
    chunks?: number
    tokens_used?: {
      input: number
      output: number
      total: number
    }
    latency_ms?: number
    timestamp?: string
  }
}

export type Goal = {
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
}

export type GoalsGetResponse = {
  session_id: string
  employee: {
    code: string
    department: string
    position: string
    grade: string
  }
  goals: Goal[]
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

export type SessionResumeRequest = {
  resume_token: string
}

// Admin Types
export type AdminStatsResponse = {
  total_tenants: number
  active_tenants: number
  total_sessions: number
  active_sessions: number
  completed_sessions: number
  abandoned_sessions: number
  total_messages_today: number
  total_goals_created: number
  goals_by_type: {
    future: number
    values: number
    actions: number
  }
  avg_completion_rate: number
  avg_session_duration_minutes: number
  avg_score: number
  timestamp: string
}

export type AuditLog = {
  id: string
  tenant_id: string
  session_id?: string
  actor: string
  action: string
  resource_type: string
  resource_id: string
  payload: Record<string, any>
  changes?: Record<string, any>
  status: 'success' | 'error'
  ip_address?: string
  user_agent?: string
  created_at: string
}

export type AdminAuditLogsResponse = {
  logs: AuditLog[]
  total: number
  page: number
  per_page: number
}

export type AdminRagUploadRequest = {
  file: File
  category: string
  metadata?: {
    title: string
    version: string
    department: string
  }
}

export type AdminRagUploadResponse = {
  success: boolean
  message: string
  chunks_created: number
  document_id: string
  category: string
}
