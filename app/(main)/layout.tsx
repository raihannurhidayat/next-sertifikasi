import Navbar from "@/components/navbar";
import React, { PropsWithChildren } from "react";

const DashboardLayout = (props: PropsWithChildren) => {
  return (
    <div>
      {/* <Navbar /> */}
      {props.children}
    </div>
  );
};

export default DashboardLayout;
