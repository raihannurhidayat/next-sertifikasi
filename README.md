# Rental Mobil

## Creator: Muhamad Raihan Nurhdiayat
Selamat datang di RentCar! Ini adalah sebuah platform penyewaan mobil berbasis web yang dibangun menggunakan teknologi modern untuk memberikan pengalaman pengguna yang cepat, responsif, dan intuitif. Proyek ini bertujuan untuk memudahkan pengguna jasa rental mobil sewaan dalam menagement data.

Aplikasi ini dikembangkan dengan **Next.js**, **React**, dan **Tailwind CSS** untuk memastikan performa tinggi dan tampilan yang menarik di semua perangkat.

## Teknologi
* **Framework**: [Next.js](https://nextjs.org/) (dengan App Router)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
* **UI Libray**: [Tailwindcss](https://www.typescriptlang.org/)
* **UI Component**: [Shadcn](https://www.typescriptlang.org/)

# Dokumentasi Fungsi Server (Server Actions)

File ini berisi kumpulan fungsi *server-side* yang digunakan untuk mengelola data penyewaan mobil (CRUD - Create, Read, Update, Delete). Fungsi-fungsi ini dieksekusi di server dan berinteraksi langsung dengan database menggunakan **Prisma ORM**.

Setiap operasi yang berhasil akan memicu `revalidatePath("/penyewaan")` untuk memastikan data yang ditampilkan di halaman utama selalu yang terbaru tanpa perlu me-refresh halaman secara manual.

---

## **`createRental`**

* **Nama Fungsi:** `createRental`
* **Parameter yang dibutuhkan:**
    * `data`: Objek dengan tipe `FormDataRentalCar` yang berisi semua informasi dari form input penyewaan baru.
* **Deskripsi:**
    Fungsi ini bertanggung jawab untuk membuat data penyewaan baru di dalam database. Logikanya terbagi menjadi dua skenario:
    1.  **Dengan Paket Program**: Jika pengguna memilih suatu program, fungsi akan menghitung total harga berdasarkan durasi hari dari program tersebut, kemudian memberikan potongan harga (diskon) sesuai yang tertera pada program. Harga akhir setelah diskon akan disimpan ke database.
    2.  **Tanpa Paket (Non Paket)**: Jika pengguna tidak memilih program (atau `programId` bernilai `null`), fungsi akan menganggapnya sebagai "Non Paket". Harga akan dihitung dengan mengalikan harga harian mobil dengan durasi hari yang diinput manual oleh pengguna, tanpa ada diskon.

---

## **`updateRental`**

* **Nama Fungsi:** `updateRental`
* **Parameter yang dibutuhkan:**
    * `id`: `string` - ID unik dari data penyewaan yang ingin diperbarui.
    * `data`: Objek dengan tipe `FormDataRentalCar` yang berisi data baru untuk menggantikan data lama.
* **Deskripsi:**
    Fungsi ini digunakan untuk memperbarui data penyewaan yang sudah ada. Fungsi akan mencari data berdasarkan `id` yang diberikan dan menimpanya dengan `data` baru dari input pengguna. Fungsi ini juga memastikan bahwa nilai `extraHours` dikonversi menjadi tipe `Number` sebelum disimpan.

---

## **`deleteRental`**

* **Nama Fungsi:** `deleteRental`
* **Parameter yang dibutuhkan:**
    * `id`: `string` - ID unik dari data penyewaan yang ingin dihapus.
* **Deskripsi:**
    Fungsi ini digunakan untuk menghapus data penyewaan secara permanen dari database. Fungsi akan mencari data berdasarkan `id` yang diberikan, lalu menghapusnya.

## Install Depedency
```
npm install
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Generate Schema Table
```
npx prisma db push
```
