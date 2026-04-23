"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Users, Receipt, Wallet, ArrowLeftRight } from "lucide-react"
import { ExpenseList } from "@/components/dashboard/expense-list"
import { BalanceOverview } from "@/components/dashboard/balance-overview"
import { GroupMembers } from "@/components/dashboard/group-members"
import { getGroupById } from "@/lib/api/group-service"
import { formatCurrency } from "@/lib/utils"

export default function GroupDetailsPage() {
  const params = useParams()
  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadGroupData() {
      try {
        const data = await getGroupById(params.id as string)
        setGroup(data)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to load group details")
        setLoading(false)
      }
    }

    loadGroupData()
  }, [params.id])

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading group details...</div>
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  if (!group) {
    return <div className="text-destructive">Group not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="relative h-48 w-full rounded-xl overflow-hidden mb-8">
        <Image src="/images/group-trip.png" alt={group.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">{group.name}</h1>
          <p className="text-white/80">{group.description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(group.totalExpenses || 0)}</div>
            <p className="text-xs text-muted-foreground">Since {new Date(group.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{group.members?.length || group.memberCount || 0}</div>
            <p className="text-xs text-muted-foreground">People in this group</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
            <Wallet className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+$25.50</div>
            <p className="text-xs text-muted-foreground">You are owed this amount</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settle">Settle Up</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>All expenses in this group</CardDescription>
              </div>
              <Link href={`/dashboard/groups/${params.id}/add-expense`}>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Expense
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ExpenseList groupId={params.id as string} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Balance Overview</CardTitle>
              <CardDescription>See who owes who</CardDescription>
            </CardHeader>
            <CardContent>
              <BalanceOverview groupId={params.id as string} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Members</CardTitle>
              <CardDescription>People in this group</CardDescription>
            </CardHeader>
            <CardContent>
              <GroupMembers members={group.members || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settle" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Settle Up</CardTitle>
              <CardDescription>Record payments to settle balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <Button variant="outline" size="lg" className="gap-2">
                  <ArrowLeftRight className="h-5 w-5" />
                  Record a Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
