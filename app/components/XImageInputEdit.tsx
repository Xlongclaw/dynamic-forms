import React, { useState, useEffect } from "react";
import { BiEdit, BiImage, BiImageAdd, BiX } from "react-icons/bi";
import { TbForms } from "react-icons/tb";
import { normalCaseToCamelCase } from "../utils/normalCaseToCamelCase";
import { GrDrag } from "react-icons/gr";
import { IoImage, IoImages } from "react-icons/io5";
import { CgBrowse } from "react-icons/cg";

interface XImageInputProps {
  label: string;
  infoText: string;
  required?: boolean;
  type?: string;
  onChange: (key: string, value: string | boolean) => void; // Callback for field changes
  onDelete: () => void;
}

const XImageInputEdit: React.FC<XImageInputProps> = ({
  label: initialLabel,
  infoText: initialInfoText,
  required = false,
  type = "text",
  onChange,
  onDelete,
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [infoText, setInfoText] = useState(initialInfoText);
  const [key, setKey] = useState(normalCaseToCamelCase(initialLabel));

  const [editing, setEditing] = useState<string | null>(null); // Tracks which field is being edited
  const [isRequired, setIsRequired] = useState(required);

  useEffect(() => {
    setKey(normalCaseToCamelCase(label));
  }, [label]);

  // Handle Save/Edit Completion
  const handleSave = (field: string, value: string | boolean) => {
    setEditing(null);
    onChange(field, value); // Notify parent component of the change
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className="flex items-center gap-2">
      <GrDrag className="flex-shrink-0" />
      <div>
        <div className="flex flex-col xl:w-[40rem] w-full bg-gray-50 p-3  rounded-xl border">
          {/* Label Section */}
          <div className="mx-3 mb-1 flex items-center text-zinc-600 gap-1 text-sm md:text-base justify-between ">
            <div className="flex gap-1 items-center">
              <IoImage />
              {editing === "label" ? (
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onBlur={() => handleSave("label", label)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSave("label", label)
                  }
                  className="border-b border-gray-400 focus:border-blue-500 outline-none"
                  autoFocus
                />
              ) : (
                <label
                  className="cursor-pointer font-medium h-[24px] min-w-48"
                  onClick={() => setEditing("label")}
                >
                  {label}
                  {isRequired && <span className="text-red-600 ml-1">*</span>}
                </label>
              )}
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
          <div className="mx-3 flex   items-center my-4 gap-8">
            <BiImageAdd className="text-gray-200 flex-shrink-0" size={128} />
            <div>
              <p className="text-gray-500 text-lg font-medium">
                Drag and drop your landscape banner image here
              </p>
              {/* Info Text section */}
              <div className="sm:flex gap-1 hidden items-center text-gray-400 rounded text-sm py-0.5 mr-6">
          {editing === "infoText" ? (
            <textarea
              value={infoText}
              onChange={(e) => setInfoText(e.target.value)}
              onBlur={() => handleSave("infoText", infoText)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSave("infoText", infoText)
              }
              className="bg-transparent outline-none border border-gray-400 focus:border-blue-500 rounded-md p-1 w-full"
              rows={2}
              autoFocus
            />
          ) : (
            <p
              className="cursor-pointer"
              onClick={() => setEditing("infoText")}
            >
              {infoText}
            </p>
          )}
        </div>
              <button className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-2 mt-4 text-white rounded-full flex items-center gap-1 pr-4">
                <CgBrowse size={18} />
                Browse Image
              </button>
            </div>
          </div>
        </div>

        {/* Info Text Section */}
       
      </div>

      {/* Delete Icon */}
      <BiX
        onClick={() => handleDelete()}
        size={24}
        className="bg-zinc-100 rounded-full p-1 hover:bg-red-500 hover:text-white cursor-pointer flex-shrink-0"
        aria-label="Remove Input"
      />
    </div>
  );
};

export default XImageInputEdit;
