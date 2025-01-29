"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";
import { useParams, usePathname } from "next/navigation";
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

interface ProjectContextType {
  project: IProject | null;
  loading: boolean;
  error: string | null;
  keyValidation: boolean;
  validateKey: (key: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const projectId = params?.projectId;
  const pathname = usePathname();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [keyValidation, setKeyValidation] = useState<boolean>(true);
  const [iKey, setIkey] = useState<string>("");

  const validateKey = async (key: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/validate-key`,
        {
          integrationKey: key,
          projectId,
        }
      );
      if (response.status === 200) {
        localStorage.setItem("integrationToken", response.data.token);
        setKeyValidation(true);
      } else {
        setKeyValidation(false);
      }
    } catch (err) {
      setKeyValidation(false);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          window.location.href = "/login";
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        if (response.status === 200) {
          setProject(response.data.project);
        }
      } catch (err) {
        setError("Failed to fetch project data");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, iKey]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SET_KEY" && event.data.key) {
        setIkey(event.data.key);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <ProjectContext.Provider
      value={{ project, loading, error, keyValidation, validateKey }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}
