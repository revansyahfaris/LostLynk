# 🔗 LOSTLYNK

**Live Demo:** [lost-lynk.vercel.app](https://lost-lynk.vercel.app/)

**LostLynk** adalah platform logistik terpadu untuk pelaporan dan pelacakan barang hilang/temuan di lingkungan Universitas Diponegoro (UNDIP). Aplikasi ini dirancang untuk menghubungkan mahasiswa dan administrator laboratorium/gedung dalam satu ekosistem yang transparan, efisien, dan terverifikasi.

---

## ✨ Fitur Utama

### 🎓 Bagi Mahasiswa
- **Pendaftaran Terverifikasi:** Keamanan akun menggunakan bukti identitas ganda (NIM & Email Institusi).
- **Pelaporan Real-Time:** Unggah penemuan atau kehilangan barang dengan kewajiban dokumentasi foto untuk validasi.
- **Galeri Logistik:** Telusuri database barang yang ditemukan atau hilang dengan fitur pencarian dan filter lokasi yang cerdas.
- **Sistem Klaim Mandiri:** Ajukan bukti kepemilikan langsung melalui platform untuk barang yang ditemukan oleh orang lain.
- **Riwayat Aktivitas:** Pantau tahapan logistik barang Anda (Dilaporkan → Diverifikasi → Di Loket → Selesai).
- **Profil Personal:** Dashboard statistik pribadi untuk memantau kontribusi laporan Anda.

### 🛡️ Bagi Administrator (Otoritas Laboran)
- **Pusat Kendali Logistik:** Manajemen seluruh laporan masuk dalam satu dashboard terintegrasi.
- **Kendali Tahapan Fisik:** Otorisasi pembaruan status barang dari tahap laporan hingga siap diambil di loket.
- **Moderasi Klaim:** Verifikasi bukti kepemilikan yang diajukan mahasiswa sebelum memberikan izin pengambilan barang.
- **Arsip Digital:** Sistem pencatatan otomatis untuk setiap barang yang telah sukses diserahterimakan.

---

## 🎨 UI/UX Modern & Profesional
Aplikasi ini telah diperbarui dengan standar desain industri terkini:
- **Clean Interface:** Antarmuka bersih dengan palet warna biru aksen LostLynk yang menenangkan dan profesional.
- **Iconography:** Menggunakan library `lucide-react` untuk elemen visual yang elegan dan informatif.
- **Fully Responsive:** Layout fleksibel yang optimal baik di desktop maupun perangkat mobile.
- **Interactive Feedback:** Animasi halus, indikator loading, dan modal detail yang memanjakan mata.

---

## 🛠️ Tech Stack

- **Frontend:** [React.js](https://reactjs.org/) (Vite)
- **Styling:** Vanilla CSS Modern (Custom Properties, Flexbox, & Grid)
- **Backend-as-a-Service:** [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React Hooks (useState, useEffect)

---

## 🚀 Cara Menjalankan Lokal

1. **Clone Repositori:**
   ```bash
   git clone https://github.com/revansyahfaris/LostLynk.git
   cd lostlynk
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Buat file `.env` di root folder dan tambahkan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Jalankan Aplikasi:**
   ```bash
   npm run dev
   ```

---

## 📄 Lisensi
Proyek ini dikembangkan untuk kebutuhan tugas mata kuliah rekayasa perangkat lunak.

---
*Dibuat dengan ❤️ untuk UNDIP yang lebih tertata.*
