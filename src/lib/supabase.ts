import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

if (supabaseUrl.includes('placeholder')) {
  console.warn('⚠️ AetherForge: Using placeholder Supabase credentials. Network requests WILL fail. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
