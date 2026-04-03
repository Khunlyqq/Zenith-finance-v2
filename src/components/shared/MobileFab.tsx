"use client";

import { PlusCircle, FileDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useModal } from "@/components/providers/ModalProvider";
import { createClient } from "@/lib/supabase/client";
import { downloadCSV } from "@/lib/utils/export";
import { toast } from "sonner";

export default function MobileFab() {
  const pathname = usePathname();
  const { openTransactionModal, openBudgetModal, openSavingsModal } = useModal();

  const handleAction = async () => {
    if (pathname === "/laporan") {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*, categories(name), wallets(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) {
        toast.error("Gagal mengunduh laporan");
        return;
      }

      if (!data || data.length === 0) {
        toast.error("Tidak ada data transaksi untuk diunduh");
        return;
      }

      // Flatten data for CSV
      const flattenedData = data.map(tx => ({
        Tanggal: new Date(tx.date).toLocaleDateString("id-ID"),
        Catatan: tx.note || "",
        Kategori: tx.categories?.name || "",
        Dompet: tx.wallets?.name || "",
        Tipe: tx.type === "income" ? "Pemasukan" : "Pengeluaran",
        Jumlah: tx.amount
      }));

      downloadCSV(flattenedData, `Laporan_Keuangan_${new Date().toISOString().split('T')[0]}`);
      toast.success("Laporan berhasil diunduh");
    } else if (pathname === "/anggaran") {
      openBudgetModal();
    } else if (pathname === "/tabungan") {
      openSavingsModal();
    } else {
      openTransactionModal();
    }
  };

  const isLaporan = pathname === "/laporan";

  return (
    <div className="fixed bottom-24 right-6 z-50 md:hidden animate-in fade-in slide-in-from-bottom-5 duration-500">
      <button
        onClick={handleAction}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#86d2e5] to-[#006778] text-[#101415] shadow-[0_8px_30px_rgb(134,210,229,0.4)] active:scale-90 transition-transform premium-glow"
      >
        {isLaporan ? <FileDown size={24} /> : <PlusCircle size={24} />}
      </button>
    </div>
  );
}
