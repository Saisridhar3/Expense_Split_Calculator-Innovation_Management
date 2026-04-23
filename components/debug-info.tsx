"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugInfo() {
  const [mounted, setMounted] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setMounted(true)
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!mounted) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-auto opacity-70 hover:opacity-100">
      <CardHeader className="py-2">
        <CardTitle className="text-sm">Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="py-2 text-xs">
        <p>
          Window: {windowSize.width}x{windowSize.height}
        </p>
        <p>Theme: {document.documentElement.classList.contains("dark") ? "Dark" : "Light"}</p>
        <p>Path: {window.location.pathname}</p>
      </CardContent>
    </Card>
  )
}
