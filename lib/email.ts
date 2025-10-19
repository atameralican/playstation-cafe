import { showToast } from '@/components/ui/alertDep'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendPasswordEmail(email: string, password: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Deplasman Playstation Admin Paneli Giriş Şifreniz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Deplasman Playstation Salonu</h2>
          <p>Merhaba,</p>
          <p>Deplasman Playstation Admin paneline giriş yapmak için tek kullanımlık şifreniz:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; margin: 0; letter-spacing: 5px;">${password}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">Bu şifre 10 dakika geçerlidir.</p>
          <p style="color: #666; font-size: 14px;">Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('Email gönderme hatası:', error)
    showToast("Email gönderilemedi. Console'a bakınız. ")
    return false
  }
}
