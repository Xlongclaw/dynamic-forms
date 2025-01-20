import React, { useState } from "react";

interface ContactFieldProps {
  label: string;
  type?: "text" | "email" | "tel"; // Allowed input types
  value?: string;
  onChange: (value: string) => void; // Change handler
}

const XContactField: React.FC<ContactFieldProps> = ({
  label,
  type = "text",
  value = "",
  onChange,
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
        placeholder={`Enter ${editableLabel}`}
        className="border px-3 py-2 rounded"
      />
    </div>
  );
};

export default XContactField;
