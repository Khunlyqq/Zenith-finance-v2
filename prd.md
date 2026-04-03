
PRODUCT REQUIREMENTS DOCUMENT
Dompetku
Aplikasi Pengatur Keuangan Pribadi

Versi 1.2   •   Maret 2026
Status: Draft

Dokumen	Detail
Nama Produk	Dompetku — Aplikasi Pengatur Keuangan Pribadi
Platform	Web App (PWA) — Next.js 15 App Router
Stack	Next.js 15 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Vercel
Target Launch	Q4 2026 (MVP)
Dokumen versi	1.2 — PRD + Alur Kerja AI Agent
 
BAGIAN A
Product Requirements Document
 
1. Ringkasan Eksekutif
Dompetku adalah aplikasi web pengatur keuangan pribadi yang membantu pengguna Indonesia mengelola pemasukan, pengeluaran, anggaran, dan tujuan menabung. Dibangun di atas stack modern Next.js + Supabase + Vercel, Dompetku dirancang sebagai Progressive Web App (PWA) yang dapat diakses dari browser desktop maupun mobile tanpa perlu instal.

Banyak masyarakat Indonesia, terutama generasi muda usia 18-35 tahun, masih kesulitan melacak keuangan harian secara konsisten. Aplikasi yang ada sering terlalu kompleks, berbahasa Inggris, atau tidak relevan secara lokal.

Aspek	Detail
Nama Produk	Dompetku
Platform	Web App (PWA) — dapat diakses via browser desktop & mobile
Target Peluncuran	Q4 2026 (MVP)
Target Pengguna	Individu usia 18-35, Indonesia
Model Bisnis	Freemium (gratis + langganan premium)
Deployment	Vercel (hosting) + Supabase (database & auth)
Bahasa	Bahasa Indonesia (utama)
 
2. Tujuan Produk
2.1 Problem Statement
Mayoritas pengguna Indonesia tidak memiliki sistem pencatatan keuangan yang konsisten. Masalah utama:
•	Lupa mencatat pengeluaran kecil (kopi, transportasi, jajan)
•	Tidak tahu ke mana uang pergi di akhir bulan
•	Tidak punya anggaran bulanan yang realistis
•	Sulit menabung karena tidak ada target yang terukur
•	Aplikasi keuangan yang ada terlalu rumit atau tidak relevan secara lokal

2.2 Tujuan Bisnis
•	Mencapai 50.000 pengguna terdaftar dalam 3 bulan pertama
•	Mencapai 5% konversi ke paket Premium dalam 6 bulan
•	Retention rate 40% pada bulan ke-3

2.3 Tujuan Pengguna
•	Mengetahui sisa uang yang bisa dipakai hari ini dengan mudah
•	Mendapat insight pengeluaran bulanan tanpa hitung manual
•	Memiliki target tabungan yang terasa nyata dan bisa dicapai
 
3. Target Pengguna & Personas
3.1 Segmen Pengguna
Segmen	Deskripsi	Kebutuhan Utama
Fresh Graduate	Usia 21-25, baru kerja, gaji pertama	Belajar budgeting, kontrol pengeluaran
Karyawan Muda	Usia 25-35, pendapatan tetap/freelance	Lacak cicilan, tabungan jangka menengah
Ibu Rumah Tangga	Mengelola keuangan keluarga	Anggaran belanja, dana darurat
Pelajar/Mahasiswa	Usia 18-22, uang kiriman/beasiswa	Atur uang saku bulanan

3.2 Persona Utama
Persona 1 — Rizky, 24 tahun, Fresh Graduate
Atribut	Detail
Pekerjaan	Staff marketing di startup, gaji Rp 5 juta/bulan
Perilaku	Sering impulsif belanja online, pakai GoPay & QRIS
Frustrasi	Selalu habis sebelum akhir bulan, tidak tahu ke mana perginya
Tujuan	Nabung Rp 500rb/bulan untuk liburan
Kebutuhan App	Onboarding cepat, input pengeluaran 1-klik, notifikasi saldo

Persona 2 — Sari, 31 tahun, Ibu Rumah Tangga
Atribut	Detail
Pekerjaan	Mengelola keuangan rumah tangga + usaha kecil
Perilaku	Masih catat di buku, transfer antar rekening manual
Frustrasi	Susah bedakan pengeluaran pribadi vs usaha
Tujuan	Dana darurat 3 bulan pengeluaran
Kebutuhan App	Multi-wallet, kategori custom, laporan PDF
 
4. Fitur Produk
4.1 Fitur MVP (Free Tier)
4.1.1 Autentikasi & Onboarding
•	Login/daftar via email atau Google OAuth (Supabase Auth)
•	Onboarding wizard: nama, mata uang (default IDR), saldo awal wallet
•	Protected routes dengan Next.js middleware

4.1.2 Pencatatan Transaksi
•	Input transaksi manual (pemasukan & pengeluaran)
•	Kategori default: Makan, Transport, Belanja, Hiburan, Tagihan, Kesehatan, Lainnya
•	Tambah catatan per transaksi
•	Edit & hapus transaksi
•	Riwayat transaksi dengan filter tanggal & kategori

4.1.3 Dashboard & Ringkasan
•	Saldo total real-time (Supabase Realtime)
•	Ringkasan pemasukan vs pengeluaran bulan ini
•	Grafik donat pengeluaran per kategori (Recharts)
•	Daftar transaksi terbaru
•	Progress anggaran bulanan per kategori

4.1.4 Anggaran Bulanan (Budget)
•	Set anggaran per kategori tiap bulan
•	Indikator visual (shadcn Progress bar) berdasarkan penggunaan
•	Notifikasi in-app saat anggaran hampir habis (80% & 100%)

4.1.5 Tujuan Tabungan
•	Buat target tabungan (nama, jumlah, deadline)
•	Progress bar visual per tujuan
•	Estimasi kapan tujuan tercapai berdasarkan ritme menabung

4.1.6 Multi-Wallet (maks. 3 di free tier)
•	Dompet default: Tunai, Bank, E-wallet
•	Transfer antar dompet dengan pencatatan otomatis
•	Saldo per dompet ditampilkan terpisah

4.2 Fitur Premium
Fitur	Deskripsi
Wallet Tak Terbatas	Tambah wallet tanpa batas
Export Laporan PDF	Ringkasan keuangan ke PDF (Server Action + Puppeteer)
Kategori Custom	Buat & edit kategori sendiri tak terbatas
Analisis Tren	Grafik tren 6 bulan, perbandingan antar bulan
Pengingat Tagihan	Notifikasi jatuh tempo cicilan (cron via Vercel)
Dark Mode	Tema gelap penuh via Tailwind dark:
CSV Export	Export semua transaksi ke CSV
 
5. User Flow Utama
5.1 Onboarding
•	Buka URL → Landing page → Klik Daftar Gratis
•	Auth via email atau Google (Supabase Auth → redirect callback)
•	Wizard 3 langkah: profil → pilih kategori → set saldo awal
•	Selesai → redirect ke /dashboard

5.2 Catat Pengeluaran (Core Flow)
•	Klik tombol + Tambah Transaksi di dashboard
•	Sheet/Dialog (shadcn Sheet) muncul: isi nominal, kategori, wallet, tanggal
•	Submit → Server Action Next.js memanggil Supabase insert
•	UI terupdate otomatis via revalidatePath atau Supabase Realtime

5.3 Cek Laporan Bulanan
•	Navigasi ke /laporan → Pilih bulan dari date picker
•	Server Component fetch data dari Supabase dengan filter bulan
•	Tampilkan ringkasan + grafik Recharts
•	(Premium) Klik Export PDF → trigger Server Action generate PDF
 
6. Persyaratan Non-Fungsional
6.1 Performa
•	LCP (Largest Contentful Paint) < 2.5 detik
•	Dashboard load < 1 detik (data-fetching di Server Component)
•	Optimistic UI pada input transaksi (useOptimistic hook Next.js)
•	PWA: dapat digunakan offline dengan Service Worker untuk baca data

6.2 Keamanan & Privasi
•	Row Level Security (RLS) Supabase aktif di semua tabel
•	Service role key TIDAK pernah diekspos ke client
•	Autentikasi via Supabase Auth + cookie session (SSR-safe)
•	HTTPS enforced via Vercel
•	Comply dengan UU PDP Indonesia

6.3 Aksesibilitas & UX
•	Komponen shadcn/ui memenuhi ARIA standard secara default
•	Responsive layout: mobile-first dengan Tailwind breakpoints
•	Kontras warna memenuhi WCAG AA
•	Support keyboard navigation penuh
 
7. Arsitektur & Tech Stack
7.1 Stack Utama
Layer	Teknologi	Versi	Peran
Framework	Next.js (App Router)	15.x	SSR, Server Actions, routing, middleware
Styling	Tailwind CSS	v4	Utility-first styling, dark mode, responsive
UI Components	shadcn/ui	latest	Dialog, Sheet, Table, Form, Progress
Language	TypeScript	5.x (strict)	Type safety di seluruh codebase
Database	Supabase (PostgreSQL)	latest	Database utama, Realtime, RLS
Auth	Supabase Auth	latest	Email + Google OAuth, SSR session
Runtime Backend	Node.js	20 LTS	Server Actions, API routes, PDF generation
Hosting	Vercel	latest	Deploy otomatis, Edge Functions, Cron Jobs
Charts	Recharts	2.x	Grafik donat, bar, tren keuangan
Form	React Hook Form + Zod	latest	Validasi form sisi client & server

7.2 Skema Database (Supabase)
Tabel	Kolom Kunci	Keterangan
profiles	id, full_name, currency, is_premium	Extends auth.users, dibuat otomatis via trigger
wallets	id, user_id, name, type, balance	Dompet milik user, RLS by user_id
transactions	id, user_id, wallet_id, category_id, amount, type, date	Semua transaksi masuk/keluar
categories	id, user_id, name, icon, color, is_default	Kategori global (user_id null) + custom
budgets	id, user_id, category_id, amount, month	Anggaran per kategori per bulan
savings_goals	id, user_id, name, target_amount, current_amount, deadline	Target tabungan

7.3 Pola Arsitektur Next.js
•	Server Components untuk fetch data — tidak ada loading spinner di halaman utama
•	Server Actions untuk semua mutasi — tidak perlu API route terpisah
•	async cookies() dari next/headers untuk akses sesi di server (Next.js 15)
•	Middleware untuk proteksi route: semua /dashboard/** redirect ke /login jika tidak autentikasi
•	revalidatePath() / revalidateTag() setelah mutasi untuk invalidasi cache
 
8. Struktur Proyek
Path	Keterangan
app/(auth)/login	Halaman login/daftar (public route)
app/(auth)/callback/route.ts	OAuth callback handler
app/(dashboard)/dashboard	Halaman utama (protected)
app/(dashboard)/transaksi	Riwayat & manajemen transaksi
app/(dashboard)/anggaran	Budget per kategori
app/(dashboard)/tabungan	Tujuan tabungan
app/(dashboard)/laporan	Laporan bulanan + chart
app/onboarding	Wizard setup akun baru
actions/	Server Actions: auth, transactions, wallets, budgets, savings
components/ui/	Komponen shadcn/ui (jangan edit manual)
components/shared/	Komponen custom: TransactionCard, BudgetBar, SavingsGoalCard
lib/supabase/	client.ts, server.ts, middleware.ts
lib/validations/	Zod schemas untuk semua form
types/index.ts	Semua TypeScript interfaces & types
 
9. Roadmap & Milestone
Fase	Durasi	Deliverable
Fase 0 — Discovery	2 minggu	User interview, validasi problem, wireframe lo-fi
Fase 1 — Setup & Auth	1 minggu	Init Next.js 15, Tailwind v4, shadcn, Supabase, auth flow lengkap
Fase 2 — Core Features	5 minggu	Dashboard, transaksi CRUD, multi-wallet, anggaran, tabungan
Fase 3 — Polish & PWA	2 minggu	Responsive, PWA, dark mode, empty states, loading skeleton
Fase 4 — Beta & Launch	2 minggu	Bug fix, Vercel deploy, domain, monitoring
Fase 5 — Premium	Ongoing	Export PDF, kategori custom, analisis tren, cron notifikasi
Fase 6 — Scale	Q3 2027	Open banking, integrasi e-wallet, fitur investasi sederhana
 
10. Metrik Keberhasilan (KPI)
Kategori	Metrik	Target 3 Bulan
Akuisisi	Total pengguna terdaftar	50.000
Aktivasi	User selesai onboarding	> 70%
Retensi	Retention bulan ke-3	> 40%
Engagement	Rata-rata transaksi/user/bulan	> 20 transaksi
Performa	Core Web Vitals (LCP)	< 2.5 detik
Monetisasi	Konversi ke Premium	> 5% dari MAU
Kepuasan	NPS Score	> 40
 
11. Risiko & Mitigasi
Risiko	Probabilitas	Dampak	Mitigasi
Pengguna malas input manual	Tinggi	Tinggi	Quick-add modal, keyboard shortcut, reminder harian
Performa buruk di mobile browser	Sedang	Tinggi	Mobile-first Tailwind, lazy load, optimistic UI
Data hilang karena bug RLS	Sedang	Sangat Tinggi	Test RLS policy di Supabase Studio, unit test Server Actions
Low conversion ke Premium	Sedang	Tinggi	Trial 30 hari Premium gratis saat onboarding
Kompetisi dari aplikasi mobile native	Tinggi	Sedang	PWA + installable, UX lokal, onboarding < 2 menit
 
12. Open Questions
•	Apakah fitur scan struk (OCR) via Vercel AI SDK masuk di v1 atau v2?
•	Integrasi open banking Indonesia — feasible secara regulasi untuk startup kecil?
•	Harga Premium optimal: Rp 15.000/bulan vs Rp 99.000/tahun?
•	Export PDF via Puppeteer (Server Action) atau library ringan seperti jsPDF?
•	Apakah perlu fitur shared wallet (kolaborasi pasangan/keluarga) di medium-term roadmap?
 
BAGIAN B
Alur Kerja AI Agent
Panduan implementasi step-by-step untuk AI coding agent
 
13. Prinsip Utama (Baca Sebelum Apapun)
Prinsip-prinsip ini WAJIB diikuti di setiap file dan fitur yang dibuat. Tidak ada pengecualian.

#	Prinsip	Aturan
1	Server-first	Selalu gunakan Server Component. Tambahkan "use client" hanya jika butuh useState/useEffect/event handler
2	Server Actions untuk mutasi	Tidak ada API route terpisah untuk CRUD. Semua mutasi via folder actions/
3	RLS selalu aktif	Setiap tabel Supabase wajib punya RLS policy. Tidak ada query tanpa filter user_id
4	Service role key = rahasia	SUPABASE_SERVICE_ROLE_KEY hanya boleh di Server Action. TIDAK PERNAH di komponen client
5	async cookies()	Di Next.js 15, cookies() bersifat async. Selalu await cookies() saat akses session di server
6	Zod untuk validasi	Semua input form wajib divalidasi dengan Zod schema sebelum masuk ke Supabase
7	revalidatePath()	Setelah setiap mutasi, panggil revalidatePath() agar UI tidak stale
 
14. Urutan Build yang Disarankan
Ikuti urutan ini secara berurutan. Jangan lompat fase.

Urutan	Fase	Output
1	Project Setup	Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui terinisialisasi
2	Supabase Schema + RLS	Semua tabel dibuat, RLS aktif, trigger profile otomatis
3	Supabase Client Files + Middleware	client.ts, server.ts, middleware.ts, route protection aktif
4	Layout & Navigasi	Sidebar, protected routes, dashboard layout
5	Auth Pages	Login, register, OAuth callback, logout berfungsi
6	Onboarding Flow	Wizard 3 langkah selesai dan redirect ke dashboard
7	Wallet CRUD	Buat, edit, hapus wallet dengan saldo awal
8	Transaction CRUD + Dashboard	Form transaksi, riwayat, summary card, chart donat
9	Budget Feature	Set anggaran per kategori, progress bar, warning 80%/100%
10	Savings Goals	Buat target, update saldo, estimasi selesai
11	Laporan & Charts	Filter bulan, grafik tren Recharts, ringkasan bulanan
12	Deploy ke Vercel	Push GitHub, env vars, domain, Supabase auth URL update
13+	Premium Features	Export PDF, kategori custom, dark mode, cron notifikasi
 
15. Fase 0 — Project Setup
15.1 Init Project
npx create-next-app@latest dompetku \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd dompetku

15.2 Install Dependencies
# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Validasi
npm install zod react-hook-form @hookform/resolvers

# UI tambahan
npm install recharts lucide-react

15.3 Init shadcn/ui
npx shadcn@latest init
# Pilih: Default style, Neutral base color, CSS variables: yes

npx shadcn@latest add button card dialog form input label \
  select sheet table tabs badge progress toast separator \
  dropdown-menu avatar skeleton popover calendar

15.4 Environment Variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx   # JANGAN expose ke client!
 
16. Fase 1 — Supabase Schema & RLS
Jalankan SQL di bawah di Supabase SQL Editor secara berurutan sesuai nomor. Urutan penting karena foreign key dependencies.

16.1 Tabel profiles + Trigger
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  currency text default 'IDR',
  is_premium boolean default false,
  created_at timestamptz default now()
);

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

16.2 Tabel categories, wallets, transactions, budgets, savings_goals
Buat tabel berikut secara berurutan. Setiap tabel memerlukan tabel sebelumnya sudah ada.
Tabel	FK Dependency	Kolom Penting
categories	profiles.id (nullable)	user_id, name, icon, color, is_default
wallets	profiles.id	user_id, name, type, balance, color
transactions	profiles.id, wallets.id, categories.id	user_id, wallet_id, category_id, type, amount, date
budgets	profiles.id, categories.id	user_id, category_id, amount, month (UNIQUE per user+category+month)
savings_goals	profiles.id	user_id, name, target_amount, current_amount, deadline

16.3 Row Level Security — Wajib untuk Semua Tabel
-- Aktifkan RLS
alter table profiles enable row level security;
alter table wallets enable row level security;
alter table transactions enable row level security;
alter table categories enable row level security;
alter table budgets enable row level security;
alter table savings_goals enable row level security;

-- profiles
create policy "users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "users can update own profile" on profiles
  for update using (auth.uid() = id);

-- wallets, transactions, budgets, savings_goals (pola sama)
create policy "users can crud own wallets" on wallets
  for all using (auth.uid() = user_id);

-- categories: bisa lihat default (user_id null) + milik sendiri
create policy "users can view categories" on categories
  for select using (user_id is null or auth.uid() = user_id);
create policy "users can crud own categories" on categories
  for all using (auth.uid() = user_id);
 
17. Fase 2 — Supabase Client Files
17.1 src/lib/supabase/client.ts (Browser)
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

17.2 src/lib/supabase/server.ts (Server Component & Action)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies() // WAJIB await di Next.js 15
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

17.3 src/middleware.ts (Route Protection)
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

// Di lib/supabase/middleware.ts:
// Redirect /dashboard/** ke /login jika tidak ada session
// Redirect /login ke /dashboard jika sudah login
 
18. Fase 3 — Pola Kode Wajib
18.1 Pola A — Server Component + Data Fetch
// app/(dashboard)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(*), wallets(*)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(10)

  return <DashboardClient transactions={transactions ?? []} />
}

18.2 Pola B — Server Action (Mutasi)
// actions/transactions.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { transactionSchema } from '@/lib/validations/transaction'

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validated = transactionSchema.safeParse({
    amount: Number(formData.get('amount')),
    type: formData.get('type'),
    category_id: formData.get('category_id'),
    wallet_id: formData.get('wallet_id'),
  })

  if (!validated.success) return { error: validated.error.flatten() }

  const { error } = await supabase
    .from('transactions')
    .insert({ ...validated.data, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/transaksi')
  return { success: true }
}

18.3 Pola C — Zod Validation Schema
// lib/validations/transaction.ts
import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z.number().positive('Nominal harus lebih dari 0'),
  type: z.enum(['income', 'expense', 'transfer']),
  category_id: z.string().uuid().optional(),
  wallet_id: z.string().uuid('Pilih wallet terlebih dahulu'),
  note: z.string().max(200).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type TransactionInput = z.infer<typeof transactionSchema>
 
19. Fase 4 — Alur Fitur Per Halaman
19.1 Dashboard (/dashboard)
1.	Server Component fetch: transactions (10 terbaru) + wallets (semua) + budgets bulan ini
2.	Hitung: total saldo semua wallet, total income bulan ini, total expense bulan ini
3.	Render: WalletSummary cards, ExpenseDonut chart, BudgetBar list, RecentTransactions table
4.	Client button "+ Tambah" → buka shadcn Sheet → mount TransactionForm

19.2 Transaksi (/transaksi)
5.	Server Component fetch semua transaksi dengan pagination (20 per halaman)
6.	Filter via URL search params: tanggal range, kategori, tipe, wallet
7.	Tabel dengan shadcn Table component
8.	Setiap row: tombol edit (buka Dialog) dan hapus (AlertDialog konfirmasi)

19.3 Anggaran (/anggaran)
9.	Fetch budgets bulan ini + kalkulasi total spent per kategori dari transactions
10.	Render BudgetBar per kategori: label, nominal budget, amount spent, progress bar
11.	Tombol Set Anggaran → Dialog form → Server Action upsertBudget

19.4 Tabungan (/tabungan)
12.	Fetch semua savings_goals milik user
13.	Render SavingsGoalCard per goal: nama, progress bar, nominal, deadline, estimasi selesai
14.	Tombol Tambah Dana → Dialog → Server Action update current_amount

19.5 Laporan (/laporan)
15.	URL param ?month=2026-03 menentukan data yang di-fetch
16.	Server Component aggregate: total income, total expense, breakdown per kategori
17.	Render ringkasan + MonthlyTrendChart (Recharts BarChart)
 
20. Fase 5 — Auth & Onboarding Flow
20.1 Alur Register
/register → Form (email, password, nama)
  → Server Action: supabase.auth.signUp()
  → Trigger DB otomatis buat profil di tabel profiles
  → Redirect ke /onboarding

20.2 Alur Login
/login → Form (email+password atau tombol Google)
  → supabase.auth.signInWithPassword()
  ATAU supabase.auth.signInWithOAuth({ provider: 'google',
       redirectTo: '/auth/callback' })
  → Middleware cek session → redirect ke /dashboard

20.3 OAuth Callback Handler
// app/(auth)/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = new URL(request.url).searchParams.get('code')
  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(new URL('/dashboard', request.url))
}

20.4 Onboarding Flow
Langkah	Aksi	Server Action
1 — Profil	Isi nama lengkap + mata uang	UPDATE profiles SET full_name, currency
2 — Wallet Pertama	Buat wallet dengan saldo awal (boleh 0)	INSERT wallets (nama, tipe, saldo)
3 — Kategori (opsional)	Pilih atau skip, lanjut ke dashboard	Bisa skip, redirect /dashboard
 
21. Fase 6 — Deployment ke Vercel
21.1 Push ke GitHub
git init && git add . && git commit -m "feat: initial setup"
git remote add origin https://github.com/username/dompetku.git
git push -u origin main

21.2 Deploy ke Vercel
18.	Import repo di vercel.com
19.	Set Environment Variables di dashboard Vercel: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
20.	Vercel auto-deploy setiap push ke main

21.3 Update Supabase Auth URLs
# Di Supabase Dashboard > Authentication > URL Configuration:
Site URL: https://dompetku.vercel.app
Redirect URLs: https://dompetku.vercel.app/auth/callback
 
22. Checklist Sebelum Setiap Fitur Baru
Verifikasi semua poin berikut sebelum dianggap selesai.

#	Item Checklist	Keterangan
1	RLS policy sudah dibuat	Untuk setiap tabel yang diakses oleh fitur baru
2	Validasi Zod di Server Action	Sebelum query Supabase, bukan setelah
3	user_id dari auth.getUser()	Bukan dari form, params, atau hardcode
4	revalidatePath() dipanggil	Setelah setiap insert / update / delete
5	"use client" di baris pertama	Hanya jika komponen benar-benar perlu interaktivitas
6	SERVICE_ROLE_KEY tidak di client	Pastikan tidak ada di file dengan "use client"
7	Loading skeleton ada	Untuk setiap halaman yang fetch data async
8	Error state ditangani	Pesan error human-readable dalam Bahasa Indonesia
9	TypeScript strict — no any	Semua tipe didefinisikan di types/index.ts
10	Responsive di mobile	Test di viewport 375px (iPhone SE) dan 768px (tablet)

Dokumen ini bersifat internal dan confidential   •   Dompetku PRD + Alur Kerja v1.2   •   Maret 2026
