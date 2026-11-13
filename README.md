# Ambeverages — "I Am Beverages."

Aplikasi web pemesanan dan katalog minuman artisanal modern dengan sistem checkout langsung via WhatsApp resmi, serta panel admin lengkap untuk mengelola menu, stok fisik, dan pesanan pelanggan.

---

## Tech Stack

- **Backend:** Laravel 11/13 (PHP 8.3)
- **Frontend:** React 19, Inertia.js, Lucide Icons, Framer Motion
- **Styling:** Tailwind CSS v4 (Modern Theme, Dark/Light Mode, Mobile Responsive)
- **Database:** SQLite (Lokal/Development) & PostgreSQL (Produksi / Render)
- **Web Server:** Nginx + PHP-FPM 8.3 (Docker Multi-Stage Build)

---

## Panduan Instalasi Lokal

### 1. Clone & Setup Dependensi
```bash
git clone <url-repo-anda>
cd MKWU-WebApp

# Salin file konfigurasi environment
cp .env.example .env

# Pasang dependensi PHP & JavaScript
composer install
npm install
```

### 2. Konfigurasi Kunci & Database
```bash
# Buat application encryption key
php artisan key:generate

# Jalankan migrasi dan seeder akun admin awal
php artisan migrate --seed

# Hubungkan direktori storage untuk upload gambar minuman
php artisan storage:link
```

### 3. Menjalankan Server Lokal
Jalankan di dua terminal terpisah:
```bash
# Terminal 1: Vite bundler
npm run dev

# Terminal 2: Server Laravel
php artisan serve
```
Akses aplikasi melalui browser:
- **Katalog Pelanggan:** `http://localhost:8000`
- **Admin Dashboard:** `http://localhost:8000/login`
  - Email: `admin@example.com`
  - Password: `password`

---

## Panduan Lengkap Deploy ke Render

Aplikasi ini sudah dilengkapi dengan konfigurasi Docker multi-stage produksi ([Dockerfile](Dockerfile)), Nginx ([docker/nginx.conf](docker/nginx.conf)), dan skrip startup otomatis ([docker/entrypoint.sh](docker/entrypoint.sh)) sehingga proses deploy di Render berjalan secara otomatis tanpa perlu setup server manual.

### Persiapan Awal
1. Pastikan seluruh perubahan kode telah di-commit dan di-push ke repository GitHub Anda:
   ```bash
   git add .
   git commit -m "feat: ready for render deployment"
   git push origin master
   ```
2. Buat string `APP_KEY` untuk enkripsi produksi dengan menjalankan perintah ini di terminal lokal Anda:
   ```bash
   php artisan key:generate --show
   ```
   *(Salin teks yang dihasilkan, contoh: `base64:J1wRt6X5YQY984//qTHdYdooh2NN4yNoPKcEIE6HEJA=`)*

---

### Metode 1: Deploy Otomatis via Render Blueprint (Direkomendasikan)

Proyek ini telah memiliki file `render.yaml`. Anda dapat menggunakannya untuk konfigurasi instan:
1. Masuk ke [Dashboard Render](https://dashboard.render.com).
2. Klik tombol **New +** di pojok kanan atas, lalu pilih **Blueprint**.
3. Pilih repository GitHub Anda.
4. Render akan otomatis membaca file `render.yaml`, menyiapkan service Docker, dan mengonfigurasi environment variables yang diperlukan.
5. Lengkapi nilai rahasia seperti `APP_KEY`, lalu klik **Apply**.

---

### Metode 2: Deploy Manual Web Service via Dashboard Render

Jika ingin mengatur secara mandiri melalui antarmuka web Render:

1. Buka [Dashboard Render](https://dashboard.render.com).
2. Klik **New +** -> pilih **Web Service**.
3. Hubungkan repository GitHub Anda.
4. Masukkan konfigurasi dasar:
   - **Name:** `ambeverages` *(atau nama lain pilihan Anda)*
   - **Region:** `Singapore` *(pilihan terdekat dengan pengguna Indonesia)*
   - **Branch:** `master`
   - **Runtime:** Pilih **Docker** *(Render akan otomatis mendeteksi file Dockerfile di direktori utama)*
   - **Instance Type:** Pilih `Free` *(atau tier berbayar jika butuh performa lebih)*

5. **Pengaturan Environment Variables:**
   Buka tab **Environment** dan tambahkan baris berikut:

   | Key | Value Contoh / Keterangan |
   |---|---|
   | `APP_NAME` | `Ambeverages` |
   | `APP_ENV` | `production` |
   | `APP_DEBUG` | `false` |
   | `APP_KEY` | *Tempel hasil dari `php artisan key:generate --show`* |
   | `APP_URL` | `https://ambeverages.onrender.com` *(sesuaikan dengan domain render Anda)* |
   | `WHATSAPP_ADMIN_NUMBER` | `6289620378128` *(nomor WhatsApp admin pemrosesan order)* |
   | `ADMIN_NAME` | `Admin Ambeverages` *(nama admin di seeder)* |
   | `ADMIN_EMAIL` | `admin@example.com` *(email login admin)* |
   | `ADMIN_PASSWORD` | `password_rahasia_anda` *(password baru admin untuk produksi)* |
   | `FILESYSTEM_DISK` | `public` |
   | `SESSION_DRIVER` | `database` |
   | `CACHE_STORE` | `database` |
   | `QUEUE_CONNECTION` | `database` |

6. **Pengaturan Health Check (Opsional):**
   Di bagian **Advanced** -> **Health Check Path**, isi dengan:
   ```text
   /up
   ```
   *(Laravel 11+ menyediakan endpoint diagnostik ini secara bawaan)*

7. Klik tombol **Deploy Web Service**.

---

### Konfigurasi Database untuk Produksi

#### Opsi A: SQLite (Bawaan)
- Docker container sudah dikonfigurasi untuk otomatis membuat file `/var/www/html/database/database.sqlite`.
- *Catatan:* Pada paket Free Web Service Render, media penyimpanan bersifat sementara (*ephemeral*). Data akan ter-reset saat instance di-redeploy atau restart.

#### Opsi B: PostgreSQL di Render (Disarankan untuk Data Permanen)
1. Di Dashboard Render, klik **New +** -> pilih **PostgreSQL**.
2. Beri nama database, misal `ambeverages-db`, lalu klik **Create Database**.
3. Setelah aktif, salin nilai **Internal Database URL** yang disediakan Render (berformat `postgres://user:password@hostname:5432/dbname`).
4. Buka kembali Web Service `ambeverages`, masuk ke tab **Environment**, dan tambahkan:
   - `DB_CONNECTION`: `pgsql`
   - `DATABASE_URL`: *(tempel Internal Database URL tadi)*
5. Saat aplikasi me-restart, Laravel otomatis mengalihkan koneksi ke PostgreSQL dan menjalankan seluruh migrasi serta seeder akun admin secara otomatis.

---

### Cara Otomatisasi Bekerja di Render

1. **Otomatisasi Build:**
   Docker multi-stage secara otomatis mengunduh dependensi Node.js, menjalankan `npm run build` untuk mengompilasi bundel React dan CSS Tailwind v4, lalu menyalin hasilnya ke container PHP 8.3 FPM + Nginx.
2. **Otomatisasi Database & Akun Admin:**
   File `docker/entrypoint.sh` secara otomatis mengeksekusi `php artisan migrate --force --seed` setiap kali container dinyalakan. Akun admin dengan data dari `ADMIN_EMAIL` dan `ADMIN_PASSWORD` langsung tercipta dan siap dipakai untuk login tanpa perlu akses terminal SSH.
3. **Otomatisasi Nomor WhatsApp:**
   Nomor telepon tujuan pesan order pelanggan diambil langsung dari variabel `WHATSAPP_ADMIN_NUMBER`. Untuk mengganti nomor admin di masa depan, cukup perbarui variabel tersebut di dashboard Render tanpa perlu menyentuh kode.

---

## Lisensi

Proyek ini dirilis di bawah lisensi [MIT](LICENSE).
