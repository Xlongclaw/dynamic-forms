import React, { useState } from "react";
import { BiImage, BiImageAdd, BiX } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import { uploadFileToR2 } from "../utils/uploadFileToR2";
import ImageWithLoader from "./ImageWithLoader";
import { IoImage, IoReload, IoReloadOutline } from "react-icons/io5";
import { CgBrowse } from "react-icons/cg";
import { TbReload } from "react-icons/tb";

interface XImageInputProps {
  label: string;
  accept: string;
  onImageChange: (url: string | null) => void;
  id: string;
  infoText?: string;
  required: boolean;
}

const XImageInput: React.FC<XImageInputProps> = ({
  label,
  accept,
  onImageChange,
  id,
  infoText = "",
  required
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDelete = () => {
    setImageFile(null);
    setImageUrl(null);
    onImageChange(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // File size validation (1MB max)
      if (file.size > 1024 * 1024) {
        alert("File size must be under 1MB");
        return;
      }

      setIsUploading(true);

      try {
        const fileUrl = await uploadFileToR2(
          file,
          "onboarding",
          "onboarding",
          10
        );
        console.log("File uploaded successfully:", fileUrl);

        setImageFile(file);
        setImageUrl(fileUrl);
        onImageChange(fileUrl);
      } catch (error) {
        console.error("Failed to upload file:", error);
        alert("Error uploading file");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="xl:w-[40rem] w-full text-zinc-700 text-lg bg-gray-50 border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-1 mb-6">
        <span className="flex items-center gap-1">
          <IoImage />
          <label
            htmlFor={`custom-image-input-${id}`}
            className="text-base text-zinc-600 font-medium flex"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}

          </label>
        </span>
      </div>

      {!imageFile && (
        <div className="flex items-center gap-8">
          <BiImageAdd className=" text-gray-200" size={128} />
          <div className="flex flex-col items-start">
            <p className="text-lg font-medium text-gray-500">
              Drag and drop the image here to upload
            </p>
            <p className="text-sm font-medium text-gray-400">{infoText}</p>

            <label
              htmlFor={`custom-image-input-${id}`}
              className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-2 mt-4 text-white rounded-full flex items-center gap-1 pr-4"
            >
              {isUploading ? (
                <div className="flex gap-2 items-center">
                  <div className="spinner-white"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <>
                  <CgBrowse size={18} />
                  Browse Image
                </>
              )}
            </label>
          </div>
        </div>
      )}

      <input
        type="file"
        id={`custom-image-input-${id}`}
        className="hidden"
        accept={accept}
        onChange={handleImageChange}
      />

      {!imageFile ? (
        <></>
      ) : (
        <div className="mt-2 text-center">
          <ImageWithLoader
            src={imageUrl || URL.createObjectURL(imageFile)}
            alt="Selected Image"
            className="w-full h-60 object-cover rounded-xl mx-auto overflow-hidden "
          />

          <div className="mt-4 flex gap-2 justify-between items-center">
            <button
              type="button"
              className="text-white flex items-center gap-1 p-2 pr-3 rounded-full bg-blue-600 hover:bg-blue-700 hover:text-white transition-all"
              onClick={onDelete}
            >
              <TbReload/>
              <p className="text-sm">Change Image</p>
            </button>
            <div className="flex gap-1 items-center">

            <p className="text-sm font-medium text-gray-400">
                {imageFile.name}
                    
                </p>
            <button
              type="button"
              className=" flex items-center gap-1  p-2 rounded-full hover:bg-red-500 bg-zinc-50 hover:text-white transition-all"
              onClick={onDelete}
            >
               
              <BiX size={24}/>
              
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default XImageInput;
