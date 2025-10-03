import { useState, useEffect } from 'react'
import { api, SessionInfo, SessionCreateResponse } from '../api'

export function useSession() {
  const [session, setSession] = useState<SessionInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSession = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.createSession()
      // Store session ID in localStorage
      localStorage.setItem('petraf_session_id', response.session_id)
      localStorage.setItem('petraf_resume_token', response.resume_token)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateSessionInfo = async (sessionId: string, info: any) => {
    setLoading(true)
    setError(null)
    try {
      const updated = await api.updateSessionInfo(sessionId, info)
      setSession(updated)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resumeSession = async (token: string) => {
    setLoading(true)
    setError(null)
    try {
      const resumed = await api.resumeSession(token)
      setSession(resumed)
      return resumed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume session')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const sessionId = localStorage.getItem('petraf_session_id')
    const resumeToken = localStorage.getItem('petraf_resume_token')
    
    if (resumeToken && !session) {
      resumeSession(resumeToken).catch(() => {
        // Clear invalid tokens
        localStorage.removeItem('petraf_session_id')
        localStorage.removeItem('petraf_resume_token')
      })
    }
  }, [])

  return {
    session,
    loading,
    error,
    createSession,
    updateSessionInfo,
    resumeSession,
    clearSession: () => {
      setSession(null)
      localStorage.removeItem('petraf_session_id')
      localStorage.removeItem('petraf_resume_token')
    }
  }
}
