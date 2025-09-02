// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import React from 'react'

type User = { 
  id: string, 
  email: string, 
  name?: string, 
  firstName?: string,
  lastName?: string,
  specialty?: string,
  institution?: string,
  degreeType?: string,
  clinicianType?: string,
  role?: string 
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setAuth: (t: string) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  setAuth: () => {}
})

export const AuthProvider = ({ children }: { children: any }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(token ? (jwtDecode as any)(token) : null)

  const setAuth = (t: string) => { 
    localStorage.setItem('token', t)
    setToken(t)
    setUser((jwtDecode as any)(t))
  }

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    const data = await response.json()
    setAuth(data.token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  useEffect(() => {}, [token])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
