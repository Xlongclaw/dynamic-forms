"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FiFileText, FiEye, FiDatabase, FiPlus, FiFile } from "react-icons/fi";
import { BiChevronRight, BiLink } from "react-icons/bi";
import { TbForms } from "react-icons/tb";

// Define an interface for form data
interface Form {
  _id: string;
  title: string;
  description: string;
  inputs: Object[];
}

const AllForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/form`);
        setForms(response.data.forms);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch forms");
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
      <div className="spinner"></div>
      <p className="ml-4 text-lg font-semibold">Loading...</p>
  </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen ">
      {/* Header and Create New Form Button */}

      <div className="flex justify-between items-center p-4 shadow7">
        <div className="flex gap-2 items-center">
          {/* <GrFormFolder/> */}
          <FiFile size={20} />
          <h1 className="text-lg font-semibold text-gray-800">Forms</h1>

        </div>
        <Link
          href="/forms/create" // Link to the form creation page
          onClick={()=>setLoading(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          <FiPlus className="text-white" />
          <span className="text-sm">Create New Form</span>
        </Link>
      </div>

      {/* Form List (Two-column grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-8 px-6">
        {forms.map((form) => (
          <div
            key={form._id}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col space-y-3">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <FiFileText className="text-gray-600" /> <span>{form.title}</span>
              </h2>
              <p className="text-sm text-gray-600">{form.description}</p>
              <span className="text-sm text-gray-400">{form.inputs.length} Inputs</span>
            </div>

            <div className="mt-4 flex items-center space-x-6 text-sm">
              <Link
                href={`/forms/${form._id}`}
                onClick={()=>setLoading(true)}
                className="flex items-center text-blue-600 hover:underline"
              >
                <FiEye className="mr-1" />
                View Form
              </Link>
              <Link
                href={`/forms/${form._id}/responses`}
                onClick={()=>setLoading(true)}
                className="flex items-center text-blue-600 hover:underline"
              >
                <FiDatabase className="mr-1" />
                View Responses
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllForms;
