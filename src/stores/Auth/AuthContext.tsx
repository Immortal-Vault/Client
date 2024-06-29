import React, { createContext, useState, useEffect, ReactNode, FC } from 'react'

interface AuthContextType {
  authState: boolean
  setAuthState: (authState: boolean) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<boolean>(!!localStorage.getItem('token'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthState(true)
    }
  }, [])

  return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>
}
