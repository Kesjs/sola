import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const supabase = url && key ? createClient(url, key) : null

export async function ensureSolaProfile(user: { id: string; email?: string | null }) {
  if (!supabase) return { error: new Error('Supabase non configuré') }
  return supabase.from('sola_profiles').upsert({ id: user.id, email: user.email ?? null }, { onConflict: 'id' })
}
