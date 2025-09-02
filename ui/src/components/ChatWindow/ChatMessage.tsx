// ChatMessage.tsx
import { marked } from 'marked'
import React from 'react'

export default function ChatMessage({ role, content }: {role: 'user'|'assistant', content: string}) {
  const isUser = role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl px-4 py-3 rounded-lg ${
        isUser 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: marked.parse(content, {
              breaks: true,
              gfm: true
            }) 
          }} 
        />
      </div>
    </div>
  )
}
