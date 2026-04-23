"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, UserPlus } from "lucide-react"
import { GroupCard } from "@/components/dashboard/group-card"
import { useExpense } from "@/lib/context/expense-context"

export default function GroupsPage() {
  const { groups, isLoading } = useExpense()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">Manage your expense groups</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/groups/join">
            <Button variant="outline" size="sm" className="gap-1">
              <UserPlus className="h-4 w-4" />
              Join Group
            </Button>
          </Link>
          <Link href="/dashboard/groups/create">
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Create Group
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading groups...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}

          <Link href="/dashboard/groups/create" className="block">
            <Card className="h-full border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <PlusCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-xl font-medium">Create New Group</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Start a new expense group with friends, family, or colleagues
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
}
