import React, { useState } from "react";
import { BiX } from "react-icons/bi";
import { GrDrag } from "react-icons/gr";

interface DateTimeFieldEditProps {
  label: string;
  value: string; // ISO string or standard date format
  onChange: (key: string, value: string | boolean) => void; // Change handler
  type: "date" | "time" | "datetime-local"; // Input type
  placeholder?: string; // Placeholder text
  min?: string; // Minimum allowed value
  max?: string; // Maximum allowed value
  required?: boolean; // Whether the field is required
  onDelete: () => void; // Callback for deleting the component
}

const XDateTimeFieldEdit: React.FC<DateTimeFieldEditProps> = ({
  label,
  value,
  onChange,
  type,
  placeholder = "",
  min,
  max,
  required = false,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableLabel, setEditableLabel] = useState(label);
  const [isRequired, setIsRequired] = useState(required);

  const handleLabelChange = (newLabel: string) => {
    setEditableLabel(newLabel);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange("label", editableLabel);
  };

  const handleRequiredChange = (checked: boolean) => {
    setIsRequired(checked);
    onChange("required", checked);
  };

  return (
    <div className="flex items-center gap-3 xl:w-[40rem] w-full bg-gray-50 p-3 border rounded">
            <GrDrag/>
      
      <div className="flex flex-col w-full">
        {/* Editable Label */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={editableLabel}
              onChange={(e) => handleLabelChange(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              className="border px-2 py-1 rounded"
            />
          ) : (
            <label
              className="font-medium cursor-pointer flex items-center  h-[26px] w-48"
              onClick={() => setIsEditing(true)}
            >
              {editableLabel}
              {isRequired && <span className="text-red-600 ml-1">*</span>}
            </label>
          )}
        </div>

        {/* Input Field */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange("value", e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          required={isRequired}
          className="border px-3 py-2 rounded mt-2"
        />

        {/* Required Toggle */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={isRequired}
            onChange={(e) => handleRequiredChange(e.target.checked)}
            className="cursor-pointer"
          />
          <label className="text-sm text-gray-600">Required</label>
        </div>
      </div>

      {/* Delete Button */}
      <BiX
        onClick={onDelete}
        size={24}
        className="bg-zinc-100 rounded-full p-1 hover:bg-red-500 hover:text-white cursor-pointer"
        aria-label="Delete XDateTimeFieldEdit"
      />
    </div>
  );
};

export default XDateTimeFieldEdit;
