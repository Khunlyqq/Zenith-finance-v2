'use server'

import { createClient } from '@/lib/supabase/server'
import { transactionSchema } from '@/lib/validations/transaction'
import { revalidatePath } from 'next/cache'

export async function createTransaction(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const data = Object.fromEntries(formData.entries())
  const validated = transactionSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Input tidak valid" }
  }

  const { error } = await supabase
    .from('transactions')
    .insert({
      ...validated.data,
      user_id: user.id
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/transaksi')
  return { success: true }
}

export async function updateTransaction(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const data = Object.fromEntries(formData.entries())
  const validated = transactionSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Input tidak valid" }
  }

  const { error } = await supabase
    .from('transactions')
    .update(validated.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/transaksi')
  return { success: true }
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/transaksi')
  return { success: true }
}
