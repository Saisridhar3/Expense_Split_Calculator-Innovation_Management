"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useAuth } from "@/lib/context/auth-context"
import { LoadingIndicator } from "@/components/ui/loading-indicator"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only redirect if we're on the client and not loading
    if (isClient && !isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isClient, isLoading, isAuthenticated, router])

  // Show loading indicator while checking authentication
  if (isLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  // Don't render the dashboard if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      <DashboardSidebar />
      <div className="flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
