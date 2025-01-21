import React from "react";

import { RiDropdownList } from "react-icons/ri";

interface XDropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
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
  return (
    <div className="xl:w-[40rem] w-full">
      <label className="text-base text-zinc-700 mb-4 flex items-center gap-2">
        <RiDropdownList size={20} />
        {/* <RxDropdownMenu/> */}
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <select
        className="w-full p-3 border rounded text-base font-normal"
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        {/* <option key={"others"} value="others">
          {`Other`}
        </option> */}
      </select>
      {/* {options.includes("others") && (
        <div>
          <label htmlFor="">{`Specify Other ${label}`}</label>
          <input type="text" />
        </div>
      )} */}
    </div>
  );
};

export default XDropdown;
