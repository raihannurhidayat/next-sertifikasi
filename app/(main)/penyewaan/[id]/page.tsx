import MainLayout from "@/components/layout/main-layout";
import React from "react";
import { prisma } from "@/lib/database";
import FormEditRental from "./form-edit-rental";

const CreateRentalCard = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  // Melakukan query kedatabase untuk mengambil semua data yang ada pada tabel Mobil
  const cars = await prisma.mobil.findMany();
  // Melakukan query kedatabase untuk mengambil semua data yang ada pada
  const programs = await prisma.program.findMany();

  const biayaRental = await prisma.biayaRental.findFirst({
    where: {
      id: (await params).id,
    },
  });

  if(!biayaRental) {
    return (
      <MainLayout className="mt-12">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold">Penyewaan tidak ditemukan</h1>
          <p className="text-sm text-muted-foreground">
            Penyewaan dengan ID tersebut tidak ditemukan.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout className="mt-12">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold">
          Formulir verifikasi Penyewaan
        </h1>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum odit
          adipisci tempora aliquid porro sapiente cupiditate consequatur eius
          neque, cum atque! Ex aliquid aspernatur iure saepe ipsum tempore
          corporis dolorem.
        </p>
      </div>
      <hr className="border-[0.8px] my-4" />

      <FormEditRental biayaRental={biayaRental} cars={cars} programs={programs} />
    </MainLayout>
  );
};

export default CreateRentalCard;
