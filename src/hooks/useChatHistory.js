import { useState, useEffect } from 'react'

const STORAGE_KEY = 'posyandu_chat_history'

export const useChatHistory = () => {
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      setSessions(parsed.sessions || [])
      setCurrentSessionId(parsed.currentSessionId || null)
    } else {
      // Create first session
      createNewSession()
    }
  }, [])

  // Save to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sessions,
        currentSessionId
      }))
    }
  }, [sessions, currentSessionId])

  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      title: 'Obrolan Baru',
      messages: [{
        role: 'assistant',
        content: 'Halo! Saya asisten AI Posyandu Menur. Saya siap membantu Anda dengan konsultasi kesehatan, terutama terkait kesehatan ibu dan anak, imunisasi, gizi, dan layanan posyandu lainnya. Ada yang bisa saya bantu hari ini? 😊'
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    return newSession
  }

  const getCurrentSession = () => {
    return sessions.find(s => s.id === currentSessionId)
  }

  const updateSessionMessages = (sessionId, messages) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        // Auto-generate title from first user message
        let title = session.title
        if (title === 'Obrolan Baru' && messages.length > 1) {
          const firstUserMsg = messages.find(m => m.role === 'user')
          if (firstUserMsg) {
            title = firstUserMsg.content.slice(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '')
          }
        }
        
        return {
          ...session,
          messages,
          title,
          updatedAt: new Date().toISOString()
        }
      }
      return session
    }))
  }

  const deleteSession = (sessionId) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId)
      
      // If deleting current session, switch to another
      if (sessionId === currentSessionId) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[0].id)
        } else {
          // Create new session if no sessions left
          setTimeout(() => createNewSession(), 0)
        }
      }
      
      return filtered
    })
  }

  const switchSession = (sessionId) => {
    setCurrentSessionId(sessionId)
  }

  const clearAllSessions = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSessions([])
    setCurrentSessionId(null)
    createNewSession()
  }

  return {
    sessions,
    currentSession: getCurrentSession(),
    currentSessionId,
    createNewSession,
    updateSessionMessages,
    deleteSession,
    switchSession,
    clearAllSessions
  }
}
