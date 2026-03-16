# 🚀 Berkala - Personal Productivity & Finance Dashboard

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Berkala adalah aplikasi SaaS (Software as a Service) *full-stack* modern yang dirancang sebagai "Pusat Komando" produktivitas personal. Aplikasi ini menggabungkan manajemen tugas, pelacakan kebiasaan (habit), dan arus kas keuangan dalam satu antarmuka *Dark Glassmorphism* yang elegan dan responsif.

## ✨ Fitur Utama

* **🔐 Autentikasi JWT Aman:** Sistem login dan registrasi terenkripsi dengan *role-based user profile*.
* **📊 Command Center Dashboard:** Ringkasan *real-time* yang menarik data dari seluruh modul secara paralel.
* **✅ Smart Todo List:** Manajemen tugas harian dengan *optimistic UI update* dan *progress bar* otomatis.
* **🔥 Habit Tracker:** Bangun rutinitas positif dengan sistem pelacakan *streak* dan kalender aktivitas.
* **💰 Manajemen Arus Kas:** Catat pemasukan, pengeluaran, dan pantau target tabungan (celengan) secara dinamis.
* **📱 Fully Responsive:** Pengalaman *native-like* dengan *Bottom Navigation Bar* untuk *mobile* dan *Sidebar* mewah untuk *desktop*.

## 🏗️ Arsitektur Monorepo

Proyek ini menggunakan struktur monorepo yang menggabungkan *frontend* dan *backend* dalam satu *repository*, disiapkan untuk *deployment* menggunakan Docker.

```text
berkala-app/
├── backend/            # Express.js, REST API, Prisma ORM
├── frontend/           # Next.js 14, Tailwind CSS, Lucide Icons
├── docker-compose.yml  # Konfigurasi containerisasi
└── README.md

🚀 Cara Menjalankan di Localhost
Pastikan kamu sudah menginstal Node.js, PostgreSQL, dan (opsional) Docker di komputermu.

1. Kloning Repository
Bash
git clone [https://github.com/username-kamu/berkala-app.git](https://github.com/username-kamu/berkala-app.git)
cd berkala-app
2. Setup Backend (API & Database)
Bash
cd backend
npm install

# Buat file .env dan isi variabel environment (PORT, DATABASE_URL, JWT_SECRET)
# Lakukan migrasi database Prisma
npx prisma migrate dev --name init

# Jalankan server
npm run dev
3. Setup Frontend (Client)
Buka terminal baru, lalu jalankan:

Bash
cd frontend
npm install

# Jalankan aplikasi Next.js
npm run dev
Aplikasi sekarang dapat diakses melalui http://localhost:3000.

👨‍💻 Dikembangkan Oleh
Atio - Full Stack Developer

Dibuat dengan ☕ dan dedikasi penuh untuk produktivitas yang lebih baik.


---