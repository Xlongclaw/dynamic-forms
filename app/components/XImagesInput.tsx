import React, { useState } from "react";
import { BiImageAdd, BiImages } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import { uploadFileToR2 } from "../utils/uploadFileToR2";
import ImageWithLoader from "./ImageWithLoader";

interface XImageInputProps {
  label: string;
  accept: string; // Define the file types (e.g., 'image/*' or 'application/pdf')
  onImageChange: (images: string[]) => void; // Now expects an array of image URLs
  required: boolean;
}

const XImagesInput: React.FC<XImageInputProps> = ({
  label,
  accept,
  onImageChange,
  required,
}) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const onDelete = () => {
    setImageFiles([]);
    onImageChange([]);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const files = Array.from(e.target.files);
        const uploadedUrls = await Promise.all(
          files.map(async (file) => {
            const fileUrl = await uploadFileToR2(
              file,
              "onboarding",
              "onboarding",
              1
            );
            return fileUrl;
          })
        );
        console.log("Files uploaded successfully:", uploadedUrls);
        setImageFiles((prevFiles) => [...prevFiles, ...files]);
        onImageChange(uploadedUrls);
      } catch (error) {
        console.error("Failed to upload files:", error);
        alert("Error uploading files");
      }
    }
  };

  return (
    <div className="xl:w-[40rem] w-full text-zinc-700 text-lg">
      <div className="flex items-center gap-3 mb-6">
        <BiImages className="md:block hidden" size={32} />
        <div>
          <label
            htmlFor="image-upload"
            className="block text-base text-zinc-700"
          >
            {label}
            {required && <span className="text-lg text-red-600">*</span>}
          </label>
          <p className="text-sm text-zinc-400 text-start mt-1">
            Your {label} must be a PNG or JPEG, up to 1 MB, of any size.
          </p>
        </div>
      </div>

      <input
        type="file"
        id="custom-file-input"
        className="hidden"
        accept={accept}
        onChange={handleImageChange}
        multiple // Allow multiple file selection
      />

      <label
        htmlFor="custom-file-input"
        className="mt-2 cursor-pointer justify-center bg-zinc-50 text-zinc-700 py-2 px-2 rounded-md border flex items-center gap-2 text-sm font-medium"
      >
        <BiImageAdd size={24} />
        Select Files
      </label>

      {imageFiles.length > 0 && (
        <div className="mt-2">
          {imageFiles.map((file, index) => (
            <div key={index} className="mb-4">
              <ImageWithLoader
                src={URL.createObjectURL(file)}
                alt={`Selected Image ${index + 1}`}
                className="w-full h-60 object-cover rounded-md mx-auto"
              />

              <div className="mt-2 flex gap-2"></div>
            </div>
          ))}
        </div>
      )}

      {imageFiles.length !== 0 && (
        <button
          type="button"
          className="text-red-600 flex items-center gap-2 border p-2 rounded hover:bg-red-500 bg-zinc-50 hover:text-white transition-all"
          onClick={() => onDelete()}
        >
          <FiDelete />
          <p className="text-sm">Delete Images</p>
        </button>
      )}
    </div>
  );
};

export default XImagesInput;
