"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface GroupMembersInputProps {
  members: string[]
  setMembers: (members: string[]) => void
}

export function GroupMembersInput({ members, setMembers }: GroupMembersInputProps) {
  const [currentInput, setCurrentInput] = useState("")
  const [error, setError] = useState("")

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleAdd = () => {
    const email = currentInput.trim()

    if (!email) return

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (members.includes(email)) {
      setError("This email has already been added")
      return
    }

    setMembers([...members, email])
    setCurrentInput("")
    setError("")
  }

  const handleRemove = (email: string) => {
    setMembers(members.filter((m) => m !== email))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <Input
          value={currentInput}
          onChange={(e) => {
            setCurrentInput(e.target.value)
            setError("")
          }}
          onKeyDown={handleKeyDown}
          placeholder="friend@example.com"
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {members.map((email) => (
          <Badge key={email} variant="secondary" className="gap-1 px-2 py-1">
            {email}
            <button
              type="button"
              onClick={() => handleRemove(email)}
              className="ml-1 rounded-full hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {email}</span>
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
