import React, { useState } from "react";
import { BiDownload, BiX } from "react-icons/bi";

const DownloadCSVBtn = ({ formId="" }: { formId?: any }) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleDownload = async () => {
    try {
      const queryParams = new URLSearchParams({ formId });

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/response/downloadCSV?${queryParams.toString()}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create a link and click it to download the file
        const a = document.createElement("a");
        a.href = url;
        a.download = "response_list.csv";
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to download CSV. Please try again.");
      }
    } catch (error) {
      console.error("Error downloading CSV:", error);
      alert("An error occurred while downloading the CSV.");
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
        <div className="w-[20rem] border bg-white absolute -top-1 right-0 z-20 rounded-3xl flex flex-col items-end p-4 gap-0">
          <div className="flex items-center justify-end w-full">
            <BiX
              className="p-1 hover:bg-slate-200 rounded-full transition-all cursor-pointer"
              size={32}
              onClick={() => setExpand(false)}
            />
          </div>
          <div className="flex flex-col w-full mt-2">
            <label htmlFor="startDate" className="text-sm ml-4">
              From Date:
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-2 rounded-3xl border"
            />
          </div>
          <div className="flex flex-col w-full mt-4">
            <label htmlFor="endDate" className="text-sm ml-4">
              To Date:
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-2 rounded-3xl border"
            />
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 border mt-5 py-3 px-4 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white"
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
