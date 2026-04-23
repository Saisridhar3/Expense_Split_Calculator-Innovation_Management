import { Loader2 } from "lucide-react"

interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingIndicator({ size = "md", text, className }: LoadingIndicatorProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}
