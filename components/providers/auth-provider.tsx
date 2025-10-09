"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
  useMemo,
} from "react"
import { getUserProfile } from "@/lib/firebase/users"

interface AuthContextType {
  user: any | null
  userProfile: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate auth state - replace with your actual auth logic
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      getUserProfile(parsedUser.uid).then(setUserProfile)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Implement your sign-in logic here
    const mockUser = { uid: "mock-uid", email }
    setUser(mockUser)
    localStorage.setItem("auth_user", JSON.stringify(mockUser))
    const profile = await getUserProfile(mockUser.uid)
    setUserProfile(profile)
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    // Implement your sign-up logic here
    const mockUser = { uid: "mock-uid", email, displayName }
    setUser(mockUser)
    localStorage.setItem("auth_user", JSON.stringify(mockUser))
  }

  const signOut = async () => {
    setUser(null)
    setUserProfile(null)
    localStorage.removeItem("auth_user")
  }

  const updateUserProfile = async (data: any) => {
    if (user) {
      // Update profile logic
      setUserProfile({ ...userProfile, ...data })
    }
  }

  const value = useMemo(
    () => ({
      user,
      userProfile,
      loading,
      signIn,
      signUp,
      signOut,
      updateUserProfile,
    }),
    [user, userProfile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}