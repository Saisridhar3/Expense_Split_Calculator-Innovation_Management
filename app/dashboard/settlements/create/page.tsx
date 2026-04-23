"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar } from "lucide-react"
import { recordPayment } from "@/lib/api/expense-service"
import { useExpense } from "@/lib/context/expense-context"

export default function CreateSettlementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { groups, refreshGroups, refreshExpenses } = useExpense()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Get initial values from URL if provided
  const initialToUser = searchParams.get("to") || ""
  const initialAmount = searchParams.get("amount") || ""

  const [formData, setFormData] = useState({
    groupId: "",
    toUserId: initialToUser,
    amount: initialAmount,
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  // Dummy data for users - in a real app, this would come from the API
  const users = [
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Emily Davis" },
    { id: "4", name: "Michael Brown" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const paymentData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        fromUserId: "1", // Current user
        type: "payment",
      }

      await recordPayment(paymentData)
      await refreshGroups()
      if (formData.groupId) {
        await refreshExpenses(formData.groupId)
      }
      router.push("/dashboard/settlements")
    } catch (err: any) {
      setError(err.message || "Failed to record payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Record a Payment</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Record a payment you made to settle a debt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="groupId">Group (Optional)</Label>
              <Select value={formData.groupId} onValueChange={(value) => handleSelectChange("groupId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific group</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toUserId">Paid To</Label>
              <Select
                value={formData.toUserId}
                onValueChange={(value) => handleSelectChange("toUserId", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select who you paid" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Add any notes about this payment"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Recording...
                </>
              ) : (
                "Record Payment"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
