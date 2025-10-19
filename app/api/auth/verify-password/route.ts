import { NextRequest, NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/supabase'
import { createAuthToken, generateDeviceId } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { tempPasswords, debugTempPasswords } from '@/lib/tempPasswords'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Admin kontrolü
    const isAdmin = await isAdminEmail(normalizedEmail)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      )
    }

    // Debug: Mevcut store durumu
    console.log('🔍 Verify attempt for:', normalizedEmail)
    debugTempPasswords()

    // Geçici şifreyi kontrol et
    const tempPassword = tempPasswords.get(normalizedEmail)
    
    if (!tempPassword) {
      console.log(`❌ No password found for ${normalizedEmail}`)
      return NextResponse.json(
        { error: 'Geçersiz veya süresi dolmuş şifre. Lütfen yeni şifre isteyin.' },
        { status: 401 }
      )
    }

    // Şifre süresini kontrol et
    const now = Date.now()
    const timeLeft = tempPassword.expiresAt - now
    
    console.log('⏰ Password time check:', {
      expiresAt: new Date(tempPassword.expiresAt).toLocaleTimeString(),
      timeLeftSeconds: Math.round(timeLeft / 1000),
      isExpired: now > tempPassword.expiresAt
    })
    
    if (now > tempPassword.expiresAt) {
      tempPasswords.delete(normalizedEmail)
      console.log(`❌ Password expired for ${normalizedEmail}`)
      return NextResponse.json(
        { error: 'Şifrenizin süresi dolmuş. Lütfen yeni şifre isteyin.' },
        { status: 401 }
      )
    }

    // Şifreyi doğrula
    console.log('🔐 Verifying password...')
    const isValid = await bcrypt.compare(password, tempPassword.hash)
    
    if (!isValid) {
      console.log(`❌ Invalid password for ${normalizedEmail}`)
      return NextResponse.json(
        { error: 'Hatalı şifre' },
        { status: 401 }
      )
    }

    console.log(`✅ Password verified for ${normalizedEmail}`)

    // Şifreyi kullan ve sil (tek kullanımlık)
    tempPasswords.delete(normalizedEmail)
    console.log(`🗑️ Password removed after successful login for ${normalizedEmail}`)

    // Device ID al veya oluştur
    let deviceId = request.cookies.get('device_id')?.value
    if (!deviceId) {
      deviceId = generateDeviceId()
    }

    // Auth token oluştur
    const token = await createAuthToken(normalizedEmail, deviceId)

    // Response oluştur ve cookie'leri set et
    const response = NextResponse.json({ 
      success: true,
      message: 'Giriş başarılı'
    })
    
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 4 * 60 * 60, // 4 saat
      path: '/',
    })

    response.cookies.set('device_id', deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 yıl
      path: '/',
    })

    console.log(`🎉 Login successful for ${normalizedEmail}`)
    debugTempPasswords()

    return response
  } catch (error) {
    console.error('Verify password error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
