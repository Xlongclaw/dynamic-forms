import React, { useState } from "react";
import { BiImageAdd, BiImages } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import { uploadFileToR2 } from "../utils/uploadFileToR2";
import ImageWithLoader from "./ImageWithLoader";

interface XImageInputEditProps {
  label: string;
  accept: string; // Define the file types (e.g., 'image/*' or 'application/pdf')
  onImageChange: (url: string | null) => void; // Callback when image is uploaded or deleted
  required?: boolean; // Whether the input is required
}

const XImageInputEdit: React.FC<XImageInputEditProps> = ({
  label,
  accept,
  onImageChange,
  required = false,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const fileUrl = await uploadFileToR2(
          e.target.files[0],
          "onboarding",
          "onboarding",
          1
        );
        console.log("File uploaded successfully:", fileUrl);
        onImageChange(fileUrl);
        setImageFile(e.target.files[0]);
        setIsError(false); // Clear error when a valid file is uploaded
      } catch (error) {
        console.error("Failed to upload file:", error);
        alert("Error uploading file");
      }
    }
  };

  const handleImageDelete = () => {
    setImageFile(null);
    onImageChange(null);
    if (required) setIsError(true); // Set error if the field is required and image is deleted
  };

  const handleImageChangeFile = () => {
    setImageFile(null);
    onImageChange(null);
    if (required) setIsError(true); // Set error if the field is required and image is cleared
  };

  const validate = () => {
    if (required && !imageFile) {
      setIsError(true);
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
            {label} {required && <span className="text-red-600">*</span>}
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
        onBlur={validate} // Trigger validation on blur
      />

      {!imageFile && (
        <label
          htmlFor="custom-file-input"
          className="mt-2 cursor-pointer justify-center bg-zinc-50 text-zinc-700 py-2 px-2 rounded-md border flex items-center gap-2 text-sm font-medium"
        >
          <BiImageAdd size={24} />
          Select File
        </label>
      )}

      {imageFile && (
        <div className="mt-2 text-center">
          <ImageWithLoader
            src={URL.createObjectURL(imageFile)}
            alt="Selected"
            className="w-full h-60 object-cover rounded-md mx-auto"
          />

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              className="text-black flex items-center gap-2 border p-2 rounded bg-zinc-50 hover:bg-black hover:text-white transition-all"
              onClick={handleImageChangeFile}
            >
              <RxReload />
              <p className="text-sm">Change Image</p>
            </button>
            <button
              type="button"
              className="text-red-600 flex items-center gap-2 border p-2 rounded hover:bg-red-500 bg-zinc-50 hover:text-white transition-all"
              onClick={handleImageDelete}
            >
              <FiDelete />
              <p className="text-sm">Delete Image</p>
            </button>
          </div>
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-600 mt-2">
          {label} is required. Please upload an image.
        </p>
      )}
    </div>
  );
};

export default XImageInputEdit;
