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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { BorderBeam } from '@/components/ui/border-beam'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Spinner } from '@radix-ui/themes'
import deplasman from "@/public/dep_disari.webp"
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
    <>
      <div className="lg:min-h-screen rounded-xl flex lg:items-center  justify-center bg-gradient-to-br from-slate-50 to-slate-100  dark:from-gray-900 dark:to-gray-800 p-4 lg:p-10">
        <div className="w-full max-w-xl">
          <Card className="relative w-full overflow-hidden ">
            <form
              onSubmit={
                showPasswordInput ? handleVerifyPassword : handleSendPassword
              }
              className="space-y-6"
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Image
                    src={logo}
                    alt="Deplasman Playstation"
                    width={80}
                    height={80}
                    className="rounded-xl"
                  />
                </div>
                <CardTitle> Admin Girişi </CardTitle>

                <CardDescription>
                  Sistemde kayıtlı mail adresini giriniz ve giriş tuşuna basın.
                  Mail adresiniz sistemde kayıtlı ise şifre gönderilecektir.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    {!showPasswordInput ? (
                      <>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Email adresi giriniz"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          // className="w-full h-12 text-base"
                        />
                      </>
                    ) : (
                      <div className="flex flex-col gap-2  items-center">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📧</span>
                            
                              <p className="text-sm text-green-700 dark:text-green-400">
                                <strong>{email}</strong> adresine 6 haneli şifre
                                gönderildi.
                              </p>
                           
                          </div>
                        </div>
                        <InputOTP
                          maxLength={6}
                          value={password}
                          required
                          autoFocus
                          onChange={(e) => {
                            const value = e.replace(/\D/g, "").slice(0, 6);
                            setPassword(value);
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          ⏱️ Şifre 10 dakika geçerlidir
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 justify-center">
                <Button type="submit" disabled={loading}>
                  {showPasswordInput ? "Giriş Yap" : "Şifre Gönder"}
                </Button>
                {showPasswordInput && (
                  <div className="space-y-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                )}
              </CardFooter>
              {/* <BorderBeam duration={8} size={100} /> */}
              
            </form>
               <BorderBeam
       duration={6}
        delay={3}
        size={400}
        borderWidth={2}
        className="from-transparent via-red-500 to-transparent"
      />
      <BorderBeam
        duration={6}
        delay={3}
        size={400}
        borderWidth={2}
        className="from-transparent via-blue-500 to-transparent"
      />
          </Card>
        </div>
      </div>
    </>
  );
}
