import React from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { RiDropdownList } from 'react-icons/ri';
import { RxDropdownMenu } from 'react-icons/rx';

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
    placeholder = 'Select an option',
}) => {
    return (
        <div className="w-[40rem]">
            <label className="text-base text-zinc-700 mb-4 flex items-center gap-2">
                <RiDropdownList size={20}/>
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
            </select>
        </div>
    );
};

export default XDropdown;
