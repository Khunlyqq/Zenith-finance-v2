import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nama lengkap harus terdiri dari minimal 3 karakter")
    .max(50, "Nama lengkap maksimal 50 karakter"),
});
