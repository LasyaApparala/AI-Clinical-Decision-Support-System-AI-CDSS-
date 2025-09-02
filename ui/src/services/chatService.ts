// services/chatService.ts
import api from './api'
export const chatService = {
  async createSession(token: string) {
    const { data } = await api.post('/chat/session', {})
    return data
  },
  async query(token: string, body: any) {
    const { data } = await api.post('/chat/query', body)
    return data
  },
  async history(sessionId: string) {
    const { data } = await api.get('/chat/history', { params: { sessionId } })
    return data
  }
}
