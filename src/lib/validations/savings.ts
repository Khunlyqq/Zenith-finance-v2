import { z } from "zod";

export const savingsGoalSchema = z.object({
  name: z.string().min(1, 'Nama target tidak boleh kosong').max(50, 'Nama target maksimal 50 karakter'),
  target_amount: z.number().positive('Target nominal harus lebih dari 0'),
  current_amount: z.number().min(0, 'Saldo awal tidak boleh negatif').optional().default(0),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid (YYYY-MM-DD)').optional().nullable(),
});

export type SavingsGoalInput = z.input<typeof savingsGoalSchema>;
