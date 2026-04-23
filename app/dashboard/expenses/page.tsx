"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Filter } from "lucide-react"
import { ExpenseList } from "@/components/dashboard/expense-list"
import { useExpense } from "@/lib/context/expense-context"
import Link from "next/link"

export default function ExpensesPage() {
  const { groups, isLoading } = useExpense()
  const [selectedGroup, setSelectedGroup] = useState<string>("all")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Manage and track all your expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Link href="/dashboard/expenses/create">
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>View and manage your expenses across all groups</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-4" onValueChange={setSelectedGroup}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Groups</TabsTrigger>
              {groups.map((group) => (
                <TabsTrigger key={group.id} value={group.id}>
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <AllExpensesList />
            </TabsContent>

            {groups.map((group) => (
              <TabsContent key={group.id} value={group.id}>
                <ExpenseList groupId={group.id} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function AllExpensesList() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { groups } = useExpense()

  useEffect(() => {
    async function loadAllExpenses() {
      try {
        // In a real app, this would be a single API call
        // For our demo, we'll simulate by getting expenses from localStorage
        const expensesStr = localStorage.getItem("expenses")
        const allExpenses = expensesStr ? JSON.parse(expensesStr) : []

        // Sort by date, newest first
        allExpenses.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setExpenses(allExpenses)
      } catch (error) {
        console.error("Error loading expenses:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAllExpenses()
  }, [groups])

  if (loading) {
    return <div className="text-center py-4 text-muted-foreground">Loading expenses...</div>
  }

  if (expenses.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No expenses found</div>
  }

  return <ExpenseList expenses={expenses} />
}
