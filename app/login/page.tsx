'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showToast } from '@/components/ui/alertDep'
import { useServiceHook } from '@/components/useServiceHook/useServiceHook'
import Image from 'next/image'
import logo from '@/public/logo.png'

export default function LoginPage() {
  const router = useRouter()
  const { serviseGit, loading } = useServiceHook()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [devPassword, setDevPassword] = useState<string | null>(null) // DEV ONLY

  // Email gönder
  const handleSendPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      showToast('Lütfen email adresinizi giriniz!', 'error')
      return
    }

    await serviseGit<{ success: boolean; password?: string; warning?: string }>({
      url: '/api/auth/send-password',
      method: 'POST',
      body: { email: email.toLowerCase().trim() },
      loadingText: 'Şifre gönderiliyor...',
      onSuccess: (data) => {
        setEmailSent(true)
        setShowPasswordInput(true)
        
        // Development modda şifreyi göster
        if (data.password) {
          setDevPassword(data.password)
          console.log('🔑 DEV PASSWORD:', data.password)
        }
        
        if (data.warning) {
          showToast(data.warning, 'error')
        } else {
          showToast('Şifre email adresinize gönderildi!', 'success')
        }
      },
      onError: (error) => {
        const errorMessage = error.message || 'Bir hata oluştu'
        console.error('Send password error:', errorMessage)
        showToast(errorMessage, 'error')
      },
    })
  }

  // Şifre doğrula
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      showToast('Lütfen şifrenizi giriniz!', 'error')
      return
    }

    if (password.length !== 6) {
      showToast('Şifre 6 haneli olmalıdır!', 'error')
      return
    }

    console.log('🔍 Verify attempt:', { 
      email: email.toLowerCase().trim(), 
      passwordLength: password.length 
    })

    await serviseGit({
      url: '/api/auth/verify-password',
      method: 'POST',
      body: {
        email: email.toLowerCase().trim(),
        password: password.trim(),
      },
      loadingText: 'Giriş yapılıyor...',
      onSuccess: () => {
        showToast('Giriş başarılı! Yönlendiriliyorsunuz...', 'success')
        setTimeout(() => {
          router.push('/admin')
          router.refresh()
        }, 500)
      },
      onError: (error) => {
        const errorMessage = error.message || 'Hatalı şifre'
        console.error('❌ Verify password error:', errorMessage)
        
        showToast(errorMessage, 'error')
        setPassword('')
        
        // Şifre süresi dolduysa yeni şifre istemesini öner
        if (errorMessage.includes('süresi dolmuş') || errorMessage.includes('Geçersiz')) {
          setTimeout(() => {
            showToast('Yeni şifre almak için "Yeni şifre gönder" butonuna tıklayın', 'error')
          }, 2000)
        }
      },
    })
  }

  const handlePasswordNotReceived = () => {
    setShowPasswordInput(true)
    showToast('Manuel olarak şifrenizi girebilirsiniz', 'success')
  }

  const handleBackToEmail = () => {
    setShowPasswordInput(false)
    setEmailSent(false)
    setPassword('')
    setEmail('')
    setDevPassword(null)
  }

  const handleRequestNewPassword = async () => {
    if (!email.trim()) return

    await serviseGit<{ success: boolean; password?: string }>({
      url: '/api/auth/send-password',
      method: 'POST',
      body: { email: email.toLowerCase().trim() },
      loadingText: 'Yeni şifre gönderiliyor...',
      onSuccess: (data) => {
        setPassword('')
        
        // Development modda şifreyi göster
        if (data.password) {
          setDevPassword(data.password)
          console.log('🔑 DEV PASSWORD:', data.password)
        }
        
        showToast('Yeni şifre email adresinize gönderildi!', 'success')
      },
      onError: (error) => {
        showToast(error.message || 'Şifre gönderilemedi', 'error')
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-800">
          {/* Logo ve Başlık */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image 
                src={logo} 
                alt="Deplasman Playstation" 
                width={80} 
                height={80}
                className="rounded-xl"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Admin Girişi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Deplasman PlayStation Yönetim Paneli
            </p>
          </div>

          {!showPasswordInput ? (
            /* Email Giriş Formu */
            <form onSubmit={handleSendPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email Adresi
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full h-12 text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={loading || !email}
              >
                {loading ? 'Gönderiliyor...' : 'Şifre Gönder'}
              </Button>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                💡 Sisteme kayıtlı admin email adreslerine şifre gönderilir
              </div>
            </form>
          ) : (
            /* Şifre Giriş Formu */
            <div className="space-y-6">
              {/* Email Bilgi Banner */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                      Şifre Gönderildi
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      <strong>{email}</strong> adresine 6 haneli şifre gönderildi
                    </p>
                    {devPassword && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        🔑 DEV ŞIFRE: <strong>{devPassword}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerifyPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Şifre
                  </Label>
                  <Input
                    id="password"
                    type="text"
                    placeholder="6 haneli şifre"
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setPassword(value)
                    }}
                    required
                    disabled={loading}
                    maxLength={6}
                    className="w-full h-14 text-center text-3xl tracking-[0.5em] font-bold"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    ⏱️ Şifre 10 dakika geçerlidir
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={loading || password.length !== 6}
                >
                  {loading ? 'Doğrulanıyor...' : 'Giriş Yap'}
                </Button>
              </form>

              {/* Alt Butonlar */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleRequestNewPassword}
                  disabled={loading}
                  className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline w-full text-center font-medium transition-colors"
                >
                  🔄 Yeni şifre gönder
                </button>

                {!emailSent && (
                  <button
                    type="button"
                    onClick={handlePasswordNotReceived}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline w-full text-center font-medium transition-colors"
                  >
                    📭 Şifre gelmedi mi?
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 w-full text-center font-medium transition-colors flex items-center justify-center gap-1"
                  disabled={loading}
                >
                  <span>←</span> Farklı email ile giriş yap
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 Deplasman PlayStation Kırşehir</p>
        </div>
      </div>
    </div>
  )
}
