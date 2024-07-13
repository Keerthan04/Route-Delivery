import Image from "next/image";
import Link from "next/link";
import React from "react";
import entryImg from "../../../public/route.png";
import reportImage from "../../../public/report.png";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative w-full h-60 md:h-80 rounded-lg shadow-lg overflow-hidden ">
          <Image
            src={entryImg}
            alt="Entry Background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0"
          />
          <div className="relative z-10 flex flex-col justify-end items-center h-full p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Entry
            </h2>
            <p className="text-white mb-4">Log your route entries</p>
            <Link
              href="/home/entry"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-105 transform transition duration-300 ease-in-out"
            >
              Go to Entry
            </Link>
          </div>
        </div>
        <div className="relative w-full h-60 md:h-80 rounded-lg shadow-lg overflow-hidden">
          <Image
            src={reportImage}
            alt="Report Background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0"
          />
          <div className="relative z-10 flex flex-col justify-end items-center h-full p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Report
            </h2>
            <p className="text-white mb-4">Generate and view reports</p>
            <Link
              href="/home/report"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:scale-105 transform transition duration-300 ease-in-out"
            >
              Go to Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
