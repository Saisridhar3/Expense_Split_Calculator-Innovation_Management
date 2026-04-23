import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AvatarGroup } from "@/components/dashboard/avatar-group"
import { formatCurrency } from "@/lib/utils"
import { Users, Receipt, Calendar } from "lucide-react"
import Image from "next/image"

interface GroupCardProps {
  group: {
    id: string
    name: string
    description: string
    memberCount: number
    totalExpenses: number
    createdAt: string
    recentActivity: string
  }
}

export function GroupCard({ group }: GroupCardProps) {
  // Generate a consistent background image based on group name
  const getGroupImage = (name: string) => {
    // Simple hash function to get a consistent number from a string
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 3
    return `/images/group-trip.png`
  }

  return (
    <Link href={`/dashboard/groups/${group.id}`} className="block">
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-32 w-full">
          <Image src={getGroupImage(group.name) || "/placeholder.svg"} alt={group.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{group.memberCount} members</span>
              </div>
              <div className="flex items-center">
                <Receipt className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{formatCurrency(group.totalExpenses)}</span>
              </div>
            </div>

            <div className="mt-4">
              <AvatarGroup max={3} size="sm" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 px-6 py-3">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Last active {group.recentActivity}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
