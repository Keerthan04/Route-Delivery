import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MTL ROUTE DELIVERY",
  description: "A project to track the routes and make a report of them",
  // icons:{
  //   icon:"../../public/tmg-logo.jpg",
  //   shortcut:"../../public/tmg-logo.jpg",
  // }
  }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
