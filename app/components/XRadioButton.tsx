import React from 'react';
import { BiSelection } from 'react-icons/bi';
import { CgOptions } from 'react-icons/cg';
import { GrSwitch } from 'react-icons/gr';

interface XRadioProps {
    label: string;
    options: string[];
    selectedValue: string;
    onChange: (value: string) => void;
    required?: boolean;
}

const XRadio: React.FC<XRadioProps> = ({ label, options, selectedValue, onChange, required = false }) => {
    return (
        <div className="w-[40rem] bg-zinc-50 border p-6 rounded-xl">
            <div className="text-base text-zinc-700  flex items-center gap-2 font-medium mb-4">
            <CgOptions size={20}/>
                {label} {required && <span className="text-red-600">*</span>}
            </div>
            <div>
                {options.map((option) => (
                    <div key={option} className="flex items-center py-2">
                        <input
                            type="radio"
                            id={option}
                            name="radio-group"
                            value={option}
                            checked={selectedValue === option}
                            onChange={() => onChange(option)}
                            className="mr-2"
                        />
                        <label htmlFor={option}>{option}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default XRadio;
