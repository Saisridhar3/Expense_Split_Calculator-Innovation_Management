"use client"

import type React from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Receipt,
  ShoppingCart,
  Utensils,
  Home,
  Car,
  Plane,
} from "lucide-react"
import { useExpense } from "@/lib/context/expense-context"
import { formatCurrency } from "@/lib/utils"

// Icon mapping by category
const categoryIcons: Record<string, React.ElementType> = {
  food: Utensils,
  groceries: ShoppingCart,
  accommodation: Home,
  transport: Car,
  travel: Plane,
  default: Receipt,
}

interface RecentActivityListProps {
  type?: "all" | "expense" | "payment"
}

export function RecentActivityList({ type = "all" }: RecentActivityListProps) {
  const { activities, isLoading } = useExpense()

  // Filter activities by type if needed
  const filteredActivities = type === "all" ? activities : activities.filter((activity) => activity.type === type)

  if (isLoading) {
    return <div className="text-center py-4 text-muted-foreground">Loading activities...</div>
  }

  return (
    <div className="space-y-4">
      {filteredActivities.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">No transactions to display</div>
      ) : (
        filteredActivities.map((activity) => {
          const IconComponent =
            activity.type === "expense" ? categoryIcons[activity.category] || categoryIcons.default : CreditCard

          const isPositive =
            activity.type === "payment"
              ? activity.toUser?.id === "1" // Payment to current user
              : activity.type === "expense" && activity.paidBy?.id === "1"

          const amountColor = isPositive ? "text-green-500" : "text-red-500"
          const AmountIcon = isPositive ? ArrowDownRight : ArrowUpRight

          return (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-muted">
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{activity.description}</p>
                  <div className={`flex items-center font-medium ${amountColor}`}>
                    <AmountIcon className="mr-1 h-4 w-4" />
                    {formatCurrency(activity.amount)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    {activity.type === "expense" ? (
                      <>{activity.paidBy?.id === "1" ? "You paid" : `${activity.paidBy?.name} paid`}</>
                    ) : (
                      <>
                        {activity.fromUser?.id === "1"
                          ? `You paid ${activity.toUser?.name}`
                          : `${activity.fromUser?.name} paid you`}
                      </>
                    )}
                  </div>
                  <div>{new Date(activity.date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
