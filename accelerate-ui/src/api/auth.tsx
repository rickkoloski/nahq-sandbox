import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface AuthUser {
  userId: number
  email: string
  firstName: string
  lastName: string
  organizationName: string | null
  organizationId: number | null
  roles: string[]
  primaryRole: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('nahq_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
    setLoading(false)
  }, [])

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) return false
      const data: AuthUser = await res.json()
      setUser(data)
      localStorage.setItem('nahq_user', JSON.stringify(data))
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nahq_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
