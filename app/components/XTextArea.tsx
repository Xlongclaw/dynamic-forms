import React, { useState } from "react";

interface TextareaFieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void; // Change handler
  placeholder?: string;
  rows?: number; // Number of rows for the textarea
  maxLength?: number; // Maximum allowed characters
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  value = "",
  onChange,
  placeholder = `Enter ${label}`,
  rows = 3,
  maxLength = 500,
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="border px-3 py-2 rounded resize-none"
      />
      <div className="text-sm text-gray-500">
        {value.length}/{maxLength} characters
      </div>
    </div>
  );
};

export default TextareaField;
