import { z } from "zod";

export const budgetSchema = z.object({
  category_id: z.string().uuid('Pilih kategori pengeluaran'),
  amount: z.number().positive('Anggaran harus lebih dari 0'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Format bulan tidak valid (YYYY-MM)'),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
