'use server'

import { createClient } from '@/lib/supabase/server'
import { budgetSchema } from '@/lib/validations/budget'
import { revalidatePath } from 'next/cache'

export async function createBudget(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const data = Object.fromEntries(formData.entries())
  const validated = budgetSchema.safeParse(data)

  if (!validated.success) {
    return { error: "Input tidak valid" }
  }

  // Check if budget for this category and month already exists
  const { data: existingBudget } = await supabase
    .from('budgets')
    .select('id')
    .eq('user_id', user.id)
    .eq('category_id', validated.data.category_id)
    .eq('month', validated.data.month)
    .single()

  let error;
  if (existingBudget) {
    const { error: updateError } = await supabase
      .from('budgets')
      .update({ amount: validated.data.amount })
      .eq('id', existingBudget.id)
    error = updateError;
  } else {
    const { error: insertError } = await supabase
      .from('budgets')
      .insert({
        ...validated.data,
        user_id: user.id
      })
    error = insertError;
  }

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/anggaran')
  return { success: true }
}

export async function deleteBudget(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/anggaran')
  return { success: true }
}
