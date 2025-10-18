import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Get user from auth token in cookies
  const token = request.cookies.get("sb-auth-token")?.value

  let user = null
  if (token) {
    try {
      const { data } = await supabase.auth.getUser(token)
      user = data.user
    } catch {
      // Token invalid or expired
    }
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next({
    request,
  })
}
