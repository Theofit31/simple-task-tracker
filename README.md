# Simple Task Tracker

Simple Task Tracker adalah aplikasi pengelolaan tugas berbasis web yang memungkinkan pengguna untuk membuat, melihat, mengubah, dan menghapus tugas. Aplikasi ini dikembangkan sebagai bagian dari Technical Test Full-Stack Developer Intern menggunakan FastAPI, PostgreSQL, React, dan TypeScript.

## 1. Fitur Utama

- **Melihat Tugas:** Menampilkan seluruh tugas yang tersimpan di database.
- **Menambahkan Tugas:** Membuat tugas baru dengan judul, deskripsi, dan status.
- **Mengubah Tugas:** Mengedit informasi tugas yang sudah ada.
- **Menghapus Tugas:** Menghapus tugas dari daftar.
- **Mengubah Status:** Memperbarui status pengerjaan tugas.
- **Validasi Input:** Memastikan judul wajib diisi dan status sesuai dengan pilihan yang tersedia.
- **Dashboard:** Menampilkan ringkasan jumlah tugas berdasarkan status pengerjaan.
- **Responsive Design:** Menyesuaikan tampilan dengan ukuran layar perangkat.

## 2. Teknologi yang Digunakan

| Bagian | Teknologi |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Validasi Data | Pydantic |
| HTTP Communication | Fetch API |
| Ikon | Lucide React |
| Environment Configuration | Python dotenv dan Vite Environment Variables |

## 3. Struktur Proyek

```text
simple-task-tracker/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   │
│   ├── .env.example
│   ├── .gitignore
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

## 4. Persyaratan

Pastikan perangkat telah memiliki perangkat lunak berikut:

- Python 3.12
- Node.js dan npm dengan versi yang kompatibel dengan proyek Vite.
- PostgreSQL
- Git

## 5. Mengunduh Proyek

Clone repository dari GitHub:

```bash
git clone https://github.com/Theofit31/simple-task-tracker.git
```

Masuk ke direktori proyek:

```bash
cd simple-task-tracker
```

## 6. Konfigurasi Database

Aplikasi menggunakan PostgreSQL sebagai database.

### Langkah 1: Membuat Database

Jalankan perintah berikut melalui pgAdmin atau PostgreSQL command line:

```sql
CREATE DATABASE task_tracker;
```

### Langkah 2: Konfigurasi Environment Variable Backend

Masuk ke direktori `backend` dan salin file `.env.example` menjadi `.env`.

```env
DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/task_tracker
```

Ganti `YOUR_PASSWORD` dengan password PostgreSQL yang digunakan.

Pastikan host, port, username, password, dan nama database sudah sesuai dengan konfigurasi PostgreSQL pada perangkat.

## 7. Menjalankan Backend

Buka terminal dan masuk ke direktori backend:

```bash
cd backend
```

### Langkah 1: Membuat Virtual Environment

```bash
python -m venv venv
```

### Langkah 2: Mengaktifkan Virtual Environment

Untuk Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Untuk Git Bash pada Windows:

```bash
source venv/Scripts/activate
```

Untuk Linux atau macOS:

```bash
source venv/bin/activate
```

### Langkah 3: Menginstal Dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Langkah 4: Menjalankan Backend Server

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Backend API dapat diakses melalui:

```text
http://127.0.0.1:8000
```

Aplikasi secara otomatis membuat tabel database yang diperlukan ketika backend pertama kali dijalankan menggunakan SQLAlchemy.

## 8. Menjalankan Frontend

Buka terminal baru dan masuk ke direktori frontend dari direktori utama proyek:

```bash
cd frontend
```

### Langkah 1: Konfigurasi Environment Variable

Salin file `.env.example` menjadi `.env` dengan isi:

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Langkah 2: Menginstal Dependencies

```bash
npm install
```

### Langkah 3: Menjalankan Frontend Development Server

```bash
npm run dev
```

Frontend biasanya dapat diakses melalui:

```text
http://localhost:5173
```

Buka alamat tersebut melalui browser untuk menggunakan aplikasi.

**Catatan:** Backend dan frontend harus sama-sama berjalan agar aplikasi dapat digunakan dengan baik.

## 9. API Documentation

Backend menyediakan REST API untuk melakukan operasi CRUD terhadap data tugas.

| HTTP Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/tasks` | Mengambil seluruh data tugas. |
| POST | `/tasks` | Membuat tugas baru. |
| PUT | `/tasks/{task_id}` | Memperbarui tugas berdasarkan ID. |
| DELETE | `/tasks/{task_id}` | Menghapus tugas berdasarkan ID. |

### Struktur Data Tugas

| Field | Tipe Data | Keterangan |
|---|---|---|
| `id` | Integer | ID unik yang dibuat secara otomatis oleh database. |
| `title` | String | Judul tugas, wajib diisi. |
| `description` | String atau null | Deskripsi tugas. |
| `status` | String | Status tugas: `Todo`, `In Progress`, atau `Done`. |

### Contoh Request POST /tasks

```json
{
  "title": "Build REST API",
  "description": "Implement CRUD endpoints using FastAPI and PostgreSQL.",
  "status": "Todo"
}
```

Field `status` secara default menggunakan nilai `Todo` apabila tidak disertakan dalam request.

### Dokumentasi Interaktif

FastAPI menyediakan Swagger UI untuk mencoba dan menguji seluruh endpoint API.

Akses melalui browser:

```text
http://127.0.0.1:8000/docs
```

## 10. Pengujian Aplikasi

Beberapa skenario pengujian yang dapat dilakukan:

1. Membuat tugas baru dan memastikan data tersimpan di database.
2. Mengambil seluruh daftar tugas.
3. Mengubah judul, deskripsi, atau status tugas.
4. Menghapus tugas yang sudah ada.
5. Mengirim judul kosong dan memastikan validasi menolak input tersebut.
6. Mengirim status yang tidak valid dan memastikan request ditolak.
7. Mengakses tugas dengan ID yang tidak ditemukan dan memastikan API mengembalikan status `404`.

Pengujian dapat dilakukan melalui Swagger UI maupun langsung melalui antarmuka aplikasi.

---

Dikembangkan sebagai proyek Technical Test Full-Stack Developer Intern menggunakan FastAPI, PostgreSQL, React, dan TypeScript.
