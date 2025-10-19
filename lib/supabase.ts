import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin kontrolü için
export async function isAdminEmail(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', email.toLowerCase())
    .single()

  return !error && !!data
}
