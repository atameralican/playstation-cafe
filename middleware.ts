import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuthToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Sadece /admin ve /admin/* yollarını koru
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')
    const deviceId = request.cookies.get('device_id')

    // Token yoksa login'e yönlendir
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Token'ı doğrula
    const session = await verifyAuthToken(token.value)

    // Token geçersizse login'e yönlendir
    if (!session) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('admin_session')
      return response
    }

    // Device ID kontrolü (4 saat içinde aynı cihazdan)
    if (deviceId && session.deviceId !== deviceId.value) {
      // Farklı cihaz, yeni login gerekli
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('admin_session')
      return response
    }

    // Her şey tamam, devam et
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
