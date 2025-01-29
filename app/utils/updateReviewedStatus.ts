import axios from "axios";

interface UpdateReviewedStatusResponse {
  message: string;
  error?: string;
}

interface UpdateReviewedStatusRequest {
  responseIds: string[];
  reviewed: boolean;
}

export const updateReviewedStatus = async (
  responseIds: string[],
  reviewed: boolean
): Promise<UpdateReviewedStatusResponse> => {
  try {
    const payload: UpdateReviewedStatusRequest = { responseIds, reviewed };

    // Replace with your actual API URL
    const token = localStorage.getItem("authToken");
    const { data } = await axios.put<UpdateReviewedStatusResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/response/review`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error updating reviewed status:", error);

    // Handle error response from the server
    if (axios.isAxiosError(error) && error.response) {
      return {
        message: "",
        error: error.response.data.error || "Failed to update reviewed status",
      };
    }

    // Generic fallback for unknown errors
    return {
      message: "",
      error: "An unexpected error occurred",
    };
  }
};
