import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.coerce.number().positive('Nominal harus lebih dari 0'),
  type: z.enum(['income', 'expense', 'transfer']),
  category_id: z.string().uuid().optional().nullable(),
  wallet_id: z.string().uuid('Pilih wallet terlebih dahulu'),
  note: z.string().max(200, 'Catatan maksimal 200 karakter').optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid (YYYY-MM-DD)'),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
