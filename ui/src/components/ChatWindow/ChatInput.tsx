// ChatInput.tsx
import { useState } from 'react'
import React from 'react'
export default function ChatInput({ onSend, disabled }: { onSend: (t: string)=>void, disabled?: boolean }) {
  const [v, setV] = useState('')
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSend(v); setV('') }}>
      <textarea value={v} onChange={e=>setV(e.target.value)} placeholder="Enter case details or question…" disabled={disabled}/>
      <button disabled={disabled || !v.trim()}>Send</button>
    </form>
  )
}
