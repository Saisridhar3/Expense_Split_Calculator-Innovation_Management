"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ApiStatusIndicatorProps {
  apiUrl?: string
  className?: string
}

export function ApiStatusIndicator({ apiUrl, className = "" }: ApiStatusIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [isChecking, setIsChecking] = useState(true)

  const url = apiUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setIsChecking(true)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        await fetch(`${url}/health`, {
          method: "HEAD",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        setIsOnline(true)
      } catch (error) {
        console.log("API is offline or unreachable")
        setIsOnline(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkApiStatus()

    // Check API status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)

    return () => clearInterval(interval)
  }, [url])

  if (isChecking) {
    return null
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center ${className}`}>
            {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-destructive" />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOnline ? "API is online" : "API is offline - using mock data"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
