"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createWallet(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Terjadi kesalahan: User tidak ditemukan" };
  }

  const name = formData.get("name") as string;
  const balance = Number(formData.get("balance")) || 0;
  const color = formData.get("color") as string || "#86d2e5";

  const { error } = await supabase
    .from("wallets")
    .insert([
      { 
        user_id: user.id, 
        name, 
        balance,
        color
      }
    ]);

  if (error) {
    console.error("Error creating wallet:", error);
    return { error: "Gagal membuat dompet baru" };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/tabungan");
  return { success: true };
}
