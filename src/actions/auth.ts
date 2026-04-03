'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, registerSchema } from '@/lib/validations/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const data = Object.fromEntries(formData.entries())
  const validated = loginSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Format email atau password tidak valid" }
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  })

  if (error) {
    return { error: "Login gagal: Email atau password tidak sesuai" }
  }

  // Double check session persistence before redirect
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Sesi gagal dibuat. Hubungi bantuan jika berlanjut." }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function register(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const data = Object.fromEntries(formData.entries())
  const validated = registerSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Input pendaftaran tidak valid" }
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        full_name: validated.data.fullName,
      },
    },
  })

  if (error) {
    return { error: "Pendaftaran gagal: " + error.message }
  }

  // Pre-fetch user to confirm session
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Pendaftaran berhasil, silakan login manual." }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}


export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  
  if (error) {
    return { error: "Gagal memproses pembaruan sandi." }
  }
  
  return { success: "Tautan pembaruan sandi berhasil dikirim ke email Anda!" }
}
