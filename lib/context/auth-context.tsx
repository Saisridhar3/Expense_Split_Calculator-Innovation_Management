"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  updateUserProfile,
  isAuthenticated as checkIsAuthenticated,
  type UserData,
} from "@/lib/api/auth-service"

interface AuthContextType {
  user: UserData | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<UserData>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<UserData>) => Promise<void>
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Function to refresh user data from storage
  const refreshUser = useCallback(() => {
    try {
      const currentUser = getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(!!currentUser)
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // First check if authenticated
        const isAuth = checkIsAuthenticated()
        setIsAuthenticated(isAuth)

        if (isAuth) {
          refreshUser()
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for storage events to update user data across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "auth_token") {
        refreshUser()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom events for same-tab updates
    const handleUserUpdate = () => {
      refreshUser()
    }

    window.addEventListener("user-updated", handleUserUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("user-updated", handleUserUpdate)
    }
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const userData = await apiLogin({ email, password })
      setUser(userData)
      setIsAuthenticated(true)

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event("user-updated"))

      return userData
    } catch (err: any) {
      setError(err.message || "Failed to login")
      setUser(null)
      setIsAuthenticated(false)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await apiRegister({ name, email, password })
    } catch (err: any) {
      setError(err.message || "Failed to register")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await apiLogout()
      setUser(null)
      setIsAuthenticated(false)

      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event("user-updated"))
    } catch (err: any) {
      setError(err.message || "Failed to logout")
      console.error("Logout error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (userData: Partial<UserData>) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await updateUserProfile(userData)
      setUser(updatedUser)
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("user-updated"))
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const contextValue = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
