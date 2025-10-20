import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Public client (RLS politikalarına uyar)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin kontrolü için
export async function isAdminEmail(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', email.toLowerCase())
    .single()

  if (error) {
    console.error('Admin email check error:', error)
  }

  return !error && !!data
}

// Service role client (RLS'i bypass eder - sadece backend'de kullanın!)
// .env.local'e SUPABASE_SERVICE_ROLE_KEY eklerseniz kullanabilirsiniz
export function getServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not found')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
