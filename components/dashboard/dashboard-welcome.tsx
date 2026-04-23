"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"

export function DashboardWelcome() {
  const { user } = useAuth()
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  // Get first name only
  const firstName = user?.name ? user.name.split(" ")[0] : "User"

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {firstName}
        </h1>
        <p className="text-muted-foreground">Welcome to your expense dashboard. Here's a summary of your activities.</p>
      </div>
      <Link href="/dashboard/groups/create">
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          New Group
        </Button>
      </Link>
    </div>
  )
}
