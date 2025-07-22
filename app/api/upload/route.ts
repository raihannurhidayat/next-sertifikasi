// /api/images/route.ts

import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/database";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const id = formData.get("id") as string;

  if (!file || !id) {
    return NextResponse.json({ error: "File or id missing" }, { status: 400 });
  }

  // Mengambil isi file sebagai ArrayBuffer (representasi biner dari file)
  const bytes = await file.arrayBuffer();

  // Mengubah ArrayBuffer menjadi Buffer (objek biner milik Node.js)
  const buffer = Buffer.from(bytes);

  // Membuat nama file unik dengan menambahkan timestamp di depan nama file aslinya
  const filename = `${Date.now()}-${file.name}`;

  // Menentukan path lengkap tempat menyimpan file di folder public/uploads
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  // Menyimpan buffer file ke path yang telah ditentukan
  await writeFile(filePath, buffer);

  const image = await prisma.biayaRental.update({
    where: { id },
    data: {
      imgUrl: `/uploads/${filename}`,
    },
  });

  return NextResponse.json(image);
}
