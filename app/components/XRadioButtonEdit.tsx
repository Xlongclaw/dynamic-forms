import React, { useState } from "react";
import { CgOptions } from "react-icons/cg";
import { BiMinus, BiPlus, BiX } from "react-icons/bi";

interface XRadioEditProps {
  label: string; // Label for the radio group
  options: string[]; // List of options for the radio buttons
  selectedValue: string; // The selected value
  onChange: (key: string, value: string | string[] | boolean) => void; // Callback for field changes
  onDelete: () => void; // Callback for removing the component
  required?: boolean; // Whether the radio group is required
}

const XRadioEdit: React.FC<XRadioEditProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  onDelete,
  required = false,
}) => {
  const [editingField, setEditingField] = useState<"label" | "options" | null>(
    null
  );
  const [editedLabel, setEditedLabel] = useState(label);
  const [editedOptions, setEditedOptions] = useState(options);
  const [isRequired, setIsRequired] = useState(required);

  const handleSave = (field: string, value: string | string[] | boolean) => {
    setEditingField(null); // Reset editing state
    onChange(field, value); // Notify the parent of the change
  };

  const handleOptionChange = (index: number, newValue: string) => {
    const updatedOptions = [...editedOptions];
    updatedOptions[index] = newValue;
    setEditedOptions(updatedOptions);
    onChange("options", updatedOptions);
  };

  const handleAddOption = () => {
    const updatedOptions = [...editedOptions, `Choice ${editedOptions.length + 1}`];
    setEditedOptions(updatedOptions);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = editedOptions.filter((_, i) => i !== index);
    setEditedOptions(updatedOptions);
    onChange("options", updatedOptions);
  };

  return (
    <div className="flex gap-2 items-center w-full text-gray-600 ">
      <div className="w-full bg-gray-50 border-gray-100 sm:p-3 p-3 border rounded-md  xl:w-[40rem] ">
        {/* Editable Label */}
        <span className="text-gray-600 font-medium text-base mb-4 flex items-center justify-between gap-2">
          <div className="flex gap-1 items-center">
            <CgOptions />
            {editingField === "label" ? (
              <input
                type="text"
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                onBlur={() => handleSave("label", editedLabel)}
                className="border-b border-gray-400 focus:outline-none"
              />
            ) : (
              <span
                className="cursor-pointer font-medium text-base"
                onClick={() => setEditingField("label")}
              >
                {editedLabel}
              </span>
            )}
            {isRequired && <span className="text-red-600">*</span>}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => {
                setIsRequired(e.target.checked);
                onChange("required", e.target.checked);
              }}
            />
            <label className="text-gray-700 text-sm font-normal">
              Required
            </label>
          </div>
        </span>

        {/* Editable Options */}
        <div className="flex flex-col gap-2">
          {editedOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className=" p-2 rounded lg:w-[30rem] text-sm  focus:outline-none bg-white border-b focus:border-blue-600 border-gray-100 "
              />
              <button className="flex items-center bg-gray-100 p-1 rounded-full hover:bg-red-600 hover:text-white ">
                <BiMinus
                  size={16}
                  className="cursor-pointer font-semibold"
                  onClick={() => handleRemoveOption(index)}
                />
              </button>
            </div>
          ))}
          <div className="flex items-start flex-col">
            <button
              type="button"
              onClick={handleAddOption}
              className="text-sm gap-1 mt-1 font-medium text-white active:scale-95 pr-4 bg-blue-600  hover:bg-blue-700 p-2 rounded-full transition-all flex justify-start items-center"
            >
              <BiPlus size={19} className=" " />
              Add Option
            </button>
          </div>
        </div>

        {/* Required Toggle */}
      </div>

      {/* Delete Radio */}
      <BiX
        onClick={() => onDelete()}
        size={24}
        className="bg-zinc-100 rounded-full p-1 hover:bg-red-500 hover:text-white cursor-pointer"
        aria-label="Remove Radio"
      />
    </div>
  );
};

export default XRadioEdit;
