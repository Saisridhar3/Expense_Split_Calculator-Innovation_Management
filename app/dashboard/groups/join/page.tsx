"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { joinGroup } from "@/lib/api/group-service"
import { useExpense } from "@/lib/context/expense-context"

export default function JoinGroupPage() {
  const router = useRouter()
  const { refreshGroups } = useExpense()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [inviteCode, setInviteCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await joinGroup(inviteCode)
      await refreshGroups()
      router.push("/dashboard/groups")
    } catch (err: any) {
      setError(err.message || "Failed to join group. Please check the invitation code.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Join a Group</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Enter Invitation Code</CardTitle>
            <CardDescription>Enter the invitation code you received to join a group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invitation Code</Label>
              <Input
                id="inviteCode"
                placeholder="Enter code (e.g., ABC123)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">The invitation code is case-sensitive</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !inviteCode.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Joining...
                </>
              ) : (
                "Join Group"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
