import React, { useState } from "react";
import toast from "react-hot-toast";
import { BiDownload, BiX } from "react-icons/bi";
import axios from "axios";

const DownloadCSVBtn = ({ formId = "" }: { formId?: any }) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<string>("24hrs");

  const handleDateRangeSelection = (range: string) => {
    setSelectedRange(range); // Set the selected range

    const now = new Date();
    let start = "";
    let end = now.toISOString().split("T")[0]; // Today's date

    if (range === "custom") {
      // Clear the dates for custom range
      setStartDate("");
      setEndDate("");
      return;
    }

    switch (range) {
      case "24hrs":
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        break;
      case "week":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        break;
      case "month":
        start = new Date(now.setMonth(now.getMonth() - 1))
          .toISOString()
          .split("T")[0];
        break;
      case "3months":
        start = new Date(now.setMonth(now.getMonth() - 3))
          .toISOString()
          .split("T")[0];
        break;
      case "year":
        start = new Date(now.setFullYear(now.getFullYear() - 1))
          .toISOString()
          .split("T")[0];
        break;
      default:
        start = "";
        break;
    }

    setStartDate(start);
    setEndDate(end);
  };

  const handleDownload = async () => {
    try {
      const queryParams = new URLSearchParams({ formId });

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const token = localStorage.getItem("authToken");
      const integrationToken = localStorage.getItem("integrationToken");

      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/response/downloadCSV?${queryParams.toString()}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {
                "x-integration-token": integrationToken,
              },
          responseType: "blob", // Important: specify the response type as blob
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        setExpand(false);
        const blob = response.data; // Blob data from the response
        const url = window.URL.createObjectURL(blob); // Create a URL for the blob

        // Create a link and trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "response_list.csv"; // Specify the download file name
        a.click(); // Programmatically trigger the download
        window.URL.revokeObjectURL(url); // Clean up the object URL
      } else {
        toast.error("Failed to download CSV. Please try again.");
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
      toast.error("An error occurred while downloading the CSV.");
    }
  };

  return (
    <div className="flex gap-2 relative">
      <button
        onClick={() => setExpand(true)}
        className="flex items-center gap-2 border py-2 px-4 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white"
      >
        <BiDownload />
        <p className="text-sm">Export CSV</p>
      </button>
      {expand && (
        <div className="w-[20rem] border bg-white absolute top-0 -right-1 z-20 rounded-3xl flex flex-col items-center p-4 gap-0">
          <div className="grid-cols-3 grid items-center font-medium text-zinc-600 w-full">
            <p></p>
            <p className="text-sm pl-1.5">Select Range</p>
            <div className="flex justify-end">
              <BiX
                className="p-1 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
                size={32}
                onClick={() => setExpand(false)}
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-2 mt-4 bg-gray-50 rounded-3xl">
            {["24hrs", "week", "month", "3months", "year", "custom"].map(
              (range) => (
                <button
                  key={range}
                  className={`text-sm px-4 py-2 rounded-lg transition-all ${
                    selectedRange === range
                      ? "bg-blue-100 text-blue-600 font-bold"
                      : "text-blue-500 hover:bg-slate-100"
                  }`}
                  onClick={() => handleDateRangeSelection(range)}
                >
                  {range === "24hrs"
                    ? "Last 24 Hours"
                    : range === "week"
                    ? "Last Week"
                    : range === "month"
                    ? "Last Month"
                    : range === "3months"
                    ? "Last 3 Months"
                    : range === "year"
                    ? "Last Year"
                    : "Custom Date Range"}
                </button>
              )
            )}
          </div>
          {selectedRange === "custom" && (
            <>
              <div className="flex flex-col w-full mt-4">
                <label
                  htmlFor="startDate"
                  className="text-sm ml-4 text-gray-700"
                >
                  From date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2 rounded-3xl border text-sm text-gray-700"
                />
              </div>
              <div className="flex flex-col w-full mt-4">
                <label htmlFor="endDate" className="text-sm ml-4 text-gray-700">
                  To date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2 rounded-3xl border text-sm text-gray-700"
                />
              </div>
            </>
          )}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 border w-full justify-center mt-5 py-3 px-4 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white"
          >
            <BiDownload />
            <p className="text-sm">Download CSV</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadCSVBtn;
