import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { DebugInfo } from "@/components/debug-info"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SplitWise - Expense Sharing",
  description: "Split expenses with friends, roommates, and travelers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <DebugInfo />
        </Providers>
      </body>
    </html>
  )
}


import './globals.css'