

import {
  onAuthStateChanged,
  type User,
  type AuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { flushSync } from 'react-dom'
import { auth, db } from 'FirebaseConfig'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'

export type AuthContextType = {
  isAuthenticated: boolean
  isInitialLoading: boolean
  isAdmin: boolean
  login: (provider: AuthProvider) => Promise<void>
  logout: () => Promise<void>
  user: User | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const isAuthenticated = !!user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email ?? 'no user')

      if(firebaseUser){
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        const role = snap.data()?.role ?? ''

        flushSync(() => {
          setUser(firebaseUser)
          setIsAdmin(role === 'admin')
          setIsInitialLoading(false)
        })
      } else {
        flushSync(()=> {
          setUser(null)
          setIsAdmin(false)
          setIsInitialLoading(false)
        })
      }
    })
    return () => unsubscribe()
  }, [])

  const logout = useCallback(async () => {
    console.log('Logging out...')
    await signOut(auth)
    setUser(null)
    setIsInitialLoading(false)
  }, [])

  const login = useCallback(async (provider: AuthProvider) => {
    const result = await signInWithPopup(auth, provider)
    flushSync(() => {
      setUser(result.user)
      setIsInitialLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{ isInitialLoading, isAuthenticated, isAdmin, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}