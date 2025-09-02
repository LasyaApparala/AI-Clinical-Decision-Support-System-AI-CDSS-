import { createContext, useContext, useState } from 'react'
import React from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Citation {
  id: string
  snippet: string
  url?: string
  score?: number
}

interface ChatContextType {
  messages: Message[]
  citations: Citation[]
  addMessage: (message: Message) => void
  setCitations: (citations: Citation[]) => void
  clearMessages: () => void
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  citations: [],
  addMessage: () => {},
  setCitations: () => {},
  clearMessages: () => {}
})

export const ChatProvider = ({ children }: { children: any }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [citations, setCitations] = useState<Citation[]>([])

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const clearMessages = () => {
    setMessages([])
    setCitations([])
  }

  return (
    <ChatContext.Provider value={{ 
      messages, 
      citations, 
      addMessage, 
      setCitations, 
      clearMessages 
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
