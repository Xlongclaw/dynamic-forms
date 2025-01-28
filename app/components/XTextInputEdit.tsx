import React, { useState, useEffect } from "react";
import { BiEdit, BiX } from "react-icons/bi";
import { TbForms } from "react-icons/tb";
import { normalCaseToCamelCase } from "../utils/normalCaseToCamelCase";

interface XTextInputProps {
  label: string;
  placeholder: string;
  infoText: string;
  required?: boolean;
  type?: string;
  onChange: (key: string, value: string | boolean) => void; // Callback for field changes
  onDelete: () => void;
}

const XTextInputEdit: React.FC<XTextInputProps> = ({
  label: initialLabel,
  placeholder: initialPlaceholder,
  infoText: initialInfoText,
  required = false,
  type = "text",
  onChange,
  onDelete,
}) => {
  const [label, setLabel] = useState(initialLabel);
  const [placeholder, setPlaceholder] = useState(initialPlaceholder);
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
    <div className="flex items-center gap-4">
      <div className="flex flex-col xl:w-[40rem] w-full">
        {/* Label Section */}
        <div className="mx-3 mb-1 flex items-center text-zinc-600 gap-1 text-sm md:text-base justify-between">
          <div className="flex gap-1 items-center">
            <TbForms />
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
                className="cursor-pointer font-medium"
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

        {/* Placeholder Section */}
        <div className="border p-3 focus:outline-sky-700 rounded-md sm:text-base text-sm flex items-center gap-1">
          {editing === "placeholder" ? (
            <input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              onBlur={() => handleSave("placeholder", placeholder)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSave("placeholder", placeholder)
              }
              className="flex-grow bg-transparent outline-none border-b border-gray-400 focus:border-blue-500"
              autoFocus
            />
          ) : (
            <p
              className="text-gray-400 cursor-pointer flex-grow"
              onClick={() => setEditing("placeholder")}
            >
              {placeholder}
            </p>
          )}
        </div>

        {/* Info Text Section */}
        <div className="sm:flex gap-1 hidden items-center text-gray-600 px-2 rounded text-sm mx-2 py-0.5">
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
      </div>

      {/* Delete Icon */}
      <BiX
        onClick={() => handleDelete()}
        size={24}
        className="bg-zinc-100 rounded-full p-1 hover:bg-red-500 hover:text-white cursor-pointer"
        aria-label="Remove Input"
      />
    </div>
  );
};

export default XTextInputEdit;
