import { LoadingIndicator } from "./loading-indicator"

interface FallbackProps {
  message?: string
}

export function Fallback({ message = "Loading..." }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <LoadingIndicator size="lg" text={message} />
    </div>
  )
}
