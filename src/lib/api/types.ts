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
  phase: string
  step: 'collect' | 'refine' | 'score' | 'finalize'
  metadata?: Record<string, any>
}

export type ChatStreamResponse = {
  event: 'start' | 'message' | 'complete' | 'score' | 'step_transition' | 'phase_transition' | 'goal_saved' | 'error'
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
    // Score event data
    score?: number
    threshold?: number
    reasons?: string
    suggestions?: string[]
    passed?: boolean
    // Step transition data
    from_step?: string
    to_step?: string
    // Phase transition data
    from_phase?: string
    to_phase?: string
    // Goal saved data
    goal_id?: string
    goal_type?: string
    // Error data
    error?: string
  }
}

export type Goal = {
  id: string
  type: 'future' | 'role' | 'values' | 'themes' | 'focus' | 'actions'
  phase: 'g4_future' | 'g4_role' | 'g6_values' | 'g6_themes' | 'g8_focus' | 'g8_actions'
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

export type SessionStateResponse = {
  session_id: string
  phase: string
  step: string
  retry_count: number
  consecutive_low_scores: number
  last_score: number | null
  last_saved_at?: string
}

export type SessionAdvanceStepResponse = {
  session_id: string
  phase: string
  step: string
  retry_count: number
  last_score: number | null
}

// Additional session types
export type SessionResponse = {
  id: string
  tenant_id: string
  status: 'active' | 'completed' | 'abandoned'
  employee_code?: string
  department?: string
  position?: string
  grade?: string
  years_of_service?: number
  age_range?: string
  job_type?: string
  completion_percentage?: number
  created_at: string
  updated_at: string
  last_accessed_at?: string
  expires_at?: string
}

export type ConversationStateResponse = {
  session_id: string
  phase: string
  step: string
  retry_count: number
  consecutive_low_scores: number
  last_score: number | null
  last_saved_at?: string
}

export type FSMStateResponse = {
  session_id: string
  current_state: string
  available_transitions: string[]
  metadata?: Record<string, any>
}

// Chat types
export type ChatRequest = {
  session_id: string
  message: string
  phase: string
  step: string
  metadata?: Record<string, any>
}

export type ChatResponse = {
  content: string
  phase: string
  step: string
  tokens_used?: {
    input: number
    output: number
    total: number
  }
  latency_ms?: number
  timestamp: string
}

export type ConversationHistoryRequest = {
  session_id: string
  limit?: number
  offset?: number
}

export type ConversationHistoryResponse = {
  messages: ChatMessage[]
  total: number
  session_id: string
}

export type MessageStatsResponse = {
  session_id: string
  total_messages: number
  user_messages: number
  assistant_messages: number
  avg_response_time_ms: number
  total_tokens_used: number
  phases_completed: string[]
}

// Goal types
export type GoalSummaryResponse = {
  session_id: string
  total_goals: number
  completed_goals: number
  avg_score: number
  goals_by_type: Record<string, number>
  completion_rate: number
  last_updated: string
}

export type CreateGoalRequest = {
  session_id: string
  goal_type: string
  content: string
  phase: string
  metadata?: Record<string, any>
}

export type UpdateGoalRequest = {
  content?: string
  score?: number
  metadata?: Record<string, any>
}

export type GoalLinkRequest = {
  source_goal_id: string
  target_goal_id: string
  link_type: string
  strength: number
}

export type GoalLinkResponse = {
  id: string
  source_goal_id: string
  target_goal_id: string
  link_type: string
  strength: number
  created_at: string
}

// Admin types
export type TenantResponse = {
  id: string
  name: string
  domain?: string
  status: 'active' | 'inactive'
  created_at: string
  config?: Record<string, any>
}

export type TenantConfigResponse = {
  tenant_id: string
  config: Record<string, any>
  updated_at: string
}

// Token types
export type TokenValidateRequest = {
  token: string
}

export type TokenValidateResponse = {
  valid: boolean
  token_type?: string
  expires_at?: string
}

export type TokenRefreshRequest = {
  refresh_token: string
}

export type TokenRefreshResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
}

export type TokenRevokeRequest = {
  token: string
}

// Employee Management Types
export type Employee = {
  id: string
  employee_code: string
  name: string
  email: string
  department: string
  position: string
  grade: string
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  last_login?: string
  session_count: number
  goals_completed: number
}

export type CreateEmployeeRequest = {
  employee_code: string
  name: string
  email: string
  department: string
  position: string
  grade: string
}

export type EmployeeTokenRequest = {
  employee_id: string
  expires_in_days: number
  send_email: boolean
  custom_message?: string
}

export type EmployeeTokenResponse = {
  token: string
  expires_at: string
  employee_id: string
  email_sent: boolean
}

export type EmployeeSession = {
  id: string
  employee_id: string
  employee_name: string
  department: string
  position: string
  phase: string
  step: string
  status: 'active' | 'completed' | 'abandoned'
  created_at: string
  last_accessed_at: string
  expires_at: string
  goals_completed: number
  total_goals: number
  completion_percentage: number
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

