import type { ReactNode } from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";

type LayoutProps = {
  withNavbar?: boolean;
  withFooter?: boolean;
  children: ReactNode;
};

export default function Layout({
  withNavbar = false,
  withFooter = false,
  children,
}: LayoutProps) {
  return (
    <>
      {withNavbar && <Navbar />}
      {children}
      {withFooter && <Footer />}
    </>
  );
}
