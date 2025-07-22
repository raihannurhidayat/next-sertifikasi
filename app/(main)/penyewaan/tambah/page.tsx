import MainLayout from "@/components/layout/main-layout";
import React from "react";
import FormCreateRental from "./form-create-rental";
import { prisma } from "@/lib/database";

const CreateRentalCard = async () => {
  // Melakukan query kedatabase untuk mengambil semua data yang ada pada tabel Mobil
  const cars = await prisma.mobil.findMany();
  // Melakukan query kedatabase untuk mengambil semua data yang ada pada
  const programs = await prisma.program.findMany();

  return (
    <MainLayout className="mt-12">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold">Formulir pembuatan Penyewaan</h1>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum odit
          adipisci tempora aliquid porro sapiente cupiditate consequatur eius
          neque, cum atque! Ex aliquid aspernatur iure saepe ipsum tempore
          corporis dolorem.
        </p>
      </div>
      <hr className="border-[0.8px] my-4" />

      <FormCreateRental cars={cars} programs={programs} />
    </MainLayout>
  );
};

export default CreateRentalCard;
