import React from "react";
import { BiCheckCircle } from "react-icons/bi";

interface XCheckboxProps {
  label: string; // Label for the checkbox or checkbox group
  options?: string[]; // List of options for multiple checkboxes
  selectedValues?: string[]; // Array of selected values for multiple checkboxes
  onChange: (value: string, checked: boolean) => void; // Callback when a checkbox is toggled
  className?: string; // Additional custom classes for styling
  required?: boolean; // Whether the checkbox is required (for form validation)
}

const XCheckbox: React.FC<XCheckboxProps> = ({
  label,
  options = [],
  selectedValues = [],
  onChange,
  className = "",
  required = false, // New prop to handle required checkbox field
}) => {
  const [isSingle, setIsSingle] = React.useState<boolean>(options.length === 1);
  const handleCheckboxChange = (value: string, checked: boolean) => {
    onChange(value, checked);
  };

  return (
    <div
    className="w-full xl:w-[40rem] text-gray-600 bg-gray-50 sm:p-6 p-3 border border-gray-100 rounded-xl"
    >
      <span className=" text-gray-600 font-medium mb-4 flex items-center gap-1">
        <BiCheckCircle />
        {label} {required && <span className="text-red-600">*</span>}
      </span>

      {isSingle ? (
        <label className="flex items-start space-x-2 ">
          <input
            type="checkbox"
            onChange={(e) => handleCheckboxChange("Yes", e.target.checked)}
            checked={selectedValues.includes("Yes")}
            className="w-4 h-4 cursor-pointer flex-shrink-0 text-indigo-600 hover:cursor-pointer active:scale-90 hover:scale-125 transition-all mt-1"
            required={required} // Applying required attribute if the checkbox is required
          />
          <span>{options[0]}</span>
        </label>
      ) : (
        options.map((option) => (
          <label
            key={option}
            className="flex items-start space-x-2 py-3  md:text-base text-sm cursor-pointer bg-white p-4 my-2 rounded-xl border border-gray-100"
          >
            <input
              type="checkbox"
              value={option}
              onChange={(e) => handleCheckboxChange(option, e.target.checked)}
              checked={selectedValues.includes(option)}
              className="w-4 h-4 cursor-pointer flex-shrink-0 text-indigo-600 hover:cursor-pointer active:scale-90 hover:scale-125 transition-all mt-1"
              required={options.length == 0 ? required : false} // Applying required attribute to each checkbox in the group
            />
            <span>{option}</span>
          </label>
        ))
      )}
    </div>
  );
};

export default XCheckbox;
