import React, { useState } from "react";
import { BiImageAdd, BiImages } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { RxReload } from "react-icons/rx";
import { uploadFileToR2 } from "../utils/uploadFileToR2";
import ImageWithLoader from "./ImageWithLoader";

interface XImagesInputEditProps {
  label: string; // Label for the image input
  accept: string; // Accept file types
  onImageChange: (images: string[]) => void; // Callback for image changes
  required: boolean; // Whether the field is required
  onDelete: () => void; // Callback for deleting the component
}

const XImagesInputEdit: React.FC<XImagesInputEditProps> = ({
  label,
  accept,
  onImageChange,
  required,
  onDelete,
}) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [editingField, setEditingField] = useState<"label" | "accept" | null>(null);
  const [editedLabel, setEditedLabel] = useState(label);
  const [editedAccept, setEditedAccept] = useState(accept);
  const [isRequired, setIsRequired] = useState(required);

  const onDeleteImages = () => {
    setImageFiles([]);
    onImageChange([]);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const files = Array.from(e.target.files);
        const uploadedUrls = await Promise.all(
          files.map(async (file) => {
            const fileUrl = await uploadFileToR2(file, "onboarding", "onboarding", 1);
            return fileUrl;
          })
        );
        setImageFiles((prevFiles) => [...prevFiles, ...files]);
        onImageChange(uploadedUrls);
      } catch (error) {
        alert("Error uploading files");
      }
    }
  };

  const handleSave = (field: string, value: string | boolean) => {
    setEditingField(null); // Reset editing state
    if (field === "label") {
      setEditedLabel(value as string);
    } else if (field === "accept") {
      setEditedAccept(value as string);
    }
    onImageChange([]);
    onImageChange([]); // Re-sync the images if needed
  };

  return (
    <div className="xl:w-[40rem] w-full text-zinc-700 text-lg">
      <div className="flex items-center gap-3 mb-6">
        <BiImages className="md:block hidden" size={32} />
        <div>
          {editingField === "label" ? (
            <input
              type="text"
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              onBlur={() => handleSave("label", editedLabel)}
              className="border-b border-gray-400 focus:outline-none"
            />
          ) : (
            <span
              className="cursor-pointer"
              onClick={() => setEditingField("label")}
            >
              {editedLabel}
            </span>
          )}
          {isRequired && <span className="text-lg text-red-600">*</span>}
        </div>
      </div>

      <div className="text-sm text-zinc-400 mb-4">
        {editingField === "accept" ? (
          <input
            type="text"
            value={editedAccept}
            onChange={(e) => setEditedAccept(e.target.value)}
            onBlur={() => handleSave("accept", editedAccept)}
            className="border-b border-gray-400 focus:outline-none"
          />
        ) : (
          <span
            className="cursor-pointer text-blue-500 underline"
            onClick={() => setEditingField("accept")}
          >
            {editedAccept}
          </span>
        )}
      </div>

      <input
        type="file"
        id="custom-file-input"
        className="hidden"
        accept={editedAccept}
        onChange={handleImageChange}
        multiple
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
            </div>
          ))}
        </div>
      )}

      {imageFiles.length !== 0 && (
        <button
          type="button"
          className="text-red-600 flex items-center gap-2 border p-2 rounded hover:bg-red-500 bg-zinc-50 hover:text-white transition-all"
          onClick={onDeleteImages}
        >
          <FiDelete />
          <p className="text-sm">Delete Images</p>
        </button>
      )}

      <div className="mt-3 flex items-center gap-2">
        <label className="text-sm">Required</label>
        <input
          type="checkbox"
          checked={isRequired}
          onChange={(e) => {
            setIsRequired(e.target.checked);
            onImageChange([]);
          }}
        />
      </div>

      {/* Delete Button */}
      <FiDelete
        onClick={onDelete}
        size={24}
        className="bg-zinc-100 rounded-full p-1 hover:bg-red-500 hover:text-white cursor-pointer mt-4"
        aria-label="Remove Image Input"
      />
    </div>
  );
};

export default XImagesInputEdit;
