"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
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
        <button
          onClick={handleLogout}
          className="hidden md:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300"
        >
          Logout
        </button>
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
        &copy; 2024 MTL. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
