import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
  className?: string;
};

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return <div className={cn("max-w-7xl px-4 mx-auto", className)}>{children}</div>;
};

export default MainLayout;
