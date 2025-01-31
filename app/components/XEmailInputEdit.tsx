import React, { useState, useRef } from "react";
import { BiInfoCircle, BiX } from "react-icons/bi";
import { BsEnvelope } from "react-icons/bs";
import { GrDrag } from "react-icons/gr";
import { LuMail } from "react-icons/lu";

interface XEmailInputEditProps {
  label: string;
  placeholder: string;
  infoText: string;
  required?: boolean;
  value?: string;
  onChange: (key: string, value: string | boolean) => void; // Callback for field changes
  onDelete: () => void; // On delete callback
}

const XEmailInputEdit: React.FC<XEmailInputEditProps> = ({
  label,
  placeholder,
  infoText,
  required = false,
  value,
  onChange,
  onDelete,
}) => {
  const [infoHovered, setInfoHovered] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<
    "label" | "placeholder" | "infoText" | null
  >(null);
  const [editedLabel, setEditedLabel] = useState(label);
  const [editedPlaceholder, setEditedPlaceholder] = useState(placeholder);
  const [editedInfoText, setEditedInfoText] = useState(infoText);
  const [isRequired, setIsRequired] = useState(required);

  const placeholderInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = (field: string, value: string | boolean) => {
    setEditingField(null); // Reset the editing state
    onChange(field, value); // Notify the parent component of the change
  };

  const handlePlaceholderFocus = () => {
    if (placeholderInputRef.current) {
      placeholderInputRef.current.focus();
    }
  };

  return (
    <div className="flex gap-2 items-center">
            <GrDrag/>
      
      <div className="flex flex-col xl:w-[40rem] w-full">
        {/* Editable Label */}
        <div className="mx-3 mb-1 flex items-center text-zinc-600 gap-1 text-sm md:text-base justify-between">
            <div className="flex items-center gap-1">
          <LuMail />
          {editingField === "label" ? (
            <input
              type="text"
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              onBlur={() => handleSave("label", editedLabel)} // Pass field and value on save
              className="border-b border-gray-400 focus:outline-none"
            />
          ) : (
            <span
              className="cursor-pointer font-medium  h-[24px] min-w-48"
              onClick={() => setEditingField("label")}
            >
              {editedLabel}
            </span>
          )}
          {required && <span className="text-red-600 ml-1">*</span>}

            </div>
          {/* Required Checkbox */}
          <div className="flex gap-1 items-center">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={() => {
                setIsRequired(!isRequired);
                onChange("required", !isRequired); // Notify parent of change
              }}
              aria-label="Toggle Required"
            />
            <p className="text-sm ">Required</p>
          </div>
        </div>

        {/* Editable Placeholder */}
        <div className="flex gap-2 w-full">
          {editingField === "placeholder" ? (
            <input
              ref={placeholderInputRef}
              type="text"
              value={editedPlaceholder}
              onChange={(e) => setEditedPlaceholder(e.target.value)}
              onBlur={() => handleSave("placeholder", editedPlaceholder)} // Pass field and value on save
              className="border focus:outline-none w-full border-gray-300 p-2 rounded-md"
              autoFocus
            />
          ) : (
            <div
              className="cursor-pointer text-gray-400 p-3 rounded-md border border-gray-200 w-full h-12"
              onClick={() => {
                setEditingField("placeholder");
                handlePlaceholderFocus(); // Focus input when clicked
              }}
            >
              {editedPlaceholder}
            </div>
          )}
        </div>

        {/* Editable Info Text */}
        {editingField === "infoText" ? (
          <textarea
            value={editedInfoText}
            onChange={(e) => setEditedInfoText(e.target.value)}
            onBlur={() => handleSave("infoText", editedInfoText)} // Pass field and value on save
            className="bg-transparent outline-none border border-gray-200 mt-0.5 focus:border-blue-500 rounded-md p-1 w-full text-sm"
            rows={2}
            autoFocus
          />
        ) : (
          <p
            className="cursor-pointer text-gray-600 ml-4 mt-0.5 text-sm"
            onClick={() => setEditingField("infoText")}
          >
            {editedInfoText}
          </p>
        )}
      </div>

      {/* Delete Button */}
      <BiX
        onClick={() => onDelete()}
        size={24}
        className="bg-zinc-100 rounded-full p-1 hover:bg-red-500 hover:text-white cursor-pointer"
        aria-label="Remove Input"
      />
    </div>
  );
};

export default XEmailInputEdit;
