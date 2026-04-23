interface ExpenseData {
  description: string
  amount: number
  paidBy: string
  date: string
  groupId: string
  splitType: string
  splits?: Record<string, string>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Helper function to check if we're in development mode
const isDev = process.env.NODE_ENV === "development"

// Mock data for development when API is unavailable
const MOCK_EXPENSES = [
  {
    id: "1",
    description: "Dinner at Taj Restaurant",
    amount: 2500,
    date: "2023-11-15",
    groupId: "1",
    paidBy: {
      id: "1",
      name: "Demo User",
      isCurrentUser: true,
    },
    splitType: "equal",
    category: "food",
    participants: [
      { id: "1", name: "Demo User", isCurrentUser: true },
      { id: "2", name: "Rahul Sharma" },
      { id: "3", name: "Priya Patel" },
    ],
    yourShare: 833.33,
    isSettled: false,
  },
  {
    id: "2",
    description: "Taxi to Airport",
    amount: 800,
    date: "2023-11-16",
    groupId: "1",
    paidBy: {
      id: "2",
      name: "Rahul Sharma",
    },
    splitType: "equal",
    category: "transport",
    participants: [
      { id: "1", name: "Demo User", isCurrentUser: true },
      { id: "2", name: "Rahul Sharma" },
    ],
    yourShare: 400,
    isSettled: true,
  },
]

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

// Helper function to handle API errors
const handleApiError = (error: any, fallbackMessage: string) => {
  console.error("API Error:", error)

  if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
    if (isDev) {
      console.warn("API connection failed. Using mock data in development mode.")
      return { useMockData: true }
    }
    throw new Error("Unable to connect to the server. Please check your internet connection and try again.")
  }

  if (error.response) {
    throw new Error(error.response.data?.message || fallbackMessage)
  }

  throw new Error(error.message || fallbackMessage)
}

export async function addExpense(data: ExpenseData): Promise<any> {
  try {
    // In development, if API_URL is not set or token is mock, use mock data
    if (isDev && (getAuthToken() === "mock-token-for-development" || !process.env.NEXT_PUBLIC_API_URL)) {
      console.warn("Using mock data for addExpense in development mode.")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Return a mock response
      return {
        id: Math.floor(Math.random() * 1000).toString(),
        ...data,
        createdAt: new Date().toISOString(),
      }
    }

    const token = getAuthToken()

    const response = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to add expense")
    }

    return response.json()
  } catch (error: any) {
    const result = handleApiError(error, "Failed to add expense")

    // If we're using mock data in development
    if (result?.useMockData) {
      return {
        id: Math.floor(Math.random() * 1000).toString(),
        ...data,
        createdAt: new Date().toISOString(),
      }
    }

    throw result
  }
}

export async function getExpenses(groupId: string): Promise<any[]> {
  try {
    // In development, if API_URL is not set or token is mock, use mock data
    if (isDev && (getAuthToken() === "mock-token-for-development" || !process.env.NEXT_PUBLIC_API_URL)) {
      console.warn("Using mock data for getExpenses in development mode.")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter mock expenses by groupId if provided
      return MOCK_EXPENSES.filter((expense) => expense.groupId === groupId)
    }

    const token = getAuthToken()

    const response = await fetch(`${API_URL}/expenses/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch expenses")
    }

    return response.json()
  } catch (error: any) {
    const result = handleApiError(error, "Failed to fetch expenses")

    // If we're using mock data in development
    if (result?.useMockData) {
      return MOCK_EXPENSES.filter((expense) => expense.groupId === groupId)
    }

    throw result
  }
}

export async function recordPayment(data: any): Promise<any> {
  try {
    // In development, if API_URL is not set or token is mock, use mock data
    if (isDev && (getAuthToken() === "mock-token-for-development" || !process.env.NEXT_PUBLIC_API_URL)) {
      console.warn("Using mock data for recordPayment in development mode.")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Return a mock response
      return {
        id: Math.floor(Math.random() * 1000).toString(),
        ...data,
        createdAt: new Date().toISOString(),
      }
    }

    const token = getAuthToken()

    const response = await fetch(`${API_URL}/settlements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to record payment")
    }

    return response.json()
  } catch (error: any) {
    const result = handleApiError(error, "Failed to record payment")

    // If we're using mock data in development
    if (result?.useMockData) {
      return {
        id: Math.floor(Math.random() * 1000).toString(),
        ...data,
        createdAt: new Date().toISOString(),
      }
    }

    throw result
  }
}
