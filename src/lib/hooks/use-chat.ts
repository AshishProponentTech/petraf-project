import { useState, useCallback } from 'react'
import { api, ChatStreamResponse } from '../api'

export function useChat() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (
    phase: 'g4_future' | 'g6_values' | 'g8_actions',
    message: string,
    sessionId: string
  ) => {
    if (!message.trim()) return

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setIsStreaming(true)
    setError(null)

    try {
      const request = {
        session_id: sessionId,
        message,
        step: 'collect' as const,
        context: {}
      }

      let assistantResponse = ''
      
      for await (const chunk of api.streamChat(phase, request)) {
        if (chunk.event === 'message' && chunk.data.content) {
          assistantResponse += chunk.data.content
          // Update the last message (assistant's response) in real-time
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = assistantResponse
            } else {
              newMessages.push({ role: 'assistant', content: assistantResponse })
            }
            return newMessages
          })
        } else if (chunk.event === 'complete') {
          // Finalize the assistant's response
          setMessages(prev => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = chunk.data.full_response || assistantResponse
            }
            return newMessages
          })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsStreaming(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearMessages
  }
}



