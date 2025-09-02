// services/authService.ts
import api from './api'
export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },
  async signup(name: string, email: string, password: string) {
    const { data } = await api.post('/auth/signup', { name, email, password })
    return data
  }
}
