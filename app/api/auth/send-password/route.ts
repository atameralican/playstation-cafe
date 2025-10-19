import { NextRequest, NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/supabase'
import { sendPasswordEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'
import { tempPasswords, debugTempPasswords } from '@/lib/tempPasswords'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email gerekli' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Admin kontrolü
    const isAdmin = await isAdminEmail(normalizedEmail)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Bu email adresi admin listesinde bulunmuyor' },
        { status: 403 }
      )
    }

    // 6 haneli rastgele şifre oluştur
    const password = Math.floor(100000 + Math.random() * 900000).toString()
    const hash = await bcrypt.hash(password, 10)

    // Şifreyi 10 dakika geçerli olacak şekilde sakla
    const passwordData = {
      hash,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 dakika
      createdAt: Date.now()
    }
    
    tempPasswords.set(normalizedEmail, passwordData)

    // Debug log
    console.log(`✅ Password created for ${normalizedEmail}:`, {
      password: password, // DEV ONLY - production'da kaldırın!
      expiresIn: '10 minutes',
      totalPasswords: tempPasswords.size
    })
    
    // Store durumunu göster
    debugTempPasswords()

    // Email gönder
    const emailSent = await sendPasswordEmail(normalizedEmail, password)

    if (!emailSent) {
      // Email gönderilemese bile şifre oluşturuldu, manuel girebilir
      console.warn(`⚠️ Email could not be sent to ${normalizedEmail}, but password is stored`)
      return NextResponse.json(
        { 
          success: true,
          warning: 'Email gönderilemedi ama şifre oluşturuldu',
          password: process.env.NODE_ENV === 'development' ? password : undefined
        },
        { status: 200 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Şifre email adresinize gönderildi'
    })
  } catch (error) {
    console.error('Send password error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
