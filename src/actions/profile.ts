'use server'

import { createClient } from '@/lib/supabase/server'
import { updateProfileSchema } from '@/lib/validations/profile'
import { revalidatePath } from 'next/cache'

export async function updateProfileName(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Verify access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Sesi tidak valid. Harap login kembali." }
  }

  const data = Object.fromEntries(formData.entries())
  const validated = updateProfileSchema.safeParse(data)

  if (!validated.success) {
    return { error: validated.error.issues[0].message || "Data tidak valid" }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: validated.data.fullName })
    .eq('id', user.id)

  if (error) {
    return { error: "Gagal menyimpan perubahan: " + error.message }
  }

  revalidatePath('/profil')
  revalidatePath('/pengaturan')
  revalidatePath('/')
  
  return { success: "Nama berhasil diperbarui!" }
}

export async function togglePremiumStatus(isPremium: boolean) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Sesi tidak valid." }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ is_premium: isPremium })
    .eq('id', user.id)

  if (error) {
    return { error: "Gagal memproses fitur premium." }
  }

  revalidatePath('/profil')
  revalidatePath('/pengaturan')
  revalidatePath('/')
  
  return { success: `Berhasil di-update ke Zenith ${isPremium ? 'Premium' : 'Standard'}!` }
}

export async function updatePreferences(key: string, value: boolean | string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Sesi tidak valid." }
  }

  const currentPreferences = user.user_metadata?.preferences || {}
  const newPreferences = {
    ...currentPreferences,
    [key]: value
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      preferences: newPreferences
    }
  })

  if (error) {
    return { error: "Gagal menyimpan pengaturan: " + error.message }
  }

  // Not revalidating layout aggressively because some toggles like Dark Mode
  // should feel instantaneous using React state overriden by server data.
  // Revalidating /pengaturan will fetch the new user object on hard refresh.
  revalidatePath('/pengaturan')
  revalidatePath('/profil')
  revalidatePath('/')
  
  return { success: true }
}

export async function updateAvatarUrl(avatarUrl: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Sesi tidak valid." }
  }

  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl }
  })

  if (error) {
    return { error: "Gagal menyimpan foto profil: " + error.message }
  }

  revalidatePath('/profil')
  revalidatePath('/')
  
  return { success: "Foto profil berhasil diperbarui!" }
}
