import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Silently fail if cookies cannot be set (e.g., in Server Components)
            // But log in Dev for debugging
            if (process.env.NODE_ENV === 'development') {
              console.warn("Cookie set error (Expected in some contexts):", error);
            }
          }
        },
      },
    }
  )
}
