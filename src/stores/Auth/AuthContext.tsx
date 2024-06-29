import React, { createContext, useState, useEffect, ReactNode, FC } from 'react'
import { CHANNELS, LOCAL_STORAGE } from '../../shared/constants'
const { ipcRenderer } = window.require('electron')

interface AuthContextType {
  authState: boolean
  setAuthState: (authState: boolean) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<boolean>(
    !!localStorage.getItem(LOCAL_STORAGE.jwtToken),
  )

  useEffect(() => {
    ipcRenderer.on(CHANNELS.REVOKE_AUTH, () => {
      if (!authState) {
        return
      }

      new window.Notification('Auth', {
        body: 'Please sign in due to inactivity: ' + authState,
      })
      localStorage.removeItem(LOCAL_STORAGE.jwtToken)
      setAuthState(false)
    })
  }, [])

  return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>
}
