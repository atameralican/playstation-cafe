import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './auth'
import { isAdminEmail } from './supabase'

/**
 * API route'lar için admin kontrolü middleware'i
 * Sadece giriş yapmış ve admin_users tablosunda olan kullanıcılar erişebilir
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Session kontrolü
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim. Lütfen giriş yapın.' },
        { status: 401 }
      )
    }

    // Admin kontrolü
    const isAdmin = await isAdminEmail(session.email)
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Bu işlem için admin yetkisi gereklidir.' },
        { status: 403 }
      )
    }

    // Her şey OK, devam edebilir
    return null
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json(
      { error: 'Yetkilendirme kontrolü başarısız.' },
      { status: 500 }
    )
  }
}

/**
 * API route'larda kullanım örneği:
 * 
 * export async function GET(request: NextRequest) {
 *   const authError = await requireAdmin(request)
 *   if (authError) return authError
 *   
 *   // Admin kontrolünden geçti, devam et
 *   const data = await getYourData()
 *   return NextResponse.json(data)
 * }
 */
