export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string
  full_name: string | null
  currency: string
  is_premium: boolean
  created_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  icon: string | null
  color: string | null
  is_default: boolean
}

export interface Wallet {
  id: string
  user_id: string
  name: string
  type: 'tunai' | 'bank' | 'e-wallet'
  balance: number
  color: string | null
}

export interface Transaction {
  id: string
  user_id: string
  wallet_id: string
  category_id: string | null
  type: 'income' | 'expense' | 'transfer'
  amount: number
  note: string | null
  date: string
  category?: Category
  wallet?: Wallet
}

export interface Budget {
  id: string
  user_id: string
  category_id: string
  amount: number
  month: string // YYYY-MM
  category?: Category
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
}
