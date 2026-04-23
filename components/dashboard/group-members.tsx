import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

interface GroupMembersProps {
  members: Array<{
    id: string
    name: string
    email: string
    isCurrentUser?: boolean
  }>
}

export function GroupMembers({ members }: GroupMembersProps) {
  // Function to get avatar image based on user id
  const getAvatarImage = (id: string) => {
    const avatarNumber = (Number.parseInt(id) % 4) + 1
    return `/images/avatar-${avatarNumber}.png`
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={getAvatarImage(member.id) || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">
                  {member.name} {member.isCurrentUser && "(You)"}
                </p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full gap-1">
        <UserPlus className="h-4 w-4" />
        Invite More People
      </Button>
    </div>
  )
}
