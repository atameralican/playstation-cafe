import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// TypeScript için type tanımı
export type Oyun = {
  id: string
  created_at: string
  oyun_adi: string
  cihaz_turu: string
  kac_kisilik: number
  kategori: string
  ea_playde_mi: boolean
  gorsel_url: string | null
}