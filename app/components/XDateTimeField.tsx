import React, { useState } from "react";

interface DateTimeFieldProps {
  label: string;
  value: string; // ISO string or standard date format
  onChange: (value: string) => void; // Change handler
  type: "date" | "time" | "datetime-local"; // Input type
  placeholder?: string; // Placeholder text
  min?: string; // Minimum allowed value
  max?: string; // Maximum allowed value
}

const DateTimeField: React.FC<DateTimeFieldProps> = ({
  label,
  value,
  onChange,
  type,
  placeholder = "",
  min,
  max,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableLabel, setEditableLabel] = useState(label);

  const handleLabelChange = (newLabel: string) => {
    setEditableLabel(newLabel);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
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
            className="font-medium cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {editableLabel}
          </label>
        )}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="border px-3 py-2 rounded"
      />
    </div>
  );
};

export default DateTimeField;
