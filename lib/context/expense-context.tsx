"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { getGroups } from "@/lib/api/group-service"
import { getExpenses } from "@/lib/api/expense-service"
import { useAuth } from "./auth-context"

// Mock activities for development
const MOCK_ACTIVITIES = [
  {
    id: "1",
    type: "expense",
    description: "Dinner at Taj Restaurant",
    amount: 2500,
    date: "2023-11-15",
    paidBy: { id: "1", name: "Demo User" },
    category: "food",
    groupName: "Goa Trip",
  },
  {
    id: "2",
    type: "expense",
    description: "Taxi to Airport",
    amount: 800,
    date: "2023-11-16",
    paidBy: { id: "2", name: "Rahul Sharma" },
    category: "transport",
    groupName: "Goa Trip",
  },
  {
    id: "3",
    type: "payment",
    description: "Settlement",
    amount: 400,
    date: "2023-11-17",
    fromUser: { id: "1", name: "Demo User" },
    toUser: { id: "2", name: "Rahul Sharma" },
    groupName: "Goa Trip",
  },
]

interface ExpenseContextType {
  groups: any[]
  expenses: any[]
  activities: any[]
  isLoading: boolean
  error: string | null
  refreshGroups: () => Promise<void>
  refreshExpenses: (groupId?: string) => Promise<void>
  subscribeToUpdates: (callback: () => void) => () => void
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [groups, setGroups] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updateCallbacks, setUpdateCallbacks] = useState<(() => void)[]>([])

  // Function to subscribe to updates
  const subscribeToUpdates = useCallback((callback: () => void) => {
    setUpdateCallbacks((prev) => [...prev, callback])

    // Return unsubscribe function
    return () => {
      setUpdateCallbacks((prev) => prev.filter((cb) => cb !== callback))
    }
  }, [])

  // Function to notify all subscribers
  const notifySubscribers = useCallback(() => {
    updateCallbacks.forEach((callback) => callback())
  }, [updateCallbacks])

  const refreshGroups = useCallback(async () => {
    if (!isAuthenticated) {
      // If not authenticated, use empty arrays
      setGroups([])
      setExpenses([])
      setActivities([])
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const data = await getGroups()
      setGroups(data || [])
      notifySubscribers()
    } catch (err: any) {
      console.error("Error fetching groups:", err)
      setError(err.message || "Failed to fetch groups")

      // Use mock data in development if API fails
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock group data in development mode due to API error")
        setGroups([
          {
            id: "1",
            name: "Goa Trip",
            description: "Weekend trip to Goa",
            memberCount: 3,
            totalExpenses: 5000,
            createdAt: "2023-11-10T10:00:00Z",
            recentActivity: "2 days ago",
          },
          {
            id: "2",
            name: "Flatmates",
            description: "Monthly expenses for apartment",
            memberCount: 2,
            totalExpenses: 12000,
            createdAt: "2023-10-01T10:00:00Z",
            recentActivity: "yesterday",
          },
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated, notifySubscribers])

  const refreshExpenses = useCallback(
    async (groupId?: string) => {
      if (!isAuthenticated) return

      setIsLoading(true)
      setError(null)
      try {
        if (groupId) {
          const data = await getExpenses(groupId)
          // Update expenses for this group only
          setExpenses((prev) => {
            const filtered = prev.filter((e) => e.groupId !== groupId)
            return [...filtered, ...(data || [])]
          })
        } else if (groups.length > 0) {
          // Fetch all expenses across groups
          const allExpenses: any[] = []
          for (const group of groups) {
            try {
              const groupExpenses = await getExpenses(group.id)
              if (groupExpenses) {
                allExpenses.push(...groupExpenses)
              }
            } catch (error) {
              console.error(`Error fetching expenses for group ${group.id}:`, error)
            }
          }
          setExpenses(allExpenses)
        }

        // Update activities based on all expenses
        // In a real app, you might have a separate API for activities
        // For now, we'll derive them from expenses or use mock data
        if (
          process.env.NODE_ENV === "development" &&
          (!process.env.NEXT_PUBLIC_API_URL || localStorage.getItem("auth_token") === "mock-token-for-development")
        ) {
          setActivities(MOCK_ACTIVITIES)
        } else {
          setActivities((prevActivities) => {
            const allActivities = [...expenses]
            // Sort by date, newest first
            allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            return allActivities
          })
        }

        notifySubscribers()
      } catch (err: any) {
        console.error("Error fetching expenses:", err)
        setError(err.message || "Failed to fetch expenses")

        // Use mock data in development if API fails
        if (process.env.NODE_ENV === "development") {
          console.warn("Using mock expense data in development mode due to API error")
          setExpenses([
            {
              id: "1",
              description: "Dinner at Taj Restaurant",
              amount: 2500,
              date: "2023-11-15",
              groupId: "1",
              paidBy: { id: "1", name: "Demo User", isCurrentUser: true },
              splitType: "equal",
              category: "food",
              yourShare: 833.33,
              isSettled: false,
            },
            {
              id: "2",
              description: "Taxi to Airport",
              amount: 800,
              date: "2023-11-16",
              groupId: "1",
              paidBy: { id: "2", name: "Rahul Sharma" },
              splitType: "equal",
              category: "transport",
              yourShare: 400,
              isSettled: true,
            },
          ])
          setActivities(MOCK_ACTIVITIES)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [isAuthenticated, groups, expenses, notifySubscribers],
  )

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshGroups()
    }
  }, [isAuthenticated, user, refreshGroups])

  // Listen for user-updated events to refresh data
  useEffect(() => {
    const handleUserUpdate = () => {
      if (isAuthenticated) {
        refreshGroups()
      }
    }

    window.addEventListener("user-updated", handleUserUpdate)
    return () => {
      window.removeEventListener("user-updated", handleUserUpdate)
    }
  }, [isAuthenticated, refreshGroups])

  return (
    <ExpenseContext.Provider
      value={{
        groups,
        expenses,
        activities,
        isLoading,
        error,
        refreshGroups,
        refreshExpenses,
        subscribeToUpdates,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpense() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider")
  }
  return context
}
