import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0'

export async function middleware(req: NextRequest) {
  const res = new NextResponse()
  const session = await getSession(req, res)
  console.log('req', req)

  console.log('session!!!!!!!!', session)

  if (!session) {
    return NextResponse.redirect(new URL('/api/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
