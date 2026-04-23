import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/features" ||
    path === "/about" ||
    path === "/contact"

  // Check if user is authenticated
  const isAuthenticated =
    request.cookies.has("auth_token") ||
    request.headers.get("authorization")?.startsWith("Bearer ") ||
    // In development mode, check localStorage
    (process.env.NODE_ENV === "development" && request.headers.get("x-auth-token") === "mock-token-for-development")

  // Redirect logic
  if (!isAuthenticated && path.startsWith("/dashboard")) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(redirectUrl)
  }

  // Don't redirect from public paths even if authenticated
  // This allows users to visit the landing page even when logged in

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
