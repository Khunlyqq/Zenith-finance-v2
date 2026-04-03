'use server'

import { createClient } from '@/lib/supabase/server'
import { walletSchema } from '@/lib/validations/wallet'
import { revalidatePath } from 'next/cache'

export async function createWallet(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const data = Object.fromEntries(formData.entries())
  const validated = walletSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Input tidak valid" }
  }

  const { error } = await supabase
    .from('wallets')
    .insert({
      ...validated.data,
      user_id: user.id
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateWallet(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const data = Object.fromEntries(formData.entries())
  const validated = walletSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Input tidak valid" }
  }

  const { error } = await supabase
    .from('wallets')
    .update(validated.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteWallet(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from('wallets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
