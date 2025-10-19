import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'your-secret-key-min-32-chars-long'
)

export interface AuthSession {
  email: string
  deviceId: string
  expiresAt: number
}

// Token oluştur (4 saat geçerli)
export async function createAuthToken(email: string, deviceId: string): Promise<string> {
  const expiresAt = Date.now() + 4 * 60 * 60 * 1000 // 4 saat

  const token = await new SignJWT({ email, deviceId, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('4h')
    .sign(secret)

  return token
}

// Token doğrula
export async function verifyAuthToken(token: string): Promise<AuthSession | null> {
  try {
    const verified = await jwtVerify(token, secret)
    const payload = verified.payload as unknown as AuthSession

    if (payload.expiresAt && Date.now() < payload.expiresAt) {
      return payload
    }
    return null
  } catch {
    return null
  }
}

// Cookie'den session al
export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')

  if (!token) return null

  return verifyAuthToken(token.value)
}

// Device ID oluştur
export function generateDeviceId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
