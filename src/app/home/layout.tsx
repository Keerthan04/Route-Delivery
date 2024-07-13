"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try{
      const res = await fetch('/api/logout',
        {
          method: 'GET',
          credentials: "include",
        }
      );
      if(!res.ok){
        const data = await res.json();
        toast.error(data.message);
      }
      else{
        toast.success("Logged out successfully");
        setTimeout(()=>{
          router.push('/');
        },1500);
      }
    }catch(error:any){
      console.error("Failed to logout:", error);
      toast.error("Failed to logout");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-900 p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-blue-400">
            <Link href="/home">MTL</Link>
          </span>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/home/entry"
              className="text-md font-bold text-white hover:text-blue-400 transition duration-300"
            >
              Entry
            </Link>
            <Link
              href="/home/report"
              className="text-md font-bold text-white hover:text-blue-400 transition duration-300"
            >
              Report
            </Link>
          </div>
        </div>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
                }
              />
            </svg>
          </button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Log Out</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>LogOut</DialogTitle>
              <DialogDescription>
                Are You sure You want to LogOut
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleLogout}>Logout</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 p-4">
          <Link
            href="/home/entry"
            className="block text-md font-bold text-white hover:text-yellow-400 transition duration-300 mb-2"
          >
            Entry
          </Link>
          <Link
            href="/home/report"
            className="block text-md font-bold text-white hover:text-yellow-400 transition duration-300 mb-2"
          >
            Report
          </Link>
          <button
            onClick={handleLogout}
            className="block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300 mt-2"
          >
            Logout
          </button>
        </div>
      )}

      <main className="flex-grow p-8 bg-gray-100">{children}</main>

      <footer className="bg-gray-900 p-4 text-center text-gray-400">
        Copyright 2024 © All Rights Reserved. The Manipal Group
      </footer>
    </div>
  );
};

export default Layout;
