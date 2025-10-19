// Global temp password store
// Next.js hot reload'da kaybolmaması için global'e koyuyoruz

interface TempPassword {
  hash: string
  expiresAt: number
  createdAt: number
}

declare global {
  // eslint-disable-next-line no-var
  var tempPasswordStore: Map<string, TempPassword> | undefined
}

// Global store'u kullan veya oluştur
export const tempPasswords = global.tempPasswordStore ?? new Map<string, TempPassword>()

// Development'da global'e kaydet (hot reload'da kaybolmasın)
if (process.env.NODE_ENV !== 'production') {
  global.tempPasswordStore = tempPasswords
}

// Eski şifreleri temizle (sadece bir kere çalışsın)
let cleanupInterval: NodeJS.Timeout | null = null
if (!cleanupInterval) {
  cleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [email, data] of tempPasswords.entries()) {
      if (now > data.expiresAt) {
        console.log(`🗑️ Expired password removed for: ${email}`)
        tempPasswords.delete(email)
      }
    }
  }, 60000) // Her dakika kontrol et
}

// Debug için
export function debugTempPasswords() {
  console.log('📋 Current temp passwords:', {
    count: tempPasswords.size,
    emails: Array.from(tempPasswords.keys()),
    details: Array.from(tempPasswords.entries()).map(([email, data]) => ({
      email,
      expiresIn: Math.round((data.expiresAt - Date.now()) / 1000) + 's',
      createdAt: new Date(data.createdAt).toLocaleTimeString()
    }))
  })
  return tempPasswords
}
