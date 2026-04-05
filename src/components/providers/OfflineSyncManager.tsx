"use client";

import { useEffect, useRef } from "react";
import { createTransaction } from "@/actions/transactions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function OfflineSyncManager() {
  const isSyncing = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const handleOnline = async () => {
      if (isSyncing.current) return;

      const pendingStr = localStorage.getItem('zenith_pending_tx');
      if (!pendingStr) return;
      
      const pending: any[] = JSON.parse(pendingStr);
      if (pending.length === 0) return;

      isSyncing.current = true;
      toast.info(`Menyinkronkan ${pending.length} transaksi luring...`);

      let successCount = 0;
      const failed = [];

      for (const tx of pending) {
        const formData = new FormData();
        Object.entries(tx).forEach(([k, v]) => {
          if (k !== '_id' && k !== 'createdAt') {
             formData.append(k, String(v));
          }
        });
        
        try {
          const res = await createTransaction(null, formData);
          if (!res?.error) {
            successCount++;
          } else {
            failed.push(tx); // Simpan kembali jika gagal server error
          }
        } catch (e) {
          failed.push(tx); // Simpan kembali jika koneksi putus tiba-tiba
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} transaksi berhasil dikirim ke server!`);
        router.refresh(); // Segarkan UI 
      }

      if (failed.length > 0) {
        localStorage.setItem('zenith_pending_tx', JSON.stringify(failed));
      } else {
        localStorage.removeItem('zenith_pending_tx');
      }

      isSyncing.current = false;
    };

    window.addEventListener('online', handleOnline);
    
    // Periksa antrean ketika komponen pertama kali dimuat (berpotensi saat mereka membuka app sewaktu sudah online)
    if (navigator.onLine) {
       handleOnline();
    }

    return () => window.removeEventListener('online', handleOnline);
  }, [router]);

  // v2.1.4 - Master branch sync deployment
  useEffect(() => {
    const CURRENT_VERSION = "2.1.4";
    const storedVersion = localStorage.getItem("ZENITH_APP_VERSION");

    if (storedVersion !== CURRENT_VERSION) {
      const clearAndReload = async () => {
        const loadingToast = toast.loading(`Memperbarui aplikasi ke ${CURRENT_VERSION}...`);
        
        try {
          // Unregister all service workers
          if ("serviceWorker" in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
          }

          // Clear all caches
          if ("caches" in window) {
            const cacheNames = await caches.keys();
            for (const cacheName of cacheNames) {
              await caches.delete(cacheName);
            }
          }

          // Clear specific storage but keep critical auth/pending data if possible
          // For now, a full refresh is safer for a hard bug fix
          localStorage.setItem("ZENITH_APP_VERSION", CURRENT_VERSION);
          
          toast.success("Aplikasi diperbarui. Memuat ulang...", { id: loadingToast });
          
          // Delay briefly so the user can see the success toast
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error("Gagal membersihkan cache:", error);
          window.location.reload();
        }
      };

      clearAndReload();
    }
  }, []);

  return null;
}
