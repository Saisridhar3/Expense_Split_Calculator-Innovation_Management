interface CreateGroupData {
  name: string
  description: string
  members: string[]
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Helper function to check if we're in development mode
const isDev = process.env.NODE_ENV === "development"

// Mock data for development when API is unavailable
const MOCK_GROUPS = [
  {
    id: "1",
    name: "Goa Trip",
    description: "Weekend trip to Goa",
    inviteCode: "GOA123",
    memberCount: 3,
    totalExpenses: 5000,
    createdAt: "2023-11-10T10:00:00Z",
    recentActivity: "2 days ago",
    members: [
      { id: "1", name: "Demo User", email: "demo@example.com", isCurrentUser: true },
      { id: "2", name: "Rahul Sharma", email: "rahul@example.com" },
      { id: "3", name: "Priya Patel", email: "priya@example.com" },
    ],
    createdBy: { id: "1", name: "Demo User", email: "demo@example.com", isCurrentUser: true },
  },
  {
    id: "2",
    name: "Flatmates",
    description: "Monthly expenses for apartment",
    inviteCode: "FLAT456",
    memberCount: 2,
    totalExpenses: 12000,
    createdAt: "2023-10-01T10:00:00Z",
    recentActivity: "yesterday",
    members: [
      { id: "1", name: "Demo User", email: "demo@example.com", isCurrentUser: true },
      { id: "4", name: "Amit Kumar", email: "amit@example.com" },
    ],
    createdBy: { id: "1", name: "Demo User", email: "demo@example.com", isCurrentUser: true },
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

export async function createGroup(data: CreateGroupData): Promise<any> {
  try {
    // In development, if API_URL is not set or token is mock, use mock data
    if (isDev && (getAuthToken() === "mock-token-for-development" || !process.env.NEXT_PUBLIC_API_URL)) {
      console.warn("Using mock data for createGroup in development mode.")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Create a mock group
      const newGroup = {
        id: (MOCK_GROUPS.length + 1).toString(),
        name: data.name,
        description: data.description,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        memberCount: data.members.length + 1, // +1 for current user
        totalExpenses: 0,
        createdAt: new Date().toISOString(),
        recentActivity: "just now",
        members: [
          { id: "1", name: "Demo User", email: "demo@example.com", isCurrentUser: true },
          ...data.members.map((email, index) => ({
            id: (index + 10).toString(),
            name: email.split("@")[0],
            email,
            isCurrentUser: false,
          })),
        ],
        createdBy: { id: "1", name: "Demo User", email: "demo@example.com", isCurrentUser: true },
      }

      // Add to mock groups
      MOCK_GROUPS.push(newGroup)

      return newGroup
    }

    const token = getAuthToken()

    const response = await fetch(`${API_URL}/groups`, {
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
      throw new Error(error.message || "Failed to create group")
    }

    return response.json()
  } catch (error: any) {
    const result = handleApiError(error, "Failed to create group")

    // If we're using mock data in development
    if (result?.useMockData) {
      const newGroup = {
        id: (MOCK_GROUPS.length + 1).toString(),
        name: data.name,
        description: data.description,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        memberCount: data.members.length + 1, // +1 for current user
        totalExpenses: 0,
        createdAt: new Date().toISOString(),
        recentActivity: "just now",
        members: [
          { id: "1", name: "Demo User", email: "demo@example.com", isCurrentUser: true },
          ...data.members.map((email, index) => ({
            id: (index + 10).toString(),
            name: email.split("@")[0],
            email,
            isCurrentUser: false,
          })),
        ],
        createdBy: { id: "1", name: "Demo User", email: "demo@example.com", isCurrentUser: true },
      }

      MOCK_GROUPS.push(newGroup)
      return newGroup
    }

    throw result
  }
}

export async function getGroups(): Promise<any[]> {
  try {
    // In development, if API_URL is not set or token is mock, use mock data
    if (isDev && (getAuthToken() === "mock-token-for-development" || !process.env.NEXT_PUBLIC_API_URL)) {
      console.warn("Using mock data for getGroups in development mode.")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return [...MOCK_GROUPS]
    }

    const token = getAuthToken()

    const response = await fetch(`${API_URL}/groups`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch groups")
    }

    return response.json()
  } catch (error: any) {
    const result = handleApiError(error, "Failed to fetch groups")

    // If we're using mock data in development
    if (result?.useMockData) {
      return [...MOCK_GROUPS]
    }

    throw result
  }
}

export async function getGroupById(groupId: string): Promise<any> {
  try {
    // In development, if API_URL is not set or token is mock, use mock data
    if (isDev && (getAuthToken() === "mock-token-for-development" || !process.env.NEXT_PUBLIC_API_URL)) {
      console.warn("Using mock data for getGroupById in development mode.")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const group = MOCK_GROUPS.find((g) => g.id === groupId)
      if (!group) {
        throw new Error("Group not found")
      }

      return { ...group }
    }

    const token = getAuthToken()

    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch group")
    }

    return response.json()
  } catch (error: any) {
    const result = handleApiError(error, "Failed to fetch group")

    // If we're using mock data in development
    if (result?.useMockData) {
      const group = MOCK_GROUPS.find((g) => g.id === groupId)
      if (!group) {
        throw new Error("Group not found")
      }

      return { ...group }
    }

    throw result
  }
}

export async function joinGroup(inviteCode: string): Promise<any> {
  try {
    // In development, if API_URL is not set or token is mock, use mock data
    if (isDev && (getAuthToken() === "mock-token-for-development" || !process.env.NEXT_PUBLIC_API_URL)) {
      console.warn("Using mock data for joinGroup in development mode.")

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find group by invite code
      const group = MOCK_GROUPS.find((g) => g.inviteCode === inviteCode)
      if (!group) {
        throw new Error("Invalid invitation code")
      }

      // Check if user is already a member
      const isMember = group.members.some((m) => m.id === "1")
      if (isMember) {
        throw new Error("You are already a member of this group")
      }

      // Add user to group
      group.members.push({
        id: "1",
        name: "Demo User",
        email: "demo@example.com",
        isCurrentUser: true,
      })
      group.memberCount += 1

      return { ...group }
    }

    const token = getAuthToken()

    const response = await fetch(`${API_URL}/groups/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ inviteCode }),
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to join group")
    }

    return response.json()
  } catch (error: any) {
    const result = handleApiError(error, "Failed to join group")

    // If we're using mock data in development
    if (result?.useMockData) {
      // Find group by invite code
      const group = MOCK_GROUPS.find((g) => g.inviteCode === inviteCode)
      if (!group) {
        throw new Error("Invalid invitation code")
      }

      // Check if user is already a member
      const isMember = group.members.some((m) => m.id === "1")
      if (isMember) {
        throw new Error("You are already a member of this group")
      }

      // Add user to group
      group.members.push({
        id: "1",
        name: "Demo User",
        email: "demo@example.com",
        isCurrentUser: true,
      })
      group.memberCount += 1

      return { ...group }
    }

    throw result
  }
}
