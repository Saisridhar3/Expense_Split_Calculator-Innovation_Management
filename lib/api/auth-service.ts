interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
}

export interface UserData {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  currency?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Helper function to check if we're in development mode
const isDev = process.env.NODE_ENV === "development"

// Mock user data for development when API is unavailable
const MOCK_USER: UserData = {
  id: "1",
  name: "Demo User",
  email: "demo@example.com",
  avatar: "/images/avatar-1.png",
  currency: "INR",
}

// Helper function to check if the API is available
export async function isApiAvailable(): Promise<boolean> {
  // In development mode, always return false to use mock data
  if (isDev) {
    return false
  }
  
  try {
    // Try to make a simple request to the API
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

    await fetch(`${API_URL}/health`, {
      method: "HEAD",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return true
  } catch (error) {
    return false
  }
}

// Helper function to handle API errors
const handleApiError = (error: any, fallbackMessage: string): Error | { useMockData: boolean } => {
  console.error("API Error:", error)

  // Check if it's a network error (Failed to fetch)
  if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
    if (isDev) {
      console.warn("API connection failed. Using mock data in development mode.")
      return { useMockData: true }
    }
    return new Error("Unable to connect to the server. Please check your internet connection and try again.")
  }

  // Handle response errors
  if (error.response) {
    return new Error(error.response.data?.message || fallbackMessage)
  }

  // Handle other errors
  return new Error(error.message || fallbackMessage)
}

export async function login(data: LoginData): Promise<UserData> {
  try {
    // In development mode, always use mock data
    if (isDev) {
      console.warn("Using mock data in development mode.")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Store mock token and user
      localStorage.setItem("auth_token", "mock-token-for-development")
      localStorage.setItem("user", JSON.stringify(MOCK_USER))

      return MOCK_USER
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw { response: { data: errorData }, status: response.status }
    }

    const userData = await response.json()

    // Store user data in localStorage for client-side access
    localStorage.setItem("auth_token", userData.token)
    localStorage.setItem("user", JSON.stringify(userData.user))

    return userData.user
  } catch (error: any) {
    const result = handleApiError(error, "Failed to login")

    // If we're in development mode, use mock data
    if (isDev) {
      localStorage.setItem("auth_token", "mock-token-for-development")
      localStorage.setItem("user", JSON.stringify(MOCK_USER))
      return MOCK_USER
    }

    throw result
  }
}

export async function register(data: RegisterData): Promise<void> {
  try {
    // In development mode, always use mock data
    if (isDev) {
      console.warn("Using mock data in development mode.")
      await new Promise((resolve) => setTimeout(resolve, 500))
      return
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw { response: { data: errorData }, status: response.status }
    }
  } catch (error: any) {
    const result = handleApiError(error, "Failed to register")

    // If we're in development mode, just return without throwing
    if (isDev) {
      return
    }

    throw result
  }
}

export async function logout(): Promise<void> {
  try {
    // In development with mock data, just clear localStorage
    if (isDev && localStorage.getItem("auth_token") === "mock-token-for-development") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      return
    }

    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })

    // Clear localStorage
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  } catch (error) {
    console.error("Logout error:", error)
    // Still clear localStorage even if API call fails
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("auth_token")
}

export function getCurrentUser(): UserData | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export async function updateUserProfile(userData: Partial<UserData>): Promise<UserData> {
  try {
    // In development with mock data, update mock user
    if (isDev && localStorage.getItem("auth_token") === "mock-token-for-development") {
      const currentUser = getCurrentUser() || MOCK_USER
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return updatedUser
    }

    const token = localStorage.getItem("auth_token")

    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
      credentials: "include",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw { response: { data: errorData }, status: response.status }
    }

    const updatedUser = await response.json()

    // Update user in localStorage
    const currentUserStr = localStorage.getItem("user")
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr)
      const mergedUser = { ...currentUser, ...updatedUser }
      localStorage.setItem("user", JSON.stringify(mergedUser))
    }

    return updatedUser
  } catch (error: any) {
    const result = handleApiError(error, "Failed to update profile")

    // If we're in development mode, use mock data
    if (isDev) {
      const currentUser = getCurrentUser() || MOCK_USER
      const updatedUser = { ...currentUser, ...userData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return updatedUser
    }

    throw result
  }
}
