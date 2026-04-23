import { formatCurrency } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function BalanceSummary() {
  // In a real app, this would come from an API
  const totalOwed = 345.75
  const totalOwe = 125.25
  const netBalance = totalOwed - totalOwe

  const isPositive = netBalance >= 0

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-3xl font-bold">
          {isPositive ? "+" : ""}
          {formatCurrency(netBalance)}
        </p>
        <p className="text-xs text-muted-foreground">
          {isPositive ? "Net balance (you are owed this amount)" : "Net balance (you owe this amount)"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-0.5">
          <div className="text-sm text-muted-foreground">You are owed</div>
          <div className="flex items-center text-green-500 font-semibold">
            <ArrowDownRight className="mr-1 h-4 w-4" />
            {formatCurrency(totalOwed)}
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="text-sm text-muted-foreground">You owe</div>
          <div className="flex items-center text-red-500 font-semibold">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            {formatCurrency(totalOwe)}
          </div>
        </div>
      </div>
    </div>
  )
}
