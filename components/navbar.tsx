import { NotepadTextIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 w-full border-b border-[0.6px] backdrop-blur bg-background/90 supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <NotepadTextIcon className="size-6" />
            <span className="text-xl font-semibold font-mono tracking-widest">
              Rental Mobil
            </span>
          </div>

          {/* Component Navigasi */}
          <div className="flex items-center gap-1">
            <Link href={"/penyewaan"}>
              <Button variant={"ghost"}>Penyewaan</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
