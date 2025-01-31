import React from "react";
import { CgOptions } from "react-icons/cg";

interface XRadioProps {
  label: string;
  options: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const XRadio: React.FC<XRadioProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  required = false,
}) => {
  const [otherValue, setOtherValue] = React.useState<string>(
    selectedValue.startsWith("Others: ") ? selectedValue.replace("Others: ", "") : ""
  );

  return (
    <div className="xl:w-[40rem] w-full bg-gray-50 border border-gray-100 sm:p-6 p-3 rounded-xl">
      <div className="text-base text-zinc-700 flex items-center  font-medium mb-4">
        <CgOptions />
        {label} {required && <span className="text-red-600">*</span>}
      </div>
      <div>
        {options.map((option) => (
          <div key={option} className="flex items-center p-3 rounded-xl border border-gray-100 bg-white my-2">
            <input
              type="radio"
              id={option}
              name="radio-group"
              value={option}
              checked={
                option === "Other"
                  ? selectedValue.startsWith("Others: ")
                  : selectedValue === option
              }
              onChange={() => {
                if (option !== "Other") {
                  onChange(option);
                  setOtherValue(""); // Reset Other input when another option is selected
                } else {
                  onChange(`Others: ${otherValue}`);
                }
              }}
              className="mr-2"
            />
            <label htmlFor={option} className="text-gray-600">{option}</label>

            {option === "Other" && selectedValue.startsWith("Others: ") && (
              <input
                type="text"
                value={otherValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setOtherValue(value);
                  onChange(`Others: ${value}`);
                }}
                className="ml-4 border-l border-gray-100 px-4 focus:outline-none py-1 rounded"
                placeholder="Specify Other"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default XRadio;
