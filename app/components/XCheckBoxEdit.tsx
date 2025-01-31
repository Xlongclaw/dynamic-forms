import React, { useState } from "react";
import { BiCheckCircle, BiMinus, BiPlus, BiX } from "react-icons/bi";
import { CgCheck } from "react-icons/cg";
import { GrDrag } from "react-icons/gr";

interface XCheckboxEditProps {
  label: string; // Label for the checkbox or checkbox group
  options: string[]; // List of options for multiple checkboxes
  selectedValues: string[]; // Array of selected values for multiple checkboxes
  required?: boolean; // Whether the checkbox is required
  onChange: (key: string, value: string | string[] | boolean) => void; // Callback for field changes
  onDelete: () => void; // Callback for removing the component
}

const XCheckboxEdit: React.FC<XCheckboxEditProps> = ({
  label,
  options,
  selectedValues,
  required = false,
  onChange,
  onDelete,
}) => {
  const [editingField, setEditingField] = useState<"label" | "options" | null>(
    null
  );
  const [editedLabel, setEditedLabel] = useState(label);
  const [editedOptions, setEditedOptions] = useState(options);
  const [isRequired, setIsRequired] = useState(required);
  const [withOther, setWithOther] = React.useState<boolean>(
    options.includes("Other")
  );

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
    const updatedOptions = [
      ...editedOptions,
      `Option ${editedOptions.length + 1}`,
    ];
    setEditedOptions(updatedOptions);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = editedOptions.filter((_, i) => i !== index);
    setEditedOptions(updatedOptions);
    onChange("options", updatedOptions);
  };

  return (
    <div className={`flex gap-2 items-center`}>
      <GrDrag />

      <div className="w-full xl:w-[40rem] text-gray-600 bg-gray-50 sm:p-3 p-3 border border-gray-100 rounded-md">
        {/* Editable Label */}
        <span className="text-gray-600 font-medium mb-4 flex items-center justify-between">
          <div className="flex gap-1 items-center">
            <BiCheckCircle />
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
                className="cursor-pointer  h-[26px] w-48"
                onClick={() => setEditingField("label")}
              >
                {editedLabel}
              </span>
            )}
            {isRequired && <span className="text-red-600">*</span>}
          </div>
          {/* Required Toggle */}
          <div className="mt-2 flex items-center gap-2">
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
              {option === "Other" ? (
                <div className=" p-2 rounded lg:w-[30rem] text-sm  focus:outline-none bg-gray-100 border-b focus:border-blue-600 border-gray-100 ">
                  {option}
                </div>
              ) : (
                <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className=" p-2 rounded lg:w-[30rem] text-sm  focus:outline-none bg-white border-b focus:border-blue-600 border-gray-100 "
              />
              )}

              
              <button className="flex items-center bg-gray-100 p-1 rounded-full hover:bg-red-600 hover:text-white ">
                <BiMinus
                  size={16}
                  className="cursor-pointer font-semibold"
                  onClick={() =>{
                    
                    handleRemoveOption(index)
                    if (options[index] === "Other") setWithOther(false);}}
                />
              </button>
            </div>
          ))}
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={handleAddOption}
              className="text-sm gap-1 mt-1 font-medium text-white active:scale-95 pr-4 bg-blue-600  hover:bg-blue-700 p-2 rounded-full transition-all flex justify-start items-center"
            >
              <BiPlus size={19} className=" " />
              Add Option
            </button>
             <button
                          type="button"
                          onClick={() => {
                            handleOptionChange(editedOptions.length, "Other");
                            setWithOther(true);
                          }}
                          className={`text-sm gap-1 mt-1 font-medium ${
                            withOther
                              ? "text-green-700"
                              : "text-gray-700 bg-gray-100 hover:bg-blue-600 hover:text-white"
                          }  active:scale-95 pr-4   p-2 rounded-full transition-all flex justify-start items-center`}
                        >
                          {withOther ? (
                            <CgCheck size={20} />
                          ) : (
                            <BiPlus size={19} className="" />
                          )}
                          {withOther ? "Other Option Enabled" : "Enable Other Option"}
                        </button>
          </div>
        </div>
      </div>

      {/* Delete Checkbox */}
      <BiX
        onClick={() => onDelete()}
        size={24}
        className="bg-zinc-100 rounded-full p-1 hover:bg-red-500 hover:text-white cursor-pointer"
        aria-label="Remove Checkbox"
      />
    </div>
  );
};

export default XCheckboxEdit;
