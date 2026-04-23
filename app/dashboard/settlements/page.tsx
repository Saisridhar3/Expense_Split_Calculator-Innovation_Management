"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftRight, Filter } from "lucide-react"
import { useExpense } from "@/lib/context/expense-context"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

export default function SettlementsPage() {
  const { groups } = useExpense()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settlements</h1>
          <p className="text-muted-foreground">Manage payments and settle up with friends</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Link href="/dashboard/settlements/create">
            <Button size="sm" className="gap-1">
              <ArrowLeftRight className="h-4 w-4" />
              Record Payment
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Balances Overview</CardTitle>
          <CardDescription>See who you owe and who owes you</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="you-owe">
            <TabsList className="mb-4">
              <TabsTrigger value="you-owe">You Owe</TabsTrigger>
              <TabsTrigger value="you-are-owed">You Are Owed</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>

            <TabsContent value="you-owe">
              <YouOweList />
            </TabsContent>

            <TabsContent value="you-are-owed">
              <YouAreOwedList />
            </TabsContent>

            <TabsContent value="history">
              <PaymentHistoryList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function YouOweList() {
  // This would come from the API in a real app
  const debts = [
    { id: "1", name: "Jane Smith", amount: 45.75, groupName: "Roommates" },
    { id: "2", name: "Michael Brown", amount: 18.5, groupName: "Trip to Paris" },
  ]

  if (debts.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">You don't owe anyone</div>
  }

  return (
    <div className="space-y-4">
      {debts.map((debt) => (
        <div key={debt.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{debt.name}</p>
            <p className="text-sm text-muted-foreground">{debt.groupName}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-semibold text-red-500">{formatCurrency(debt.amount)}</p>
            <Link href={`/dashboard/settlements/create?to=${debt.id}&amount=${debt.amount}`}>
              <Button size="sm">Pay</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

function YouAreOwedList() {
  // This would come from the API in a real app
  const credits = [
    { id: "3", name: "Emily Davis", amount: 25.5, groupName: "Trip to Paris" },
    { id: "4", name: "Michael Brown", amount: 60.25, groupName: "Trip to Paris" },
  ]

  if (credits.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No one owes you money</div>
  }

  return (
    <div className="space-y-4">
      {credits.map((credit) => (
        <div key={credit.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">{credit.name}</p>
            <p className="text-sm text-muted-foreground">{credit.groupName}</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-semibold text-green-500">{formatCurrency(credit.amount)}</p>
            <Button size="sm" variant="outline">
              Remind
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function PaymentHistoryList() {
  // This would come from the API in a real app
  const payments = [
    {
      id: "1",
      from: "Emily Davis",
      to: "You",
      amount: 35.0,
      date: "2023-09-15T14:30:00",
      groupName: "Trip to Paris",
    },
    {
      id: "2",
      from: "You",
      to: "Jane Smith",
      amount: 22.5,
      date: "2023-09-10T09:15:00",
      groupName: "Roommates",
    },
  ]

  if (payments.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No payment history</div>
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium">
              {payment.from} → {payment.to}
            </p>
            <p className="text-sm text-muted-foreground">{payment.groupName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(payment.date).toLocaleDateString()} at {new Date(payment.date).toLocaleTimeString()}
            </p>
          </div>
          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
        </div>
      ))}
    </div>
  )
}
