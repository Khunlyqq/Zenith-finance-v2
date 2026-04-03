import { cache } from 'react'
import { createClient } from './server'

export const getCachedUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
})

export const getCachedProfile = cache(async (userId: string) => {
  const supabase = await createClient()
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return profile
  } catch (err) {
    console.error('Cached Profile Fetch Error:', err)
    return null
  }
})
