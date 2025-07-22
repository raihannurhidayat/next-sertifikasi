"use server";

// Import tipe data untuk form penyewaan mobil
import { FormDataRentalCar } from "@/app/(main)/penyewaan/tambah/form-create-rental";
// Import koneksi Prisma (ORM) ke database
import { prisma } from "@/lib/database";
// Fungsi untuk memaksa refresh cache path tertentu setelah perubahan data
import { revalidatePath } from "next/cache";

/**
 * Fungsi untuk membuat data penyewaan baru
 * @param data data penyewaan mobil dari form input
 */
export const createRental = async (data: FormDataRentalCar) => {
  try {
    // Ambil data mobil berdasarkan ID yang dipilih di form
    const car = await prisma.mobil.findUnique({ where: { id: data.mobilId } });

    // Ambil data program berdasarkan ID yang dipilih di form
    const program = await prisma.program.findUnique({
      where: { id: data.programId },
    });

    console.log(data);

    // Jika program tidak ditemukan (null), artinya user memilih "non paket"
    if (!program) {
      // Ambil program dengan nama "Non Paket"
      const nonProgram = await prisma.program.findFirst({
        where: { name: "Non Paket" },
      });

      // Simpan data biaya rental dengan program non paket
      await prisma.biayaRental.create({
        data: {
          ...data,
          programId: nonProgram?.id!, // pakai ID dari program Non Paket
          price: car?.price! * data.dayDuration!, // hitung harga tanpa diskon
          dayDuration: Number(data.dayDuration),
        },
      });
      // Refresh ulang halaman /penyewaan agar data terbaru muncul
      revalidatePath("/penyewaan");

      return; // keluar dari fungsi setelah create selesai
    }

    // Jika program ditemukan, hitung total harga sewa
    const totalHarga = car?.price! * program?.day!;
    // Hitung jumlah potongan harga berdasarkan diskon (dalam persen)
    const diskon = (totalHarga * program?.discount!) / 100;
    // Hitung harga akhir setelah diskon
    const price = totalHarga - diskon;

    // Bentuk ulang data yang akan disimpan
    const newData: FormDataRentalCar = {
      ...data,
      price,
      dayDuration: program?.day!,
    };

    // Simpan data biaya rental ke database
    await prisma.biayaRental.create({
      data: newData,
    });

    // Refresh ulang halaman /penyewaan agar data terbaru muncul
    revalidatePath("/penyewaan");
  } catch (error) {
    console.log(error);
    throw new Error("Terjadi kesalahan pada server");
  }
};

/**
 * Fungsi untuk mengupdate data penyewaan berdasarkan ID
 * @param id ID dari data penyewaan yang ingin diubah
 * @param data data baru yang diinput user
 */
export const updateRental = async (id: string, data: FormDataRentalCar) => {
  try {
    await prisma.biayaRental.update({
      where: { id },
      data: {
        ...data,
        extraHours: Number(data.extraHours), // pastikan extraHours bertipe number
      },
    });

    // Refresh ulang halaman /penyewaan agar data terbaru muncul
    revalidatePath("/penyewaan");
  } catch (error) {
    console.log(error);
    throw new Error("Terjadi kesalahan pada server");
  }
};

/**
 * Fungsi untuk menghapus data penyewaan berdasarkan ID
 * @param id ID dari data penyewaan yang ingin dihapus
 */
export const deleteRental = async (id: string) => {
  try {
    await prisma.biayaRental.delete({
      where: { id },
    });

    // Refresh ulang halaman /penyewaan agar data terbaru muncul
    revalidatePath("/penyewaan");
  } catch (error) {
    console.log(error);
    throw new Error("Terjadi kesalahan pada server");
  }
};
