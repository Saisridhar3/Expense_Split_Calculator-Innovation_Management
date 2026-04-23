"use client"

import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { AuthProvider } from "@/lib/context/auth-context"
import { ExpenseProvider } from "@/lib/context/expense-context"
import { GlobalErrorBoundary } from "@/components/global-error-boundary"
import { Suspense } from "react"
import { LoadingIndicator } from "@/components/ui/loading-indicator"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <Suspense fallback={<LoadingFallback />}>
          <AuthProvider>
            <ExpenseProvider>{children}</ExpenseProvider>
          </AuthProvider>
        </Suspense>
      </ThemeProvider>
    </GlobalErrorBoundary>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingIndicator size="lg" text="Loading application..." />
    </div>
  )
}
