import React from 'react';
import { BiCheck, BiCheckCircle } from 'react-icons/bi';

interface XCheckboxProps {
    label: string; // Label for the checkbox or checkbox group
    options?: string[]; // List of options for multiple checkboxes
    selectedValues?: string[]; // Array of selected values for multiple checkboxes
    onChange: (value: string, checked: boolean) => void; // Callback when a checkbox is toggled
    isSingle?: boolean; // If true, renders a single checkbox
    className?: string; // Additional custom classes for styling
    required?: boolean; // Whether the checkbox is required (for form validation)
}

const XCheckbox: React.FC<XCheckboxProps> = ({
    label,
    options = [],
    selectedValues = [],
    onChange,
    isSingle = false,
    className = '',
    required = false, // New prop to handle required checkbox field
}) => {
    const handleCheckboxChange = (value: string, checked: boolean) => {
        onChange(value, checked);
    };

    return (
        <div className={`flex flex-col ${className} w-[40rem] text-zinc-600 bg-zinc-50 p-6 border rounded-xl`}>
            <span className=" text-base text-zinc-600 font-medium mb-4 flex items-center gap-2">
            <BiCheckCircle size={20}/>

                {label} {required && <span className="text-red-600">*</span>}
            </span>

            {isSingle ? (
                <label className="flex items-center space-x-2 ">
                    <input
                        type="checkbox"
                        onChange={(e) => handleCheckboxChange(label, e.target.checked)}
                        checked={selectedValues.includes(label)}
                        className="w-4 h-4 "
                        required={required} // Applying required attribute if the checkbox is required
                    />
                    <span>{label}</span>
                </label>
            ) : (
                options.map((option) => (
                    <label key={option} className="flex items-center space-x-2 py-3">
                        <input
                            type="checkbox"
                            value={option}
                            onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                            checked={selectedValues.includes(option)}
                            className="w-4 h-4 cursor-pointer"
                            required={required} // Applying required attribute to each checkbox in the group
                        />
                        <span>{option}</span>
                    </label>
                ))
            )}
        </div>
    );
};

export default XCheckbox;
