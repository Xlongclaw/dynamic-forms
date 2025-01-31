import React from "react";
import { CgChevronDown } from "react-icons/cg";
import { RiDropdownList } from "react-icons/ri";

interface XDropdownProps {
  label: string;
  options: string[];
  selectedValue: string[]; // Allow multiple selections
  onChange: (value: string[]) => void;
  required?: boolean;
  placeholder?: string;
}

const XDropdown: React.FC<XDropdownProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  required = false,
  placeholder = "Select an option",
}) => {
  const [expand, setExpand] = React.useState(false);

  const handleSelect = (option: string) => {
    const newSelection = selectedValue.includes(option)
      ? selectedValue.filter((item) => item !== option) // Remove if already selected
      : [...selectedValue, option]; // Add if not selected

    onChange(newSelection);
  };

  return (
    <div className="xl:w-[40rem] w-full relative">
      <label className="mx-3 text-base text-zinc-600 font-medium mb-1 flex items-center gap-1">
        <RiDropdownList />
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div
        onClick={() => setExpand((prev) => !prev)}
        className="border p-3 w-full rounded-md text-gray-700 flex justify-between items-center cursor-pointer"
        role="listbox"
        aria-expanded={expand}
      >
        {selectedValue.length > 0 ? selectedValue.join(", ") : placeholder}
        <CgChevronDown className={`transition-transform ${expand ? "rotate-180" : ""}`} />
      </div>

      {expand && (
        <div className="border p-3 mt-2 rounded-md flex flex-col bg-white w-full z-10">
          {options.map((option, index) => (
            <div key={index} className="flex gap-3 p-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedValue.includes(option)}
                onChange={() => handleSelect(option)}
              />
              <p className="">{option}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default XDropdown;
