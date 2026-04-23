import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AvatarGroupProps {
  max?: number
  size?: "sm" | "md" | "lg"
}

export function AvatarGroup({ max = 4, size = "md" }: AvatarGroupProps) {
  // This would typically come from API data
  const users = [
    { id: "1", name: "John Doe", image: "/images/avatar-1.png" },
    { id: "2", name: "Jane Smith", image: "/images/avatar-2.png" },
    { id: "3", name: "Emily Davis", image: "/images/avatar-3.png" },
    { id: "4", name: "Michael Brown", image: "/images/avatar-4.png" },
    { id: "5", name: "Sarah Wilson", image: "/images/avatar-1.png" },
  ]

  const visibleUsers = users.slice(0, max)
  const remainingUsers = users.length > max ? users.length - max : 0

  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-12 w-12 text-base",
  }

  const offsetClasses = {
    sm: "-ml-2",
    md: "-ml-3",
    lg: "-ml-4",
  }

  return (
    <div className="flex">
      {visibleUsers.map((user, index) => (
        <Avatar
          key={user.id}
          className={cn(sizeClasses[size], index > 0 && offsetClasses[size], "border-2 border-background")}
        >
          <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      ))}

      {remainingUsers > 0 && (
        <div
          className={cn(
            sizeClasses[size],
            offsetClasses[size],
            "flex items-center justify-center rounded-full bg-muted border-2 border-background text-muted-foreground",
          )}
        >
          +{remainingUsers}
        </div>
      )}
    </div>
  )
}
