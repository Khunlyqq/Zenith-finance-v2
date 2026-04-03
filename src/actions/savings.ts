'use server'

import { createClient } from '@/lib/supabase/server'
import { savingsGoalSchema } from '@/lib/validations/savings'
import { revalidatePath } from 'next/cache'

export async function createSavingsGoal(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const data = Object.fromEntries(formData.entries())
  const validated = savingsGoalSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Input tidak valid" }
  }

  const { error } = await supabase
    .from('savings_goals')
    .insert({
      ...validated.data,
      user_id: user.id
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/tabungan')
  return { success: true }
}

export async function updateSavingsGoal(id: string, prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const data = Object.fromEntries(formData.entries())
  const validated = savingsGoalSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Input tidak valid" }
  }

  const { error } = await supabase
    .from('savings_goals')
    .update(validated.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/tabungan')
  return { success: true }
}

export async function deleteSavingsGoal(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from('savings_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/tabungan')
  return { success: true }
}
