import React, { useState } from "react";
import { BiFile, BiImageAdd, BiX } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import { uploadFileToR2 } from "../utils/uploadFileToR2";
import { TbReload } from "react-icons/tb";
import { LuText } from "react-icons/lu";
import { CgBrowse } from "react-icons/cg";

interface XFileInputProps {
  label: string;
  accept: string;
  onFileChange: (url: string | null) => void;
  id: string;
  infoText?: string;
}

const XFileInput: React.FC<XFileInputProps> = ({
  label,
  accept,
  onFileChange,
  id,
  infoText = "",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // File size validation (1MB max)
      if (selectedFile.size > 1024 * 1024 * 10) {
        alert("File size must be under 10MB");
        return;
      }

      setIsUploading(true);

      try {
        const uploadedUrl = await uploadFileToR2(
          selectedFile,
          "onboarding",
          "onboarding",
          10
        );
        console.log("File uploaded successfully:", uploadedUrl);

        setFile(selectedFile);
        setFileUrl(uploadedUrl);
        onFileChange(uploadedUrl);
      } catch (error) {
        console.error("Failed to upload file:", error);
        alert("Error uploading file");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = () => {
    setFile(null);
    setFileUrl(null);
    onFileChange(null);
  };

  return (
    <div className="xl:w-[40rem] w-full text-zinc-700 text-lg bg-gray-50 border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-1 justify-between">
        <span className="flex gap-1 items-center">
          <BiFile className="md:block hidden" />
          <label
            htmlFor={`custom-file-input-${id}`}
            className="block text-base font-medium"
          >
            {label}
          </label>
        </span>

        {!file ? (
          <label
            htmlFor={`custom-file-input-${id}`}
            className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-2 text-white rounded-full flex items-center gap-1 pr-4"
          >
            {isUploading ? (
              <div className="flex gap-2 items-center">
                <div className="spinner-white"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <CgBrowse size={18} />
                Select File
              </>
            )}
          </label>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-2 text-white rounded-full flex items-center gap-1 pr-4"
              onClick={() =>
                document.getElementById(`custom-file-input-${id}`)?.click()
              }
            >
              <TbReload size={18} />
              {isUploading ? "Uploading..." : "Change File"}
            </button>
            <button
              type="button"
              className=" flex items-center gap-1  p-2 rounded-full hover:bg-red-500 bg-zinc-50 hover:text-white transition-all"
              onClick={handleDelete}
            >
              <BiX size={24} />
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        id={`custom-file-input-${id}`}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />

      {!file ? (
        <></>
      ) : (
        <div className="mt-2 text-center">
          <div className="bg-white p-3 flex items-center gap-3 rounded-xl border border-gray-100">
            <LuText />
            <p className="text-sm text-zinc-600 truncate font-medium">
              {file.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default XFileInput;
