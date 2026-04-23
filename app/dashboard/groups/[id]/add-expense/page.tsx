"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, Calendar } from "lucide-react"
import { addExpense } from "@/lib/api/expense-service"
import { getGroupById } from "@/lib/api/group-service"
import { useExpense } from "@/lib/context/expense-context"

export default function AddExpensePage() {
  const params = useParams()
  const router = useRouter()
  const { refreshGroups, refreshExpenses } = useExpense()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [members, setMembers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    paidBy: "1", // Current user by default
    date: new Date().toISOString().split("T")[0],
    splitType: "equal",
  })
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadGroupData() {
      try {
        const data = await getGroupById(params.id as string)
        setMembers(data.members || [])
      } catch (err) {
        console.error("Failed to load group members:", err)
      }
    }

    loadGroupData()
  }, [params.id])

  useEffect(() => {
    // Initialize custom splits with equal amounts
    if (formData.splitType === "equal" && formData.amount && members.length > 0) {
      const equalShare = (Number.parseFloat(formData.amount) / members.length).toFixed(2)
      const newSplits: Record<string, string> = {}
      members.forEach((member) => {
        newSplits[member.id] = equalShare
      })
      setCustomSplits(newSplits)
    }
  }, [formData.amount, formData.splitType, members])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCustomSplitChange = (memberId: string, value: string) => {
    setCustomSplits((prev) => ({ ...prev, [memberId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const expenseData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
        groupId: params.id as string,
        splits: formData.splitType === "custom" ? customSplits : undefined,
      }

      await addExpense(expenseData)
      await refreshGroups()
      await refreshExpenses(params.id as string)
      router.push(`/dashboard/groups/${params.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to add expense. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add an Expense</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
            <CardDescription>Add a new expense to your group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="Dinner at Restaurant"
                required
                value={formData.description}
                onChange={handleChange}
              />
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
              <Label htmlFor="paidBy">Paid by</Label>
              <Select
                name="paidBy"
                value={formData.paidBy}
                onValueChange={(value) => handleSelectChange("paidBy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} {member.isCurrentUser ? "(You)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <Label>Split Options</Label>
              <RadioGroup
                value={formData.splitType}
                onValueChange={(value) => handleSelectChange("splitType", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="equal" id="equal" />
                  <Label htmlFor="equal" className="cursor-pointer">
                    Split equally
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">
                    Custom split
                  </Label>
                </div>
              </RadioGroup>

              {formData.splitType === "custom" && (
                <div className="space-y-3 mt-4 border p-3 rounded-md">
                  <h3 className="text-sm font-medium">Custom Amounts</h3>
                  {members.map((member) => (
                    <div key={member.id} className="grid grid-cols-[1fr_auto] items-center gap-2">
                      <Label htmlFor={`split-${member.id}`} className="text-sm">
                        {member.name} {member.isCurrentUser ? "(You)" : ""}
                      </Label>
                      <div className="relative w-24">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                        <Input
                          id={`split-${member.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={customSplits[member.id] || ""}
                          onChange={(e) => handleCustomSplitChange(member.id, e.target.value)}
                          className="w-full pl-7"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Expense"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
