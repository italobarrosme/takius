import {
  NextRequest,
  NextFetchEvent,
  NextResponse,
  NextMiddleware,
} from 'next/server'
import middlewareAuth from './modules/Authentication/libs/middlewareAuth'

const MIDDLEWARES: NextMiddleware[] = [middlewareAuth]

export const middleware = async (req: NextRequest, event: NextFetchEvent) => {
  const response = NextResponse.next()

  for await (const middlewareFunction of MIDDLEWARES) {
    await middlewareFunction(req, event)
  }
  return response
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
    '/api/generate-image-replicate',
    '/api/generate-image',
  ],
}
