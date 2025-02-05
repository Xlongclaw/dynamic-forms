import React, { useState } from "react";
import { BiFile, BiImageAdd, BiX } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { uploadFileToR2 } from "../utils/uploadFileToR2";
import { LuFiles, LuText } from "react-icons/lu";
import { CgBrowse } from "react-icons/cg";

interface XFilesInputProps {
  label: string;
  accept: string;
  onFilesChange: (images: string[]) => void;
  required: boolean;
  id: string;
  infoText?: string;
}

const XFilesInput: React.FC<XFilesInputProps> = ({
  label,
  accept,
  onFilesChange,
  required,
  id,
  infoText = "",
}) => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        setIsUploading(true);
        const selectedFiles = Array.from(e.target.files);

        const uploadedFiles = await Promise.all(
          selectedFiles.map(async (file) => {
            const fileUrl = await uploadFileToR2(
              file,
              "onboarding",
              "onboarding",
              10
            );
            return { name: file.name, url: fileUrl };
          })
        );

        setFiles((prev) => [...prev, ...uploadedFiles]);
        onFilesChange(uploadedFiles.map((file) => file.url));
      } catch (error) {
        console.error("File upload failed:", error);
        alert("Error uploading files");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = () => {
    setFiles([]);
    onFilesChange([]);
  };

  return (
    <div className="xl:w-[40rem] w-full text-zinc-700 text-lg bg-gray-50 border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-1 justify-between ">
        <div className="font-medium flex gap-2 items-center">
          <LuFiles />
          <label
            htmlFor={`custom-files-upload-${id}`}
            className="block text-base"
          >
            {label}{" "}
            {required && <span className="text-lg text-red-600">*</span>}
          </label>
        </div>
        {/* Delete button */}
        {files.length > 0 && (
          <button
            type="button"
            className=" flex items-center gap-1  p-2 rounded-full hover:bg-red-500 bg-zinc-50 hover:text-white transition-all"
            onClick={handleDelete}
          >
            <BiX size={24} />
          </button>
        )}

        {files.length === 0 && (
          <label
            htmlFor={`custom-files-upload-${id}`}
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
                Select Files
              </>
            )}
          </label>
        )}
      </div>

      <input
        type="file"
        id={`custom-files-upload-${id}`}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
        multiple
      />

      {/* Show uploaded file names */}
      {files.length > 0 && (
        <div className="mt-3 border p-3 rounded-xl border-gray-100 bg-white text-sm font-medium">
          
            {files.map((file, index) => (
              <div className="bg-white p-3 flex items-center gap-3 rounded-xl border border-gray-100 my-2">
                <LuText />
                <p className="text-sm text-zinc-600 truncate font-medium">
                  {file.name}
                </p>
              </div>
            ))}
        
        </div>
      )}
    </div>
  );
};

export default XFilesInput;
