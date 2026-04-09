import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * checkSupabaseHealth — verifies the Supabase connection is responsive.
 * Returns true if the connection succeeds, false otherwise.
 */
export async function checkSupabaseHealth() {
  if (!supabaseUrl || !supabaseAnonKey) return false
  try {
    const { error } = await supabase.from('settings').select('*').limit(1)
    return !error
  } catch {
    return false
  }
}
