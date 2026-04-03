import { z } from "zod";

export const walletSchema = z.object({
  name: z.string().min(2, "Nama dompet minimal 2 karakter"),
  type: z.enum(['tunai', 'bank', 'e-wallet']),
  balance: z.coerce.number().default(0),
  color: z.string().optional().nullable(),
});

export type WalletInput = z.infer<typeof walletSchema>;
