"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Utensils, ShoppingCart, Home, Car, Plane, Receipt } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getExpenses } from "@/lib/api/expense-service"

// Icon mapping by category
const categoryIcons: Record<string, React.ElementType> = {
  food: Utensils,
  groceries: ShoppingCart,
  accommodation: Home,
  transport: Car,
  travel: Plane,
  entertainment: Receipt,
  default: Receipt,
}

interface ExpenseListProps {
  groupId?: string
  expenses?: any[]
}

export function ExpenseList({ groupId, expenses: propExpenses }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(!propExpenses)

  useEffect(() => {
    if (propExpenses) {
      setExpenses(propExpenses)
      setLoading(false)
      return
    }

    if (!groupId) {
      setLoading(false)
      return
    }

    async function loadExpenses() {
      try {
        const data = await getExpenses(groupId)
        setExpenses(data)
      } catch (error) {
        console.error("Error loading expenses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadExpenses()
  }, [groupId, propExpenses])

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Loading expenses...</div>
  }

  if (expenses.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No expenses found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Paid By</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Your Share</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => {
            const IconComponent = categoryIcons[expense.category] || categoryIcons.default
            const categoryClass = `category-icon-${expense.category || "default"}`

            return (
              <TableRow key={expense.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`mr-2 rounded-full p-1.5 ${categoryClass}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    {expense.description}
                  </div>
                </TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.paidBy?.name || "Unknown"}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(expense.yourShare)}</TableCell>
                <TableCell>
                  {expense.isSettled ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50"
                    >
                      Settled
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50"
                    >
                      Pending
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
