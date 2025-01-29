"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  BiCheckCircle,
  BiChevronRight,
  BiDownload,
  BiLink,
  BiXCircle,
} from "react-icons/bi";
import { GrFormFilter } from "react-icons/gr";
import { TbForms } from "react-icons/tb";
import DataChip from "./DataChip";
import { updateReviewedStatus } from "@/app/utils/updateReviewedStatus";
import toast from "react-hot-toast";
import DownloadCSVBtn from "./DownloadCSVBtn";

interface FormResponse {
  _id: string;
  formId: string;
  responses: { [key: string]: any };
  reviewed: boolean; // Include the reviewed status here
  submittedAt: string;
}

const ResponsesPage: React.FC = () => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formTemplateData, setFormTemplateData] = useState<any>(null);
  const [filterReviewed, setFilterReviewed] = useState<boolean>(false); // Default filter is 'false'
  const [selectedResponses, setSelectedResponses] = React.useState<string[]>(
    []
  );

  const params = useParams();
  const formId = params?.formId;
  React.useEffect(() => {
    console.log(selectedResponses);
  }, [selectedResponses]);

  const fetchResponses = async () => {
    const token = localStorage.getItem("authToken");
    const integrationToken = localStorage.getItem("integrationToken");
    
    try {
      const formResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/form/${formId}`
      );
      if (!formResponse.ok) {
        throw new Error(`Failed to fetch form with ID: ${formId}`);
      }
      const data = await formResponse.json();
      setFormTemplateData(data.form);


      if (token) {
        // Fetch the responses
        const responsesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/response/${formId}/responses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResponses(responsesResponse.data.data);
        setLoading(false);
      } else {
        // Fetch the responses
        const responsesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/response/${formId}/responses`,
          {
            headers: {
              "x-integration-token": integrationToken,
            },
          }
        );
        setResponses(responsesResponse.data.data);
        setLoading(false);
      }
    } catch (error) {
      setError("Failed to fetch data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [formId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <div className="spinner"></div>
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Filter responses based on reviewed status
  const filteredResponses = filterReviewed
    ? responses.filter((response) => response.reviewed === true)
    : responses.filter((response) => response.reviewed === false);
  const handleRoesponseSelection = (id: string) => {
    setSelectedResponses((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedResponses.length === filteredResponses.length) {
      setSelectedResponses([]); // Deselect all
    } else {
      setSelectedResponses(filteredResponses.map((response) => response._id)); // Select all
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center p-4 shadow7">
        <div className="flex gap-2 items-center">
          <TbForms size={20} />
          <h1 className="text-lg font-semibold text-gray-800">
            Form Responses
          </h1>
        </div>
        <Link
          href={`/forms/${formId}`}
          className="flex items-center gap-2 px-2 py-2 transition-all rounded-full cursor-pointer hover:bg-blue-500 hover:text-white"
        >
          <BiLink />
          <p className="text-xs font-medium">{formTemplateData?.title}</p>
          <BiChevronRight />
        </Link>
      </div>

      {/* Filter Options */}
      <div className="py-2 flex items-center gap-2 bg-gray-100 px-6 justify-between h-12">
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={filterReviewed}
            onChange={() => setFilterReviewed(!filterReviewed)} // Toggle filter on change
            className="w-4 h-4 cursor-pointer"
          />
          <label className="text-gray-700 text-sm">Reviewed</label>
        </div>
        {/* Option Bar */}
        <div className="flex gap-2">
          {selectedResponses.length !== 0 && !filterReviewed && (
            <button
              onClick={async () => {
                const result = await updateReviewedStatus(
                  selectedResponses,
                  true
                );

                if (result.error) {
                  console.log(`Error: ${result.error}`);
                } else {
                  toast.success("Marked all selected responses as reviewed");
                  fetchResponses();
                  setSelectedResponses([]);
                }
              }}
              className="text-sm text-green-600 font-medium active:scale-95 bg-white border hover:cursor-pointer hover:bg-green-600 hover:text-white transition-all py-2 px-4 rounded-full flex items-center gap-1"
            >
              <BiCheckCircle size={20} />
              <p> Mark Reviewed</p>
            </button>
          )}
          <DownloadCSVBtn formId={formId} />
        </div>

        {selectedResponses.length !== 0 && filterReviewed && (
          <button
            onClick={async () => {
              const result = await updateReviewedStatus(
                selectedResponses,
                false
              );

              if (result.error) {
                console.log(`Error: ${result.error}`);
              } else {
                toast.success("Removed all selected responses from reviewed");
                fetchResponses();
                setSelectedResponses([]);
              }
            }}
            className="text-sm text-red-600 font-medium active:scale-95 bg-white border hover:cursor-pointer hover:bg-red-600 hover:text-white transition-all py-2 px-4 rounded-full flex items-center gap-1"
          >
            <BiXCircle size={20} />
            <p> Mark Unreviewed</p>
          </button>
        )}
      </div>

      {/* Empty State if no responses */}
      {filteredResponses.length === 0 ? (
        <div className="h-[30rem] flex items-center justify-center text-center">
          <GrFormFilter className="text-gray-500" size={24} />
          <p className="text-center text-gray-500 mt-2">
            No responses available for this form.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg m-2">
          {/* Set a fixed height for the table container */}
          <div className="overflow-y-auto custom-scroll max-h-[84vh]">
            <table className="min-w-full table-auto text-sm text-gray-700 ">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 border-b text-left">
                    {/* Select all Checkbox */}
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600"
                      checked={
                        selectedResponses.length === filteredResponses.length
                      }
                      onChange={() => handleSelectAll()}
                    />
                  </th>
                  {formTemplateData.inputs.map((input: any, i: number) => (
                    <th
                      key={`data_key_${i}`}
                      className="px-4 py-3 border-b text-left font-medium text-nowrap text-gray-700"
                    >
                      {input.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredResponses.map((response, rowIndex) => {
                  return (
                    <tr
                      key={`value_res_${rowIndex}_${response._id}`}
                      className={`${
                        rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100   transition-all cursor-default`}
                    >
                      <td className="px-4 py-3 border-b text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-indigo-600 hover:cursor-pointer active:scale-90 hover:scale-125 transition-all"
                          onChange={() =>
                            handleRoesponseSelection(response._id)
                          }
                          checked={selectedResponses.includes(response._id)}
                        />
                      </td>
                      {formTemplateData.inputs.map((input: any, i: number) => {
                        if (
                          typeof response.responses[input.key] === "string" &&
                          (response.responses[input.key].startsWith("http") ||
                            response.responses[input.key].startsWith("https"))
                        ) {
                          return (
                            <td
                              key={`${input.key}_${i}`}
                              className="px-4 py-3 border-b text-left"
                            >
                              <Link
                                href={response.responses[input.key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                <p className="w-48 overflow-hidden text-ellipsis whitespace-nowrap">
                                  {response.responses[input.key]}
                                </p>
                              </Link>
                            </td>
                          );
                        } else if (
                          Array.isArray(response.responses[input.key])
                        ) {
                          return (
                            <td
                              key={`${input.key}_${i} `}
                              className="px-4 py-3 h-full border-b text-left text-nowrap"
                            >
                              {response.responses[input.key].map(
                                (item: string, i: number) => {
                                  if (
                                    item.startsWith("http") ||
                                    item.startsWith("https")
                                  )
                                    return (
                                      <span className="" key={`item_${i}`}>
                                        <Link
                                          className="text-blue-600 hover:underline"
                                          href={item}
                                        >
                                          {item}
                                        </Link>
                                        {response.responses[input.key].length -
                                          1 !==
                                          i && <span>, </span>}
                                      </span>
                                    );
                                  else
                                    return (
                                      <span className="" key={`item_${i}`}>
                                        {item}
                                        {response.responses[input.key].length -
                                          1 !==
                                          i && <span>, </span>}
                                      </span>
                                    );
                                }
                              )}
                            </td>
                          );
                        } else {
                          return (
                            <td
                              key={`${input.key}_${i}`}
                              className="px-4 py-3 border-b text-left text-nowrap"
                            >
                              <DataChip value={response.responses[input.key]} />
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsesPage;
