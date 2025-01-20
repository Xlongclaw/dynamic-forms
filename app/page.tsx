import Link from "next/link";
import React from "react";
import { BiChevronRight } from "react-icons/bi";
import { IoCreate } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

const Home = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <p className="">
        {" "}
        <span className="font-bold text-3xl mr-2">Ricoz</span>
        <span className="font-medium">Forms</span>{" "}
      </p>
      <div className="mt-4 flex gap-4">
        <Link href={`/forms`} className="border-2 p-2 hover:text-white hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all text-zinc-800 rounded-full text-sm border-zinc-600 flex items-center gap-2 ">
        <MdDashboard/>
        <p className="font-medium">

          View Forms
        </p>
          <BiChevronRight/>
        </Link>
        <Link href={`/forms/create`} className="border-2 p-2 hover:text-white hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all text-zinc-800 rounded-full text-sm border-zinc-600 flex items-center gap-2 ">
        <IoCreate/>
        <p className="font-medium">

          Create new form
        </p>
          <BiChevronRight/>
        </Link>
      </div>
    </div>
  );
};

export default Home;
