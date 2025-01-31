"use client";
import React from "react";
import useFetch from "../hooks/useFetch";
import Link from "next/link";
import { GoProject } from "react-icons/go";
import { BiPlus, BiUserPlus } from "react-icons/bi";
import { IProject } from "../types/ProjectTypes";
import { GrDocument, GrProjects } from "react-icons/gr";

interface IData {
  message: string;
  projects: IProject[];
}

const Projects: React.FC = () => {
  const { data, loading, error } = useFetch<IData>(
    `project/all-projects`,
    true
  );

  // Handling different states (loading, error, no data)
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="spinner"></div>
      </div>
    );
  if (error) {
    const token = localStorage.getItem("authToken");

    if (!token) {
      // If no token is found, redirect to login page using window.location.href
      window.location.href = "/login";
      return;
    }

    return <p className="text-red-500">{error}</p>;
  }

  if (data?.projects)
    return (
      <div className="mx-auto pt-16">
        <div className="flex justify-between fixed w-full bg-white top-0 items-center border-b p-3 border-gray-100">
          <div className="flex items-center gap-2 text-gray-800">
            <GoProject className="stroke-[1px]" size={24} />
            <p className="font-medium">Projects</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/panel/signup-requests"
              className=" text-blue-600 bg-blue-50 font-medium py-2 pr-4 pl-4 text-sm rounded-full hover:bg-blue-100 flex items-center gap-1"
            >
              <BiUserPlus size={20} />
            </Link>
            <Link
              href="/projects/new"
              className="bg-blue-600 text-white py-2 pr-4 pl-2 text-sm rounded-full hover:bg-blue-700 flex items-center gap-1"
            >
              <BiPlus size={20} />
              Add New Project
            </Link>
          </div>
        </div>

        {data?.projects?.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 p-3">
            {data?.projects?.map((project: any) => (
              <Link
                href={`/projects/${project._id}/form`}
                key={project._id}
                className="bg-gray-50 border border-gray-200 p-4 rounded flex items-center gap-4 hover:bg-blue-50 hover:border-blue-600 transition-all"
              >
                <div>
                  <div className="flex justify-between py-1 items-start">
                    <GrProjects
                      className="text-gray-400 mb-2 flex items-center"
                      size={32}
                    />
                    <div className="text-xs font-medium bg-white border flex items-center p-1 px-4 gap-1 rounded-full">
                      <GrDocument /> {project.forms.length} Forms
                    </div>
                  </div>
                  <p className="font-bold text-lg mb-2">
                    {project.projectName}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {project.projectDescription}{" "}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {project._id}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
};

export default Projects;
