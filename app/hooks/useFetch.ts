import { useState, useEffect } from "react";
import axios from "axios";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T>(
  url: string,
  isProtected: boolean = false,

  integrationCredentials: {
    allow: boolean;
    projectId: string;
  } = {
    projectId: "",
    allow: false,
  }
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (integrationCredentials.allow) {
          const integrationToken = localStorage.getItem("integrationToken");
          const response = await axios.get<T>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL2}/api/${url}`,
            {
              headers: {
                "x-integration-token": integrationToken,
              },
            }
          );
          // Set the data from the response
          setData(response.data);
        } else {
          let headers = {};

          // Add Authorization header for protected routes
          if (isProtected) {
            const token = localStorage.getItem("authToken");

            headers = {
              Authorization: `Bearer ${token}`,
            };
          }

          // Fetch data from the API
          const response = await axios.get<T>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL2}/api/${url}`,
            { headers }
          );

          // Set the data from the response
          setData(response.data);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, isProtected]); // Re-run when URL or `isProtected` changes

  return { data, loading, error };
};

export default useFetch;
