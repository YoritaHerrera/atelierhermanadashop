import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Check if user has auth token in cookies
  const token = request.cookies.get("sb-auth-token")?.value

  // Protect dashboard routes - redirect to login if no token
  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next({
    request,
  })
}
