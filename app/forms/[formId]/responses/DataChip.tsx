import React, { useState } from "react";
import { BiCheckDouble, BiCopy } from "react-icons/bi";

interface DataChipProps {
  value: string;
}

const DataChip: React.FC<DataChipProps> = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = React.useState<boolean>(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 5000); // Reset copied state after 2 seconds
    });
  };

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      className={`flex items-center justify-between gap-2 px-2 py-1 ${hovered && "bg-gray-100"} rounded-md hover:bg-gray-200 transition-colors cursor-pointer group`}
      onClick={handleCopy}
    >
      <span className="text-sm text-gray-800">{value}</span>

      {/* Copy Icon */}
      <BiCopy
        className={` ${copied && "hidden"}  hover:text-blue-500 active:scale-90 hover:scale-110 transition-all ${hovered ? "" : "text-transparent "} `}
        size={16}
      />


      {/* Feedback on Copy */}
      {copied && (
        <BiCheckDouble className="text-green-600"/>
      )}
    </div>
  );
};

export default DataChip;
