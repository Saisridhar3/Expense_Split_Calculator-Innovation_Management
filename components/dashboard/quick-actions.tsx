import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, UserPlus, ArrowLeftRight, Receipt } from "lucide-react"

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Link href="/dashboard/groups/create">
        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-1">
          <PlusCircle className="h-5 w-5" />
          <span className="text-xs">New Group</span>
        </Button>
      </Link>
      <Link href="/dashboard/groups">
        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-1">
          <UserPlus className="h-5 w-5" />
          <span className="text-xs">Join Group</span>
        </Button>
      </Link>
      <Link href="/dashboard/expenses/create">
        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-1">
          <Receipt className="h-5 w-5" />
          <span className="text-xs">Add Expense</span>
        </Button>
      </Link>
      <Link href="/dashboard/settlements/create">
        <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-1">
          <ArrowLeftRight className="h-5 w-5" />
          <span className="text-xs">Settle Up</span>
        </Button>
      </Link>
    </div>
  )
}
