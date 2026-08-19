# Super Brutalist Portfolio

Portfolio Next.js untuk **Malik Fajar** — AI Engineer, Fullstack Developer, Creative Technologist yang berbasis di Indonesia.

Desain **brutalist**: hard borders, typographic scale, zero shadow, zero radius. Dibangun di atas Next.js 16, TypeScript, Tailwind CSS 4, GSAP + Framer Motion, dan Lenis (smooth scroll).

> **Catatan:** Nama repo ini adalah `porto-opus5`, tapi package.json memberi nama `super-brutalist-portfolio`. Ini adalah portfolio pribadi.

---

## Prerequisites

| Tool   | Versi minimal |
|--------|---------------|
| Node.js | 18.18+ (disarankan 20+) |
| pnpm / npm | pnpm 9+ (disarankan) |

> Project ini memakai Node.js 20+ dan Next.js 16. Pastikan versi Node.js yang terpasang mendukungnya.

---

## Setup Commands

```bash
# 1. Clone repository
git clone https://github.com/Malikkun09/porto-opus5.git
cd porto-opus5

# 2. Install dependencies (gunakan pnpm bila tersedia)
pnpm install
# atau
npm install

# 3. Jalankan development server
pnpm dev
# atau
npm run dev
```

### Skrip yang tersedia

| Skrip | Perintah | Deskripsi |
|-------|----------|-----------|
| Dev | `pnpm dev` | Jalankan dev server di `http://localhost:3000` |
| Build | `pnpm build` | Production build |
| Start | `pnpm start` | Jalankan server produksi |
| Lint | `pnpm lint` | Jalankan ESLint |
| Check | `pnpm check` | Type-check dengan TypeScript (strip-types) |
| Verify | `pnpm verify` | Jalankan verifikasi tambahan |

---

## Verification

Setelah dev server berjalan, buka `http://localhost:3000` di browser. Halaman portfolio akan tampil dengan:

- Hero section dengan teks animasi ("I BUILD DIGITAL SYSTEMS, INTERFACES, AND EXPERIENCES")
- Navigasi brutalist dengan nomor urut (001–008)
- Smooth scroll melalui Lenis
- Dark / light theme toggle (persist di localStorage)

### Type-check

```bash
pnpm check
```

Harus keluar tanpa error. Jika ada error, jalankan:

```bash
pnpm install  # pastikan semua dependency terpasang
```

---

## Troubleshooting

### `Error: `next/font` used in a React Server Component`

Pastikan komponen yang memakai font berada di file `.tsx` dengan `"use client"` di bagian atas bila menggunakan client hooks.

### Module not found: `gsap` / `framer-motion` / `lenis`

```bash
rm -rf node_modules pnpm-lock.yaml  # atau package-lock.json
pnpm install
```

### Port 3000 already in use

```bash
# Temukan dan kill proses di port 3000
lsof -i :3000
kill -9 $(lsof -ti :3000)
```

### Build gagal karena TypeScript error

```bash
pnpm check  # lihat error TypeScript
pnpm lint   # lihat error ESLint
```

Perbaiki semua error sebelum push / deploy.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animasi:** GSAP 3, Framer Motion 13
- **Smooth Scroll:** Lenis
- **Ikon:** Lucide React
- **Linting:** ESLint 9
- **Deploy target:** Vercel (opsional)

---

## Struktur Proyek

```
src/
├── app/                    # Next.js App Router
├── components/             # React components (grouped by domain)
│   ├── about/
│   ├── hero/
│   ├── layout/
│   ├── navigation/
│   ├── projects/
│   ├── skills/
│   ├── shared/
│   └── lab/
├── animations/             # GSAP utility hooks (gsap.ts, text.ts)
├── data/                   # Konten statis (projects, site config, stack, timeline)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries (constants, cursor, pointer, theme)
├── types/                  # TypeScript type definitions
└── styles/                 # Global CSS
```

---

## Data Proyek

Semua konten portfolio didefinisikan di `src/data/`:

| File | Deskripsi |
|------|-----------|
| `site.ts` | Nama, role, social links, navigasi sections |
| `projects.ts` | Daftar proyek (Kerjain, Sentra, Atlas Vision, Voidgrid, Warungos, Monolith, Signalpath) |
| `stack.ts` | Teknologi yang digunakan |
| `timeline.ts` | Timeline pengalaman kerja |

---

## Environment Variables

Project ini tidak memerlukan environment variables khusus untuk development. Jika ada file `.env.local`, salin dari `.env.example` (jika ada).

> Saat ini, semua konfigurasi disimpan hardcode di `src/data/site.ts`.

---

## Deploy

Deploy ke **Vercel** dengan satu klik:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMalikkun09%2Fporto-opus5.git)

Atau build lokal untuk produksi:

```bash
pnpm build
pnpm start
```

---

## Final Checklist

- [ ] `pnpm install` berhasil tanpa error
- [ ] `pnpm dev` dapat diakses di `http://localhost:3000`
- [ ] `pnpm check` lulus tanpa TypeScript error
- [ ] `pnpm lint` lulus tanpa error
- [ ] `pnpm build` berhasil
- [ ] Repository terhubung ke remote GitHub: `git remote -v`
- [ ] `.gitignore` meng-ekspose build artifacts (`/.next/`, `node_modules`, `*.tsbuildinfo`)

---

## Credits

- Desainer & developer: **Malik Fajar** — [malikfajar.dev](https://malikfajar.dev) | [GitHub](https://github.com/malikfajar) | [LinkedIn](https://linkedin.com/in/malikfajar)
- Ikon: [Lucide](https://lucide.dev)
- Font: [Inter](https://rsms.me/inter/) (atau font sistem default)
- Deploy: [Vercel](https://vercel.com)
