import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('appSession') // exemplo: checar cookie
  const isLoggedIn = !!token

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/api/auth/login', req.url))
  }

  return NextResponse.next()
}
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
