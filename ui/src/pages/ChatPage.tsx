import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import CitationPanel from '../components/ChatWindow/CitationPanel'
import ChatMessage from '../components/ChatWindow/ChatMessage'
import ChatInput from '../components/ChatWindow/ChatInput'
import { chatService } from '../services/chatService'

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export default function ChatPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [currentQuery, setCurrentQuery] = useState('')
  const [isDeepReasoning, setIsDeepReasoning] = useState(true)
  const { messages, addMessage, citations, setCitations } = useChat()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    (async () => {
      const s = await chatService.createSession(token!)
      setSessionId(s.sessionId)
      loadChatHistory()
    })()
  }, [])

  useEffect(() => { 
    endRef.current?.scrollIntoView({ behavior: 'smooth' }) 
  }, [messages])

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/chat/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const sessions = await response.json()
        setChatHistory(sessions)
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const send = async (text: string) => {
    if (!text.trim() || !sessionId) return
    const userMsg = { role: 'user' as const, content: text }
    addMessage(userMsg)
    setLoading(true)
    try {
      const res = await chatService.query(token!, { 
        sessionId, 
        message: text,
        deepReasoning: isDeepReasoning 
      })
             addMessage({ role: 'assistant' as const, content: res.answer })
      setCitations(res.sources || [])
      loadChatHistory() // Refresh chat history after new message
    } finally {
      setLoading(false)
    }
  }

  const startNewChat = async () => {
    try {
      const s = await chatService.createSession(token!)
      setSessionId(s.sessionId)
      // Clear current messages for new chat
      window.location.reload() // Simple way to reset the chat context
    } catch (error) {
      console.error('Failed to start new chat:', error)
    }
  }

  const quickActions = [
    { icon: '🔬', label: 'Draft DDx' },
    { icon: '📝', label: 'Draft A&P' },
    { icon: '❓', label: 'Ask a Question' },
    { icon: '📋', label: 'Draft H&P' },
    { icon: '📄', label: 'Draft Progress Note' },
    { icon: '📊', label: 'Draft DC Summary' },
    { icon: '💊', label: 'Draft DC Instructions' },
    { icon: '📖', label: 'Draft Patient Handout' }
  ]

  const handleQuickAction = (action: string) => {
    setCurrentQuery(action)
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 flex flex-col border-r border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={startNewChat}
            className="w-full bg-blue-700 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-800 transition-colors"
          >
            New Chat
          </button>
        </div>
        
        <nav className="flex-grow">
          <ul>
            <li className="mb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-sm font-semibold text-gray-500">Today</h3>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <ul className="mt-2 space-y-2">
                {chatHistory
                  .filter(session => {
                    const today = new Date()
                    const sessionDate = new Date(session.timestamp)
                    return sessionDate.toDateString() === today.toDateString()
                  })
                  .slice(0, 3)
                  .map(session => (
                    <li key={session.id}>
                      <a className="block text-sm text-gray-600 hover:text-blue-700 truncate" href="#">
                        {session.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </li>
            
            <li className="mb-4">
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-sm font-semibold text-gray-500">Last 7 Days</h3>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <ul className="mt-2 space-y-2">
                {chatHistory
                  .filter(session => {
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    const sessionDate = new Date(session.timestamp)
                    return sessionDate > weekAgo && sessionDate.toDateString() !== new Date().toDateString()
                  })
                  .slice(0, 3)
                  .map(session => (
                    <li key={session.id}>
                      <a className="block text-sm text-gray-600 hover:text-blue-700 truncate" href="#">
                        {session.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </li>
            
            <li>
              <div className="flex justify-between items-center cursor-pointer">
                <h3 className="text-sm font-semibold text-gray-500">Last 30 Days</h3>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <ul className="mt-2 space-y-2">
                {chatHistory
                  .filter(session => {
                    const monthAgo = new Date()
                    monthAgo.setDate(monthAgo.getDate() - 30)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    const sessionDate = new Date(session.timestamp)
                    return sessionDate > monthAgo && sessionDate <= weekAgo
                  })
                  .slice(0, 3)
                  .map(session => (
                    <li key={session.id}>
                      <a className="block text-sm text-gray-600 hover:text-blue-700 truncate" href="#">
                        {session.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 1440 1024&quot; fill=&quot;none&quot;><path d=&quot;M-154.5 1060C-52.5 899.5 25.5 737.5 119.5 596C213.5 454.5 352 329 515.5 244.5C679 160 869 119.5 1061 106&quot; stroke=&quot;%23EBF5FF&quot; stroke-width=&quot;2&quot;/><path d=&quot;M-159 1060C-16.5 1060 178.5 984.5 365 745.5C551.5 506.5 729.5 301.5 901 155C1072.5 8.5 1256.5 -48 1440 -99.5&quot; stroke=&quot;%23EBF5FF&quot; stroke-width=&quot;2&quot;/><path d=&quot;M-154.5 596C-28.5 528.5 121.5 464 290 410.5C458.5 357 645.5 314.5 831 292C1016.5 269.5 1200.5 267 1367 282.5&quot; stroke=&quot;%23EBF5FF&quot; stroke-width=&quot;2&quot;/><path d=&quot;M-154.5 166.5C-106.5 204.5 13 291 169.5 397C326 503 519 628.5 720.5 700.5C922 772.5 1132 791 1319 769.5&quot; stroke=&quot;%23EBF5FF&quot; stroke-width=&quot;2&quot;/><path d=&quot;M-154.5 166.5C-130.5 137.5 174.5 -121.5 467.5 -79C760.5 -36.5 1041.5 144.5 1282.5 266&quot; stroke=&quot;%23EBF5FF&quot; stroke-width=&quot;2&quot;/></svg>')] opacity-80"></div>
        
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white relative z-10">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/subscription')}
              className="bg-blue-700 text-white font-semibold py-2 px-4 rounded-full text-sm hover:bg-blue-800 transition-colors"
            >
              Upgrade to Glass Pro
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
          {messages.length === 0 ? (
            <>
              <div className="text-center">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">GLASS HEALTH</h1>
                <p className="text-gray-600 mt-1">AI Clinical Decision Support</p>
              </div>
              
              <div className="w-full max-w-2xl mt-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                      {isDeepReasoning ? 'Deep Reasoning' : 'Standard'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && send(currentQuery)}
                    className="w-full pl-36 pr-12 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                    placeholder="How can I help you?"
                  />
                  <button 
                    onClick={() => send(currentQuery)}
                    disabled={!currentQuery.trim() || loading}
                    className="absolute inset-y-0 right-0 mr-4 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 my-auto transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {quickActions.slice(0, 5).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.label)}
                    className="bg-white hover:bg-blue-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-full text-sm flex items-center space-x-2 transition-colors"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {quickActions.slice(5).map((action, index) => (
                  <button
                    key={index + 5}
                    onClick={() => handleQuickAction(action.label)}
                    className="bg-white hover:bg-blue-50 border border-gray-300 text-gray-700 py-2 px-4 rounded-full text-sm flex items-center space-x-2 transition-colors"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">Glass 4.0 v2025-07-29</p>
            </>
          ) : (
            <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((m, i) => (
                  <ChatMessage key={i} role={m.role} content={m.content} />
                ))}
                {loading && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Thinking...</span>
                  </div>
                )}
                <div ref={endRef} />
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                      {isDeepReasoning ? 'Deep Reasoning' : 'Standard'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && send(currentQuery)}
                    className="w-full pl-36 pr-12 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
                    placeholder="How can I help you?"
                    disabled={loading}
                  />
                  <button 
                    onClick={() => send(currentQuery)}
                    disabled={!currentQuery.trim() || loading}
                    className="absolute inset-y-0 right-0 mr-4 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 my-auto transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 bg-white w-full relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-500 mb-4">
              Our Glass Health AI Clinical Decision Support (CDS) platform is designed to enhance the clinical decision-making processes of clinicians. Our AI CDS generates drafts of differential diagnoses, assessments & plans, and answers to clinical reference questions. The available core features of the platform are not designed for and should not be used for acquiring, processing, or analyzing medical images, signals from in vitro diagnostic devices, or patterns or signals from signal acquisition systems.{' '}
              <a className="text-blue-600 underline" href="#">Read full disclaimer</a>
            </p>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 space-x-4">
                <a className="hover:underline" href="#">Terms of Service</a>
                <a className="hover:underline" href="#">Privacy Policy</a>
              </div>
              <div className="relative w-1/3">
                <input 
                  className="w-full text-xs border-b border-gray-300 focus:outline-none focus:border-blue-500 py-1" 
                  placeholder="Leave feedback..." 
                  type="text"
                />
                <button className="absolute right-0 top-0.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Citation Panel */}
      {citations && citations.length > 0 && (
        <CitationPanel sources={citations} />
      )}
    </div>
  )
}
