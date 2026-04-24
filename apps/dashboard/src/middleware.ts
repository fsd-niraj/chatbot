import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Note: localStorage is not available in middleware (Edge runtime).
// Auth guarding is done client-side in the dashboard layout.
// This middleware only handles basic path redirects.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect root to /chatbots
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/chatbots', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
