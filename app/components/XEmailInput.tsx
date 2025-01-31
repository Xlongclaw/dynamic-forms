import React from "react";
import { BiInfoCircle } from "react-icons/bi";
import { BsEnvelope } from "react-icons/bs";

interface XEmailInputProps {
  label: string;
  placeholder: string;
  infoText: string;
  required?: boolean;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const XEmailInput: React.FC<XEmailInputProps> = ({
  label,
  placeholder,
  infoText,
  required = false,
  value,
  onChange,
}) => {
  const [infoHovered, setInfoHovered] = React.useState<boolean>(false);

  return (
    <div className="flex flex-col xl:w-[40rem] w-full">
      <div className="mx-3 mb-1 flex items-center text-zinc-600 gap-1 text-sm md:text-base">
        <span className=" font-medium gap-1 flex items-center">
          <BsEnvelope className="flex-shrink-0 w-5" />
          {label}
        </span>

        {required && <span className="text-red-600 ml-1">*</span>}
      </div>
      <input
        type="email"
        placeholder={placeholder}
        className="border p-3 focus:outline-sky-700 rounded-md sm:text-base text-sm"
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setInfoHovered(true)}
        onBlur={() => setInfoHovered(false)}
      />
      <p className=" text-gray-600 ml-4 mt-0.5 text-sm">{infoText}</p>
    </div>
  );
};

export default XEmailInput;
