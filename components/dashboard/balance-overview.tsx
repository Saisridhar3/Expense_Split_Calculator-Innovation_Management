import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Dummy data for demonstration
const balances = [
  {
    id: "1",
    name: "John Doe (You)",
    owes: [],
    owed: [
      { userId: "3", name: "Emily Davis", amount: 25.5 },
      { userId: "4", name: "Michael Brown", amount: 60.25 },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    owes: [{ userId: "4", name: "Michael Brown", amount: 18.75 }],
    owed: [{ userId: "3", name: "Emily Davis", amount: 35.0 }],
  },
  {
    id: "3",
    name: "Emily Davis",
    owes: [
      { userId: "1", name: "John Doe (You)", amount: 25.5 },
      { userId: "2", name: "Jane Smith", amount: 35.0 },
    ],
    owed: [],
  },
  {
    id: "4",
    name: "Michael Brown",
    owes: [{ userId: "1", name: "John Doe (You)", amount: 60.25 }],
    owed: [{ userId: "2", name: "Jane Smith", amount: 18.75 }],
  },
]

// Calculate simplified payments
const simplifiedPayments = [
  { from: "Emily Davis", to: "John Doe (You)", amount: 25.5 },
  { from: "Michael Brown", to: "John Doe (You)", amount: 60.25 },
  { from: "Jane Smith", to: "Michael Brown", amount: 18.75 },
]

interface BalanceOverviewProps {
  groupId: string
}

export function BalanceOverview({ groupId }: BalanceOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="text-right">Owes</TableHead>
              <TableHead className="text-right">Owed</TableHead>
              <TableHead className="text-right">Net Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances.map((member) => {
              const totalOwes = member.owes.reduce((sum, item) => sum + item.amount, 0)
              const totalOwed = member.owed.reduce((sum, item) => sum + item.amount, 0)
              const netBalance = totalOwed - totalOwes
              const isPositive = netBalance >= 0

              return (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-right text-red-500">
                    {totalOwes > 0 ? `-${formatCurrency(totalOwes)}` : formatCurrency(0)}
                  </TableCell>
                  <TableCell className="text-right text-green-500">
                    {totalOwed > 0 ? `+${formatCurrency(totalOwed)}` : formatCurrency(0)}
                  </TableCell>
                  <TableCell className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
                    <div className="flex items-center justify-end">
                      {isPositive ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      {isPositive ? `+${formatCurrency(netBalance)}` : `-${formatCurrency(Math.abs(netBalance))}`}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Simplified Payments</h3>
        <div className="space-y-2">
          {simplifiedPayments.map((payment, index) => (
            <div key={index} className="p-3 rounded-md border bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{payment.from}</span>
                  <span className="text-muted-foreground">pays</span>
                  <span className="font-medium">{payment.to}</span>
                </div>
                <div className="font-bold">{formatCurrency(payment.amount)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
