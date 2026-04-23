"use client"

import Link from "next/link"
import { AvatarGroup } from "@/components/dashboard/avatar-group"
import { formatCurrency } from "@/lib/utils"
import { useExpense } from "@/lib/context/expense-context"

interface GroupsListProps {
  limit?: number
}

export function GroupsList({ limit }: GroupsListProps) {
  const { groups, isLoading } = useExpense()

  const displayGroups = limit ? groups.slice(0, limit) : groups

  if (isLoading) {
    return <div className="text-center py-4 text-muted-foreground">Loading groups...</div>
  }

  return (
    <div className="space-y-2">
      {displayGroups.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">You have no groups yet</div>
      ) : (
        displayGroups.map((group) => (
          <Link
            key={group.id}
            href={`/dashboard/groups/${group.id}`}
            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <AvatarGroup max={2} size="sm" />
              <div>
                <p className="text-sm font-medium">{group.name}</p>
                <p className="text-xs text-muted-foreground">{group.memberCount} members</p>
              </div>
            </div>
            <div className="text-sm text-green-500">{formatCurrency(group.totalExpenses || 0)}</div>
          </Link>
        ))
      )}

      {limit && groups.length > limit && (
        <Link href="/dashboard/groups" className="block text-center text-sm text-primary hover:underline py-1">
          View all groups
        </Link>
      )}
    </div>
  )
}
