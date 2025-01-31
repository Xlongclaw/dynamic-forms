"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BiCopy, BiEdit, BiPlus, BiSolidEdit, BiX } from "react-icons/bi";
import { FiDatabase } from "react-icons/fi";
import { GrDocumentText } from "react-icons/gr";
import { BsArrowRight, BsGlobe } from "react-icons/bs";
import { TbForms } from "react-icons/tb";
import useFetch from "@/app/hooks/useFetch";
import { IProject } from "@/app/types/ProjectTypes";
import { normalToSnakeOrDash } from "@/app/utils/normalToSnakeOrDash";
import { CgArrowRight } from "react-icons/cg";
import axios from "axios";

const ProjectForms: React.FC = () => {
  const params = useParams(); // Access dynamic route parameters
  const projectId = params?.projectId; // Retrieve the projectId parameter

  interface IData {
    message: string;
    project: IProject;
  }

  const integrationToken = localStorage.getItem("integrationToken");
  const authToken = localStorage.getItem("authToken");

  const {
    data,
    loading: fetchLoading,
    error: fetchError,
  } = useFetch<IData>(`project/project/${projectId}`, true, {
    allow: integrationToken !== null && !authToken,
    projectId: typeof projectId === "string" ? projectId : "",
  });

  const handleCopyLink = (title: string) => {
    const link = `domain_url/forms/${normalToSnakeOrDash(title, "-")}`;
    navigator.clipboard.writeText(link); // Copy to clipboard
    alert("Link copied to clipboard!"); // Provide feedback to the user
  };

  if (fetchLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 pb-8 px-4 mt-8 gap-4">
        <div className="h-[12rem] w-full animate-pulse bg-gray-200 rounded-[0.8rem]"></div>
        <div className="h-[12rem] w-full animate-pulse bg-gray-200 rounded-[0.8rem]"></div>
        <div className="h-[12rem] w-full animate-pulse bg-gray-200 rounded-[0.8rem]"></div>
        <div className="h-[12rem] w-full animate-pulse bg-gray-200 rounded-[0.8rem]"></div>
      </div>
    );

  if (fetchError) return <p className="text-red-500">{fetchError}</p>;

  return (
    <div className="">
      <div>
        <div className="flex justify-between border-gray-100 py-2 px-3">
          <h2 className="text-2xl font-bold mb-4"></h2>
          <Link
            className="text-sm text-blue-600 font-medium flex items-center gap-1"
            href={`form/create`}
          >
            <BiPlus />
            Create new form
          </Link>
        </div>

        {data?.project?.forms && data?.project?.forms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8 px-4">
            {data?.project?.forms.map((form: any) => (
              <div
                key={form._id}
                className="rounded-lg hover:shadow-md transition-shadow w-full duration-300 p-4 pb-2 border border-gray-200 bg-gray-50/80 "
              >
                <div className="items-center flex w-full gap-4 pb-0">
                  <div className="w-full">
                    <p className="text-xs flex gap-1 text-gray-400 font-medium mb-2">
                      <span>{new Date(form.createdAt).toDateString()}</span>
                      <span>
                        {new Date(form.createdAt).toLocaleTimeString()}
                      </span>
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-lg mb-2 text-blue-700 flex items-center gap-1.5">
                        <GrDocumentText size={18} className="flex-shrink-0" />
                        <p className="mt-[2px]">{form.title}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-400 uppercase flex items-center gap-1">
                        <TbForms />
                        <p className="text-gray-700">{form.inputs.length}</p>

                        <p>Inputs</p>
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-500 leading-6 mt-[2px]">
                      {form.description}
                    </p>
                    <div className="py-2 mt-2 flex items-center justify-between space-x-2 text-sm">
                      <Link
                        href={`/forms/${form._id}/responses`}
                        className="flex items-center text-white hover:bg-blue-700 active:scale-95 transition-all bg-blue-600 p-2 rounded-full px-4 gap-1"
                      >
                        <FiDatabase size={18} />
                        View Responses
                      </Link>
                      <div className="flex">
                        <button
                          onClick={() => {
                            const token = localStorage.getItem("authToken");
                            const integrationToken =
                              localStorage.getItem("integrationToken");

                            if (token) {
                              axios.delete(
                                `${process.env.NEXT_PUBLIC_API_BASE_URL}/form/${form._id}`,
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );
                              window.location.reload();
                            } else if (integrationToken) {
                              axios.delete(
                                `${process.env.NEXT_PUBLIC_API_BASE_URL}/form/${form._id}`,
                                {
                                  headers: {
                                    "x-integration-token": integrationToken,
                                  },
                                }
                              );
                              window.location.reload();
                            } else {
                              window.location.href = "/login";
                            }
                          }}
                          className="flex items-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all p-2 rounded-full"
                        >
                          <BiX size={24} />
                        </button>
                        <Link
                          href={`/projects/${projectId}/form/edit/${form._id}`}
                          className="flex items-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all p-2 rounded-full"
                        >
                          <BiEdit size={24} />
                        </Link>
                        <Link
                          href={`/projects/${projectId}/form/${form._id}`}
                          className="flex items-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all p-2 rounded-full"
                        >
                          <CgArrowRight size={24} />
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border border-gray-200 bg-white p-3 rounded-md mb-2">
                      <Link
                        href={`${
                          data.project.projectWebUrl
                        }/forms/${normalToSnakeOrDash(form.title, "-")}`}
                        className="text-xs font-medium flex items-center gap-2 hover:text-blue-700"
                        target="_blank"
                      >
                        <BsGlobe />
                        {`${
                          data.project.projectWebUrl
                        }/forms/${normalToSnakeOrDash(form.title, "-")}`}
                      </Link>
                      <BiCopy
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => handleCopyLink(form.title)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No forms available for this project.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectForms;
