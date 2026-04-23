"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ErrorFallbackProps {
  error?: Error
  reset?: () => void
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An error occurred while rendering this page. Please try refreshing or contact support if the problem
            persists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive">
              <p className="font-medium">Error details:</p>
              <p className="font-mono text-xs mt-1">{error.message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => reset?.() || window.location.reload()} className="w-full">
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
