// File: app/penyewaan/page.tsx
// Module: PenyewaanPage
// Description: Menampilkan daftar penyewaan mobil beserta informasi mobil, program, durasi, dan total biaya. Menyediakan aksi tambah, edit, dan hapus penyewaan.

import { deleteRental } from "@/actions/car"; // Fungsi untuk menghapus data rental dari server action
import MainLayout from "@/components/layout/main-layout"; // Komponen layout utama
import { Button } from "@/components/ui/button"; // Komponen tombol UI
import { prisma } from "@/lib/database"; // Koneksi database Prisma
import { formatRupiah } from "@/lib/utils"; // Fungsi utilitas untuk format angka menjadi rupiah
import { Plus } from "lucide-react"; // Icon dari Lucide untuk tombol tambah
import Link from "next/link"; // Navigasi antar halaman
import React from "react";

// Komponen async karena akan melakukan pengambilan data dari database
const PenyewaanPage = async () => {
  // Mengambil data biayaRental beserta relasi mobil dan program
  const dataRentals = await prisma.biayaRental.findMany({
    include: {
      mobil: true,
      program: true,
    },
  });

  // Mengambil semua data program (untuk menampilkan kolom diskon program)
  const programs = await prisma.program.findMany({});

  return (
    <MainLayout className="mt-12">
      {/* Header halaman */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold">Daftar Penyewaan</h1>
        <p className="text-sm text-muted-foreground">
          Daftar Detail list dari penyewaan
        </p>
      </div>

      <hr className="border-[0.8px] my-4" />

      {/* Tombol tambah penyewaan */}
      <div className="flex items-center justify-end">
        <Link href={"/penyewaan/tambah"}>
          <Button className="flex items-center gap-0.5 cursor-pointer">
            <Plus className="size-4" />
            Tambah
          </Button>
        </Link>
      </div>

      {dataRentals.length > 0 ? (
        <table className="max-w-7xl text-left table-auto my-6">
          {/* Header tabel */}
          <thead>
            <tr>
              {/* Daftar nama kolom */}
              {[
                "No",
                "Nama Penyewa",
                "Nama Mobil",
                "Program",
                "Biaya",
                "Lama Sewa (hari)",
                "Paket 1",
                "Paket 2",
                "Paket 3",
                "Harian",
                "Extra",
                "Total Biaya",
                "Aksi",
              ].map((col, i) => (
                <th
                  key={i}
                  className="p-4 border-b border-slate-300 bg-slate-50"
                >
                  <p className="block text-sm font-normal leading-none text-slate-500">
                    {col}
                  </p>
                </th>
              ))}
            </tr>
          </thead>

          {/* Isi tabel */}
          <tbody>
            {dataRentals.map((rental, index) => (
              <tr className="hover:bg-slate-50" key={index}>
                {/* Kolom nomor urut */}
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">{index + 1}</p>
                </td>

                {/* Kolom data penyewaan */}
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">
                    {rental.tenantName}
                  </p>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">
                    {rental.mobil.name}
                  </p>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">
                    {rental.program.name}
                  </p>
                </td>

                {/* Kolom biaya mobil */}
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">
                    {formatRupiah(rental.mobil.price)}
                  </p>
                </td>

                {/* Lama sewa berdasarkan program atau manual */}
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">
                    {rental.program.day === 0
                      ? rental.dayDuration
                      : rental.program.day}
                  </p>
                </td>

                {/* Kolom diskon dari semua program */}
                {programs.map((program, index) => (
                  <td className="p-4 border-b border-slate-200" key={index}>
                    <p className="block text-sm text-slate-800">
                      {program.name !== "Non Paket"
                        ? program.discount + " %"
                        : "-"}
                    </p>
                  </td>
                ))}

                {/* Kolom extra jam sewa */}
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">
                    {rental.extraHours} Jam
                  </p>
                </td>

                {/* Kolom total harga */}
                <td className="p-4 border-b border-slate-200">
                  <p className="block text-sm text-slate-800">
                    {rental.totalPrice
                      ? formatRupiah(rental.totalPrice)
                      : "Belum Terverifikasi"}
                  </p>
                </td>

                {/* Aksi edit dan hapus */}
                <td className="p-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Link href={`/penyewaan/${rental.id}`}>
                      <p className="block text-sm font-semibold text-slate-800">
                        Edit
                      </p>
                    </Link>
                    <button
                      // Hapus rental (NOTE: fungsi ini tidak bisa jalan di server component tanpa handler khusus)
                      onClick={async () => {
                        "use server";
                        await deleteRental(rental.id);
                      }}
                      className="block text-sm font-semibold text-slate-800 hover:text-slate-800/90 transition-all ease-in-out cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-muted-foreground mt-6">
          <p className="text-sm">Tidak ada data penyewaan yang tersedia.</p>
        </div>
      )}

      {/* Tabel daftar penyewaan */}
    </MainLayout>
  );
};

export default PenyewaanPage;
