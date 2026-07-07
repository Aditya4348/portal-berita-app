# Task Backend Laravel — Nusa Warta

Dokumen ini menjadi roadmap pengembangan backend Laravel untuk MVP Nusa Warta. Kerjakan fase secara berurutan karena setiap fase menjadi fondasi fase berikutnya.

## Target MVP

Alur backend yang harus selesai:

1. Pengguna mendaftar dan login dari aplikasi.
2. Pengguna membuat topik berita.
3. Sistem menyimpan sumber berita untuk topik tersebut.
4. Scraper mengirim artikel ke endpoint internal Laravel.
5. Laravel menyimpan artikel dan menjalankan pemrosesan AI melalui queue.
6. Pengguna menerima feed personal, membuka detail, menyimpan artikel, dan bertanya kepada AI.

## Definition of Done Umum

Sebuah task dianggap selesai jika:

- [ ] Implementasi memiliki validasi request dan authorization.
- [ ] Response API konsisten menggunakan JSON:API yang sudah dipakai proyek.
- [ ] Skenario sukses, validasi gagal, unauthenticated, dan forbidden memiliki feature test.
- [ ] Pekerjaan lolos `php artisan test`.
- [ ] Pekerjaan lolos pemeriksaan format `vendor/bin/pint --test`.
- [ ] Variabel environment baru didokumentasikan di `BACKEND/.env.example` tanpa secret asli.

---

## Fase 0 — Kontrak dan Fondasi API

### BE-001 — Tetapkan kontrak API MVP

- [ ✅✅ ] Tentukan prefix versi API, misalnya `/api/v1`.
- [x] Tetapkan struktur response sukses, pagination, validation error, dan application error.
- [x] Tetapkan format tanggal ISO 8601 dan timezone penyimpanan UTC.
- [x] Tetapkan daftar status untuk topik dan pemrosesan artikel.
- [x] Dokumentasikan endpoint, request, response, dan error code dalam `BACKEND/docs/api.md`.

**Acceptance criteria:** Aplikasi mobile dan scraper dapat menggunakan kontrak tanpa membaca implementasi Laravel.

### BE-002 — Siapkan konfigurasi backend

- [ ] Ubah identitas aplikasi dan locale default menjadi sesuai Nusa Warta/Indonesia.
- [ ] Pastikan database, cache, dan queue dapat dijalankan pada environment lokal.
- [ ] Tambahkan konfigurasi CORS untuk aplikasi Expo/web yang diizinkan.
- [ ] Tambahkan endpoint health check yang memeriksa aplikasi, database, dan queue secara aman.
- [ ] Buat panduan setup backend di `BACKEND/README.md`.

**Acceptance criteria:** Developer baru dapat menyalakan backend dan menjalankan migrasi/test hanya dari dokumentasi.

---

## Fase 1 — Autentikasi dan Akun

### BE-101 — Implementasi autentikasi API

- [ ] Pasang dan konfigurasi Laravel Sanctum untuk token aplikasi mobile.
- [ ] Buat endpoint register.
- [ ] Buat endpoint login.
- [ ] Buat endpoint mendapatkan profil pengguna saat ini.
- [ ] Buat endpoint logout/revoke token aktif.
- [ ] Tambahkan rate limit pada register dan login.
- [ ] Gunakan response generik agar login tidak membocorkan keberadaan email.

**Acceptance criteria:** Pengguna dapat register, login, mengakses endpoint terproteksi dengan Bearer token, lalu logout.

### BE-102 — Kelola profil dan preferensi

- [ ] Buat tabel/model preferensi pengguna.
- [ ] Simpan pilihan suara pembaca, bahasa, timezone, dan preferensi notifikasi.
- [ ] Buat endpoint melihat dan memperbarui profil/preferensi.
- [ ] Batasi field yang dapat diubah pengguna.

**Acceptance criteria:** Setiap pengguna hanya dapat membaca dan mengubah profilnya sendiri.

---

## Fase 2 — Topik dan Sumber Berita

### BE-201 — Lengkapi pengelolaan topik

- [ ] Pertahankan endpoint membuat topik yang sudah ada.
- [ ] Buat endpoint daftar, detail, edit, dan hapus topik milik pengguna.
- [ ] Cegah duplikasi topik yang identik untuk pengguna yang sama.
- [ ] Terapkan policy agar pengguna hanya mengakses topiknya sendiri.
- [ ] Tambahkan batas jumlah topik aktif per pengguna melalui konfigurasi.
- [ ] Catat alasan kegagalan ketika status topik menjadi `failed`.

**Acceptance criteria:** CRUD topik lengkap, terisolasi per pengguna, dan seluruh perubahan status dapat dijelaskan.

### BE-202 — Kelola sumber berita

- [ ] Buat endpoint internal/admin untuk menambah dan mengelola sumber sebuah topik.
- [ ] Normalisasi dan validasi URL sumber.
- [ ] Tambahkan status aktif, waktu scraping terakhir, waktu scraping berikutnya, dan informasi kegagalan terakhir.
- [ ] Cegah URL sumber duplikat dalam satu topik.
- [ ] Tambahkan allowlist domain atau proses persetujuan sumber.

**Acceptance criteria:** Sistem mengetahui sumber mana yang aktif, kapan harus diambil, dan mengapa pengambilan terakhir gagal.

---

## Fase 3 — Integrasi Scraper dan Artikel

### BE-301 — Buat autentikasi service-to-service

- [ ] Tentukan mekanisme token internal untuk scraper.
- [ ] Simpan token dalam environment dengan bentuk hash jika disimpan di database.
- [ ] Buat middleware autentikasi khusus endpoint internal.
- [ ] Tambahkan rate limit, audit log, dan rotasi token.

**Acceptance criteria:** Endpoint internal menolak request tanpa token atau token yang salah dan tidak dapat diakses memakai token pengguna biasa.

### BE-302 — Buat endpoint penerimaan artikel dari scraper

- [ ] Buat route `POST /api/internal/articles` dan sesuaikan URL pada kontrak scraper.
- [ ] Tetapkan payload yang menyertakan identitas sumber, judul, isi artikel, URL asli, gambar, dan tanggal publikasi.
- [ ] Validasi bahwa sumber terdaftar dan aktif.
- [ ] Gunakan `original_url` atau fingerprint konten sebagai idempotency key.
- [ ] Simpan konten artikel asli yang saat ini belum ada pada tabel `articles`.
- [ ] Gunakan transaction untuk penyimpanan dan dispatch job.
- [ ] Kembalikan hasil `created`, `duplicate`, atau `updated` secara konsisten.

**Acceptance criteria:** Pengiriman payload yang sama berulang kali tidak membuat artikel duplikat.

### BE-303 — Lengkapi skema dan lifecycle artikel

- [ ] Tambahkan field konten asli, excerpt, author, language, dan status pemrosesan.
- [ ] Tambahkan field error pemrosesan dan timestamps untuk scraped/summarized/audio processed.
- [ ] Definisikan status, misalnya `received`, `processing`, `ready`, dan `failed`.
- [ ] Tambahkan index database untuk feed, deduplikasi, status, dan jadwal pemrosesan.
- [ ] Pastikan artikel belum siap tidak muncul pada feed pengguna.

**Acceptance criteria:** Setiap artikel memiliki status yang jelas dan dapat diproses ulang tanpa merusak data.

### BE-304 — Penjadwalan scraping

- [ ] Buat scheduled command untuk memilih sumber yang waktunya perlu di-scrape.
- [ ] Dispatch job pemanggilan scraper per sumber.
- [ ] Tambahkan timeout, retry dengan backoff, dan batas percobaan.
- [ ] Gunakan lock agar satu sumber tidak diproses bersamaan.
- [ ] Simpan metrik keberhasilan/kegagalan dan jadwal berikutnya.

**Acceptance criteria:** Scheduler aman dijalankan lebih dari sekali dan kegagalan satu sumber tidak menghentikan sumber lain.

---

## Fase 4 — Pipeline AI

### BE-401 — Buat abstraksi penyedia AI

- [ ] Buat interface layanan AI agar provider dapat diganti.
- [ ] Simpan model, timeout, token limit, dan prompt version dalam konfigurasi.
- [ ] Buat fake provider untuk automated test.
- [ ] Jangan menyimpan API key dalam source control atau log.

**Acceptance criteria:** Business logic tidak bergantung langsung pada SDK provider tertentu.

### BE-402 — Job rangkuman artikel

- [ ] Buat job queue untuk membersihkan dan merangkum artikel.
- [ ] Tentukan format output terstruktur: ringkasan, poin utama, kategori, dan estimasi waktu baca.
- [ ] Validasi output AI sebelum disimpan.
- [ ] Simpan versi prompt/model yang menghasilkan rangkuman.
- [ ] Tambahkan retry, failed-job handling, dan endpoint/admin command untuk reprocess.
- [ ] Hindari mengirim artikel ke AI jika kontennya kosong atau tidak memenuhi kualitas minimum.

**Acceptance criteria:** Artikel valid berubah dari `received` menjadi `ready`; kegagalan berubah menjadi `failed` dengan alasan yang dapat diperiksa.

### BE-403 — Jawaban AI berbasis artikel

- [ ] Pastikan pengguna berhak mengakses artikel sebelum bertanya.
- [ ] Simpan pertanyaan pengguna yang sudah ada.
- [ ] Buat job/service untuk menghasilkan jawaban hanya berdasarkan isi artikel dan riwayat relevan.
- [ ] Simpan jawaban dengan `sender_type = ai`.
- [ ] Berikan respons aman ketika jawaban tidak tersedia dalam artikel.
- [ ] Batasi panjang percakapan, frekuensi request, dan biaya penggunaan per pengguna.
- [ ] Buat endpoint daftar riwayat percakapan per artikel.

**Acceptance criteria:** Pertanyaan menghasilkan jawaban tersimpan, dapat dimuat ulang, dan tidak mengambil konteks artikel pengguna lain.

### BE-404 — Audio artikel

- [ ] Buat abstraksi layanan text-to-speech.
- [ ] Buat job pembuatan audio setelah rangkuman siap.
- [ ] Simpan file pada storage yang dikonfigurasi, bukan langsung di database.
- [ ] Simpan durasi, voice, status, dan URL audio.
- [ ] Gunakan signed URL jika file tidak bersifat publik.
- [ ] Tambahkan proses penghapusan file saat artikel dihapus atau dibuat ulang.

**Acceptance criteria:** Artikel siap dapat memiliki audio yang aman diakses pengguna berhak tanpa memblokir request API utama.

---

## Fase 5 — Feed, Bookmark, dan Personalisasi

### BE-501 — Sempurnakan feed personal

- [ ] Tampilkan hanya artikel `ready` dari topik pengguna aktif.
- [ ] Eager-load relasi yang diperlukan untuk mencegah N+1 query.
- [ ] Gunakan cursor pagination untuk feed kronologis.
- [ ] Tambahkan filter topik, sumber, tanggal, dan kata kunci.
- [ ] Hilangkan artikel duplikat yang muncul dari beberapa topik pengguna.
- [ ] Sertakan informasi sumber dan topik pada resource artikel.

**Acceptance criteria:** Feed pengguna tidak memuat artikel pengguna lain, tidak memiliki duplikasi, dan tetap cepat pada dataset besar.

### BE-502 — Amankan detail artikel

- [ ] Buat ArticlePolicy.
- [ ] Terapkan policy pada endpoint detail dan chat artikel.
- [ ] Hindari membocorkan artikel terlarang melalui perbedaan response yang tidak perlu.
- [ ] Tambahkan endpoint membuka URL sumber asli jika diperlukan untuk tracking.

**Acceptance criteria:** Mengganti ID artikel pada URL tidak memberi akses ke artikel di luar feed pengguna.

### BE-503 — Implementasi bookmark

- [ ] Buat migration/model bookmark dengan unique constraint pengguna + artikel.
- [ ] Buat endpoint menyimpan dan menghapus bookmark secara idempotent.
- [ ] Buat endpoint daftar bookmark dengan pagination.
- [ ] Sertakan status bookmark pada response feed/detail.

**Acceptance criteria:** Pengguna dapat menyimpan artikel sekali, menghapusnya, dan melihat koleksinya sendiri.

### BE-504 — Riwayat baca dan rekomendasi dasar

- [ ] Buat pencatatan artikel dilihat/dibaca tanpa menghasilkan event duplikat berlebihan.
- [ ] Simpan progress atau waktu baca jika dibutuhkan aplikasi.
- [ ] Gunakan interaksi pengguna untuk pengurutan sederhana tanpa membuat sistem rekomendasi kompleks terlebih dahulu.

**Acceptance criteria:** Backend dapat menjelaskan sinyal dasar yang digunakan untuk mengurutkan feed.

---

## Fase 6 — Keamanan dan Operasional

### BE-601 — Hardening API

- [ ] Terapkan authorization policy pada seluruh resource milik pengguna.
- [ ] Terapkan rate limit berbeda untuk auth, feed, topik, chat AI, dan endpoint internal.
- [ ] Sanitasi log agar token, password, API key, dan isi sensitif tidak tercatat.
- [ ] Validasi URL dan blokir alamat private, loopback, link-local, serta redirect berbahaya.
- [ ] Batasi ukuran payload artikel dan pesan chat.
- [ ] Tambahkan security headers yang relevan.
- [ ] Audit mass assignment dan serialization seluruh model/resource.

**Acceptance criteria:** Checklist ancaman utama—IDOR, SSRF, brute force, abuse AI, secret leakage, dan payload flooding—memiliki mitigasi dan test.

### BE-602 — Observability dan audit

- [ ] Gunakan structured logging dengan request/correlation ID.
- [ ] Catat audit event untuk login, perubahan topik, token internal, dan pemrosesan ulang artikel.
- [ ] Tambahkan monitoring queue depth, failed jobs, latensi AI, dan kegagalan scraper.
- [ ] Buat command atau halaman admin minimal untuk memeriksa dan retry failed jobs.
- [ ] Tentukan retention policy untuk log dan audit data.

**Acceptance criteria:** Penyebab artikel gagal muncul di feed dapat ditelusuri dari request scraper sampai job AI.

### BE-603 — Backup dan retensi data

- [ ] Tetapkan strategi backup database dan storage audio.
- [ ] Uji proses restore, bukan hanya proses backup.
- [ ] Tentukan masa simpan artikel, chat, log, dan failed jobs.
- [ ] Buat proses penghapusan akun beserta data terkait.

**Acceptance criteria:** Restore berhasil diuji dan penghapusan akun tidak meninggalkan data pribadi yang tidak diperlukan.

---

## Fase 7 — Quality Gate dan Release

### BE-701 — Lengkapi automated test

- [ ] Unit test untuk normalisasi URL, deduplikasi, status transition, dan layanan AI.
- [ ] Feature test untuk auth, topik, feed, detail, bookmark, chat, dan endpoint internal.
- [ ] Queue test untuk sukses, retry, timeout, dan permanent failure.
- [ ] Test isolasi data antara dua pengguna.
- [ ] Test database constraint dan idempotency.

**Acceptance criteria:** Jalur kritis MVP memiliki test dan tidak bergantung pada layanan AI/scraper sungguhan.

### BE-702 — Seed dan data lokal

- [ ] Buat factory untuk topik, sumber, artikel, chat, preferensi, dan bookmark.
- [ ] Buat development seeder dengan beberapa pengguna dan feed realistis.
- [ ] Pastikan seeder tidak pernah membuat credential production.

**Acceptance criteria:** Satu perintah menghasilkan data lokal yang cukup untuk pengembangan aplikasi mobile.

### BE-703 — Dokumentasi dan release checklist

- [ ] Dokumentasikan setup, migration, queue worker, scheduler, storage, dan environment.
- [ ] Dokumentasikan cara mendapatkan token dan mencoba endpoint utama.
- [ ] Tambahkan contoh payload integrasi scraper.
- [ ] Buat checklist deploy: config cache, migration, queue restart, scheduler, storage link, backup, dan rollback.
- [ ] Catat keputusan teknis penting dalam ADR singkat.

**Acceptance criteria:** Backend dapat dipasang pada environment baru tanpa pengetahuan lisan dari pembuat awal.

---

## Urutan Sprint yang Disarankan

### Sprint 1 — API dapat dipakai aplikasi

- [ ] BE-001, BE-002
- [ ] BE-101, BE-102
- [ ] BE-201

### Sprint 2 — Artikel masuk dan tampil

- [ ] BE-202
- [ ] BE-301, BE-302, BE-303
- [ ] BE-501, BE-502

### Sprint 3 — Kecerdasan produk

- [ ] BE-304
- [ ] BE-401, BE-402, BE-403
- [ ] BE-503

### Sprint 4 — Audio dan kesiapan produksi

- [ ] BE-404, BE-504
- [ ] BE-601, BE-602, BE-603
- [ ] BE-701, BE-702, BE-703

## Batasan MVP

Hal berikut tidak menjadi prioritas sampai alur utama stabil:

- Panel CMS/redaksi lengkap.
- Rekomendasi berbasis machine learning yang kompleks.
- Komentar sosial antarpengguna.
- Paket langganan dan pembayaran.
- Analitik bisnis tingkat lanjut.
- Pencarian web bebas tanpa daftar sumber yang dikendalikan.
