// File: components/FormEditRental.tsx
// Module: FormEditRental
// Deskripsi: Komponen ini digunakan untuk menampilkan dan mengedit data biaya rental mobil yang sudah ada,
// dengan sebagian field yang dapat diedit (khususnya `extraHours`) dan menghitung `totalPrice` otomatis.
// Setelah proses edit, data akan dikirim ke server menggunakan fungsi `updateRental`.

"use client"; // Direktif untuk memastikan komponen dijalankan di sisi klien

import { updateRental } from "@/actions/car"; // Fungsi untuk mengupdate data rental di server
import { Button } from "@/components/ui/button"; // Komponen tombol dari UI
import { Input } from "@/components/ui/input"; // Komponen input dari UI
import { Label } from "@/components/ui/label"; // Komponen label dari UI
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Komponen dropdown select dari UI
import { BiayaRental, Mobil, Program } from "@prisma/client"; // Tipe data dari Prisma
import { useRouter } from "next/navigation"; // Hook untuk navigasi halaman
import React, { useEffect, useState } from "react"; // React Hooks

// Tipe data untuk form rental tanpa field id, createdAt, dan updatedAt
export type FormDataRentalCar = Omit<
  BiayaRental,
  "id" | "createdAt" | "updatedAt"
>;

// Props yang diterima oleh komponen
type FormEditRentalProps = {
  biayaRental: BiayaRental; // Data biaya rental yang akan diedit
  cars: Mobil[]; // Daftar mobil yang tersedia
  programs: Program[]; // Daftar program/paket yang tersedia
};

// Komponen utama
const FormEditRental = (props: FormEditRentalProps) => {
  const router = useRouter(); // Untuk navigasi setelah update berhasil

  // State untuk menyimpan data form
  const [formData, setFormData] = useState<FormDataRentalCar>({
    tenantName: props.biayaRental.tenantName,
    mobilId: props.biayaRental.mobilId,
    dayDuration: props.biayaRental.dayDuration!,
    programId: props.biayaRental.programId,
    extraHours: props.biayaRental.extraHours,
    price: props.biayaRental.price,
    totalPrice: props.biayaRental.totalPrice,
    imgUrl: props.biayaRental.imgUrl, // Add imgUrl to match FormDataRentalCar type
  });

  // Fungsi ketika tombol 'Verifikasi' diklik
  const handleClick = async () => {
    try {
      // Kirim data ke server
      await updateRental(props.biayaRental.id, formData);
      router.push("/penyewaan"); // Kembali ke halaman penyewaan
      alert("Data Updated"); // Tampilkan notifikasi
    } catch (error: any) {
      console.log(error.message); // Tangani error jika gagal
    }
  };

  // useEffect untuk menghitung ulang total harga saat extraHours berubah
  useEffect(() => {
    const car = props.cars.find((car) => car.id === formData.mobilId);
    const program = props.programs.find(
      (program) => program.id === formData.programId
    );

    if (car && program) {
      setFormData((prev) => ({
        ...prev,
        // Hitung total harga berdasarkan harga awal + extra jam * 100.000
        totalPrice: props.biayaRental.price! + formData.extraHours! * 100000,
      }));
    }
  }, [formData.extraHours]); // Hanya dijalankan saat extraHours berubah

  // Tampilan form
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Input Nama Penyewa (tidak dapat diedit) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="tenantName">Nama Penyewa</Label>
          <Input
            disabled
            name="tenantName"
            id="tenantName"
            placeholder="Sina Kina"
            value={formData.tenantName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>

        {/* Dropdown Nama Mobil (disabled karena tidak bisa diganti) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="mobilId">Nama Mobil</Label>
          <Select
            name="mobilId"
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, mobilId: value }))
            }
            defaultValue={props.biayaRental.mobilId}
            disabled
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

        {/* Dropdown Program / Paket (disabled juga) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="programId">Program/paket</Label>
          <Select
            disabled
            defaultValue={props.biayaRental.programId}
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

        {/* Lama Sewa (tidak dapat diubah) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="dayDuration">Lama Sewa</Label>
          <Input
            disabled
            name="dayDuration"
            type="number"
            id="dayDuration"
            value={formData.dayDuration ? formData.dayDuration : ""}
            placeholder="Masukkan jumlah hari"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </div>

        {/* Extra Jam (dapat diubah oleh user) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="extraHours">Extra Jam</Label>
          <Input
            name="extraHours"
            type="number"
            id="extraHours"
            placeholder="Masukan jumlah jam"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: Number(e.target.value), // konversi ke number
              }))
            }
          />
        </div>

        {/* Total Harga (dihitung otomatis, tidak bisa diubah) */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="totalPrice">Total Harga</Label>
          <Input
            name="totalPrice"
            disabled
            value={formData.totalPrice ? formData.totalPrice : ""}
            type="number"
            id="totalPrice"
            placeholder="Total Harga"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [e.target.name]: Number(e.target.value),
              }))
            }
          />
        </div>
      </div>
      {/* <div className="flex flex-col gap-2 w-[400px]">
        <Label htmlFor="imgUrl">Upload Bukti Pembayaran</Label>
        <Input
          name="imgUrl"
          disabled
          value={formData.imgUrl ? formData.imgUrl : ""}
          type="file"
          id="imgUrl"
          placeholder="upload bukti pembayaran"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [e.target.name]: Number(e.target.value),
            }))
          }
        />
      </div> */}

      {/* Tombol Submit */}
      <div className="flex justify-end">
        <Button onClick={handleClick}>Verifikasi</Button>
      </div>
    </div>
  );
};

export default FormEditRental; // Export komponen
