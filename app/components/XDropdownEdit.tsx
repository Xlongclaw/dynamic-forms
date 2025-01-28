import React, { useState } from "react";
import { RiDropdownList } from "react-icons/ri";
import { BiMinus, BiPlus, BiX } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";

interface XDropdownEditProps {
  label: string;
  options: string[];
  selectedValue: string;
  placeholder: string;
  required?: boolean;
  onChange: (key: string, value: string | string[] | boolean) => void; // Callback for field changes
  onDelete: () => void; // On delete callback
}

const XDropdownEdit: React.FC<XDropdownEditProps> = ({
  label,
  options,
  selectedValue,
  placeholder,
  required = false,
  onChange,
  onDelete,
}) => {
  const [editingField, setEditingField] = useState<
    "label" | "placeholder" | "options" | null
  >(null);
  const [editedLabel, setEditedLabel] = useState(label);
  const [editedPlaceholder, setEditedPlaceholder] = useState(placeholder);
  const [editedOptions, setEditedOptions] = useState(options);
  const [isRequired, setIsRequired] = useState(required);

  const handleSave = (field: string, value: string | string[] | boolean) => {
    setEditingField(null); // Reset the editing state
    onChange(field, value); // Notify the parent component of the change
  };

  const handleOptionChange = (index: number, newValue: string) => {
    const updatedOptions = [...editedOptions];
    updatedOptions[index] = newValue;
    setEditedOptions(updatedOptions);
    onChange("options", updatedOptions); // Notify parent about options update
  };

  const handleAddOption = () => {
    const updatedOptions = [...editedOptions, "Option"];
    setEditedOptions(updatedOptions);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = editedOptions.filter((_, i) => i !== index);
    setEditedOptions(updatedOptions);
    onChange("options", updatedOptions); // Notify parent about options update
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="xl:w-[40rem] w-full">
        {/* Editable Label */}
        <label className="text-base text-zinc-700 mb-1 flex items-center justify-between gap-2">
          <div className="flex gap-1 items-center ml-2">
            <RiDropdownList />
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
                className="cursor-pointer font-medium"
                onClick={() => setEditingField("label")}
              >
                {editedLabel}
              </span>
            )}
            {isRequired && <span className="text-red-600">*</span>}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => {
                setIsRequired(e.target.checked);
                onChange("required", e.target.checked);
              }}
            />
            <label className="text-gray-700 text-sm">Required</label>
          </div>
        </label>

        {/* Editable Placeholder */}
        {editingField === "placeholder" ? (
          <input
            type="text"
            value={editedPlaceholder}
            onChange={(e) => setEditedPlaceholder(e.target.value)}
            onBlur={() => handleSave("placeholder", editedPlaceholder)}
            className="border border-gray-200 p-3 w-full rounded-md focus:outline-none"
          />
        ) : (
          <div
            className="cursor-pointer text-gray-400 mb-2 p-3 rounded-md border border-gray-200"
            onClick={() => setEditingField("placeholder")}
          >
            {editedPlaceholder}
          </div>
        )}

        {/* Editable Options */}
        <div className="flex flex-col gap-2 border p-4 rounded-md">
          {editedOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className=" p-2 rounded lg:w-[30rem] text-sm  focus:outline-none bg-gray-100 border-b focus:border-blue-600 border-gray-100 "
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
              className="text-sm gap-1 mt-1 font-medium text-gray-700 active:scale-95 pr-4 hover:bg-blue-600 hover:text-white bg-gray-100 p-2 rounded-full transition-all flex justify-start items-center"
            >
              <BiPlus size={19} className=" " />
              Add Option
            </button>
          </div>
        </div>

        {/* Required Toggle */}
      </div>

      {/* Delete Dropdown */}
      <BiX
        onClick={() => onDelete()}
        size={24}
        className="bg-zinc-100 rounded-full p-1 hover:bg-red-500 hover:text-white cursor-pointer"
        aria-label="Remove Dropdown"
      />
    </div>
  );
};

export default XDropdownEdit;
