"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Users, Receipt, CreditCard, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/groups", label: "Groups", icon: Users },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { href: "/dashboard/settlements", label: "Settlements", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="md:hidden flex items-center h-14 border-b px-4">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="ml-2 font-semibold flex items-center">
          <Image src="/images/logo.png" alt="SplitWise Logo" width={24} height={24} className="mr-2" />
          SplitWise
        </div>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-full flex-col border-r bg-background md:w-auto md:translate-x-0 md:static",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center h-14 border-b px-4">
          <Link href="/dashboard" className="flex items-center">
            <Image src="/images/logo.png" alt="Expense Split Calculator Logo" width={24} height={24} className="mr-2" />
            <div className="font-semibold">SplitEase India</div>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="ml-auto md:hidden">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 p-4">
          <nav className="grid gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted",
                  pathname === link.href || pathname?.startsWith(`${link.href}/`)
                    ? "bg-muted"
                    : "text-muted-foreground",
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t">
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/80 md:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  )
}
