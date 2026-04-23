"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentActivityList } from "@/components/dashboard/recent-activity-list"
import { GroupsList } from "@/components/dashboard/groups-list"
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome"
import { BalanceSummary } from "@/components/dashboard/balance-summary"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { useExpense } from "@/lib/context/expense-context"

export default function DashboardPage() {
  const { refreshGroups, refreshExpenses, isLoading, error, groups } = useExpense()

  // Refresh data when component mounts
  useEffect(() => {
    refreshGroups()
  }, [refreshGroups])

  if (isLoading && groups.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <LoadingIndicator size="lg" text="Loading your dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-md">
        <h2 className="text-lg font-semibold mb-2">Error loading data</h2>
        <p>{error}</p>
        <Button
          onClick={() => {
            refreshGroups()
            refreshExpenses()
          }}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardWelcome />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceSummary />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Groups</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <GroupsList limit={3} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
        <TabsContent value="all" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>View all your recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Your most recent expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList type="expense" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Your most recent payments</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList type="payment" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
