"use client";
import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { MdPages } from "react-icons/md";
import { GrIntegration } from "react-icons/gr";
import { LuSettings } from "react-icons/lu";
import useFetch from "@/app/hooks/useFetch";
import { IProject } from "@/app/types/ProjectTypes";

// Define types
interface Form {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  projectName: string;
  projectDescription: string;
  forms: Form[];
}

const ProjectLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const params = useParams(); // Access dynamic route parameters
  const projectId = params?.projectId;
  const [Sloading, setSLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [iKey, setIkey] = React.useState<string>("");
  const [keyValidation, setKeyValidation] = useState(true);

  const [data, setData] = React.useState<IData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const pathname = usePathname();

  
  interface IData {
    message: string;
    project: IProject;
  }

  React.useEffect(() => {
    if (iKey !== "") {
      const integrationToken = localStorage.getItem("integrationToken");
      if (integrationToken) {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/project/${projectId}`,
            {
              headers: {
                "x-integration-token": integrationToken,
              },
            }
          )
          .then((response) => {
            if (response.status == 200) {
              setData(response.data);
              setLoading(false);
            }
          });
      } else {
        // generate integration token
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/validate-key`,
            {
              integrationKey: iKey,
              projectId,
            }
          )
          .then((response) => {
            if (response.status == 200) {
              localStorage.setItem("integrationToken", response.data.token);
              window.location.reload();
            }
          });
      }
    } else {
      const authToken = localStorage.getItem("authToken");

      if (authToken) {
        axios
          .get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/project/${projectId}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          )
          .then((response) => {
            if (response.status == 200) {
              setData(response.data);
              setLoading(false);
            } else {
              
              window.location.href = "/login";
            }
          });
      } else {
        setLoading(false)
        
      }
    }
  }, [iKey]);

  useEffect(() => {
    // Listen for messages from parent (iframe)
    const handleMessage = (event: MessageEvent) => {
      console.log("here");
      if (event.data.type === "SET_KEY" && event.data.key) {
        setIkey(event.data.key);
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup the listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (loading)
    return (
      <div className=" h-screen w-screen flex justify-center items-center ">
        <div className="spinner mx-auto my-auto"></div>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  if (
    pathname.endsWith("create") ||
    pathname.includes("form/") ||
    pathname.includes("forms/")
  )
    return <>{children}</>;


    return (
      <div className=" mx-auto">
        <div className=" flex justify-between items-center p-3 border-b top-0 border-gray-100 fixed w-full z-50 bg-white">
          <div className="flex gap-2 items-center text-sm">
            <Link
              href={`/projects/${projectId}/form`}
              className={`py-2 px-4 rounded-full  flex items-center gap-1  transition-all hover:gap-3 ${
                pathname.endsWith("form")
                  ? "bg-blue-600 text-white gap-3"
                  : " text-blue-700 font-medium hover:bg-blue-100"
              }`}
            >
              <MdPages />
              Forms
            </Link>
            <Link
              href={`/projects/${projectId}/integration`}
              className={`py-2 px-4 rounded-full  flex items-center gap-1  transition-all hover:gap-3 ${
                pathname.endsWith("integration")
                  ? "bg-blue-600 text-white gap-3"
                  : " text-blue-700 font-medium hover:bg-blue-100"
              }`}
            >
              <GrIntegration />
              Integration
            </Link>
            <Link
              href={`/projects/${projectId}/settings`}
              className={`py-2 px-4 rounded-full  flex items-center gap-1 hover:bg-blue-100 transition-all hover:gap-3 ${
                pathname.endsWith("settings")
                  ? "bg-blue-600 text-white gap-3"
                  : " text-blue-700 font-medium hover:bg-blue-100"
              }`}
            >
              <LuSettings />
              Settings
            </Link>
          </div>
          <p className="text-base font-semibold ">
            {data?.project?.projectName}
          </p>
        </div>
        <div className="mt-16">{children}</div>
      </div>
    );

  return <div>Not valid</div>;
};

export default ProjectLayout;
