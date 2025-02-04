import React, { useState } from "react";
import { BiImageAdd, BiImages, BiX } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import { uploadFileToR2 } from "../utils/uploadFileToR2";
import ImageWithLoader from "./ImageWithLoader";
import { IoImages } from "react-icons/io5";
import { CgBrowse } from "react-icons/cg";

interface XImageInputProps {
  label: string;
  accept: string;
  onImageChange: (images: string[]) => void;
  required: boolean;
  id: string;
  infoText?: string;
}

const XImagesInput: React.FC<XImageInputProps> = ({
  label,
  accept,
  onImageChange,
  required,
  id,
  infoText="",
}) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Validate file size (1MB max per file)
      for (const file of files) {
        if (file.size > 1024 * 1024) {
          alert("Each image must be under 1MB.");
          return;
        }
      }

      setIsUploading(true);

      try {
        const uploadedUrls = await Promise.all(
          files.map(
            async (file) =>
              await uploadFileToR2(file, "onboarding", "onboarding", 1)
          )
        );

        console.log("Images uploaded successfully:", uploadedUrls);
        setImageFiles((prevFiles) => [...prevFiles, ...files]);
        setImageUrls((prevUrls) => [...prevUrls, ...uploadedUrls]);
        onImageChange([...imageUrls, ...uploadedUrls]);
      } catch (error) {
        console.error("Failed to upload images:", error);
        alert("Error uploading images");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDelete = () => {
    setImageFiles([]);
    setImageUrls([]);
    onImageChange([]);
  };

  return (
    <div className="xl:w-[40rem] w-full text-zinc-700 text-lg bg-gray-50 border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex items-center gap-1">
          <IoImages />
          <label
            htmlFor={`custom-image-input-${id}`}
            className=" text-base text-zinc-600 font-medium flex"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}

          </label>
        </span>
      </div>

      {imageFiles.length === 0 && (
        <div className="flex items-center gap-8">
          <BiImageAdd className=" text-gray-200" size={128} />
          <div className="flex flex-col items-start">
            <p className="text-lg font-medium text-gray-500">
              Drag and drop the images here to upload
            </p>
            <p className="text-sm font-medium text-gray-400">{infoText}</p>

            <label
              htmlFor={`custom-images-upload-${id}`}
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
                  Browse Images
                </>
              )}
            </label>
          </div>
        </div>
      )}

      <input
        type="file"
        id={`custom-images-upload-${id}`}
        className="hidden"
        accept={accept}
        onChange={handleImageChange}
        multiple
      />

      {imageUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <ImageWithLoader
                src={url}
                alt={`Uploaded Image ${index + 1}`}
                className="w-full h-60 object-cover rounded-xl mx-auto overflow-hidden "
              />
              <p className="text-sm font-medium text-gray-400 mt-1" >{imageFiles[index].name}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end">

      {imageUrls.length > 0 && (
        <button
          type="button"
          className=" flex items-center gap-1 mt-2  p-2 rounded-full hover:bg-red-500 bg-zinc-50 hover:text-white transition-all"
          onClick={handleDelete}
        >
          <BiX size={24} />
        </button>
      )}
      </div>

    </div>
  );
};

export default XImagesInput;
