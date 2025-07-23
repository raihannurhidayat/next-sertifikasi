// File: components/FormCreateRental.tsx
// Module: FormCreateRental
// Description: Komponen form untuk membuat data penyewaan mobil, memungkinkan pengguna memilih mobil, program, dan mengisi informasi penyewa.

// Menandai bahwa komponen ini adalah komponen client-side
"use client";

// Import fungsi untuk membuat data rental mobil dari server actions
import { createRental } from "@/actions/car";

// Import komponen UI dari folder components/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import tipe data dari Prisma schema
import { BiayaRental, Mobil, Program } from "@prisma/client";

// Import router dari Next.js untuk navigasi setelah submit
import { useRouter } from "next/navigation";

// Import React dan hook useState
import React, { useState } from "react";

// Mendefinisikan tipe FormDataRentalCar yang merupakan BiayaRental tanpa field id, createdAt, dan updatedAt
export type FormDataRentalCar = Omit<
  BiayaRental,
  "id" | "createdAt" | "updatedAt"
>;

// Tipe props untuk FormCreateRental
type FormCreateRentalProps = {
  cars: Mobil[]; // Daftar mobil yang tersedia
  programs: Program[]; // Daftar program/paket rental
};

// Komponen utama
const FormCreateRental = (props: FormCreateRentalProps) => {
  // State form untuk menyimpan input pengguna
  const [formData, setFormData] = useState<FormDataRentalCar>({
    tenantName: "", // Nama penyewa
    mobilId: "", // ID mobil yang dipilih
    dayDuration: 0, // Lama sewa dalam hari
    programId: "", // ID program yang dipilih
    extraHours: 0, // Tambahan jam sewa
    price: 0, // Harga per hari (akan dihitung di server)
    totalPrice: 0, // Total harga (akan dihitung di server)
    imgUrl: "", // URL gambar mobil (akan diisi di server)
  });

  // Inisialisasi router untuk navigasi setelah submit
  const router = useRouter();

  // Fungsi yang dipanggil saat tombol "Buat" ditekan
  const handleClick = async () => {
    try {
      await createRental(formData); // Kirim data ke server
      alert("Data Created"); // Tampilkan notifikasi
      router.push("/penyewaan"); // Navigasi ke halaman daftar penyewaan
    } catch (error: any) {
      console.log(error.message); // Tampilkan error di console
      alert("Gagal membuat data: Data Tidak Lengkap" ); // Tampilkan notifikasi error
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Input Nama Penyewa */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="tenantName">Nama Penyewa</Label>
          <Input
            name="tenantName"
            id="tenantName"
            placeholder="Sina Kina"
            value={formData.tenantName}
            required
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>

        {/* Pilih Mobil */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="mobilId">Nama Mobil</Label>
          <Select
            name="mobilId"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, mobilId: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Mobil" />
            </SelectTrigger>

            <SelectContent>
              {props.cars.map((car, index) => (
                <SelectItem key={index} value={car.id}>
                  {car.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pilih Program/Paket hanya jika dayDuration = 0 */}
        {formData.dayDuration ? null : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="programId">Program/paket</Label>
            <Select
              name="programId"
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, programId: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih program" />
              </SelectTrigger>

              <SelectContent>
                {props.programs.map((program, index) => (
                  <SelectItem key={index} value={program.id}>
                    {program.name !== "Non Paket"
                      ? `${program.name} Diskon ${program.discount}%`
                      : program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Input Lama Sewa hanya jika program belum dipilih */}
        {formData.programId ? null : (
          <div className="flex flex-col gap-2">
            <Label htmlFor="dayDuration">Lama Sewa</Label>
            <Input
              name="dayDuration"
              type="number"
              id="dayDuration"
              placeholder="Jumlah hari"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </div>
        )}
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-end">
        <Button onClick={handleClick}>Buat</Button>
      </div>
    </div>
  );
};

export default FormCreateRental;
