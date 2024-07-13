'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import EntryForm from "@/components/entryForm";


export default function Entry() {
  

  return (
    <div className="container mx-auto p-2 ">
      {/*bg white rounded p-6 shadow-md */}
        <EntryForm/>
    </div>
  );
};

