import React, { useState } from 'react';
import { BiInfoCircle } from 'react-icons/bi';
import { BsPhone } from 'react-icons/bs';

interface XPhoneInputProps {
    label: string;
    placeholder: string;
    infoText: string;
    required?: boolean;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const XPhoneInput: React.FC<XPhoneInputProps> = ({ label, placeholder, infoText, required = false, value, onChange }) => {
    const [infoHovered, setInfoHovered] = React.useState<boolean>(false);
    const [isValid, setIsValid] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState('');

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.target;
        const phoneNumber = input.value;
        
        // Validate that the number has exactly 10 digits
        const isValidPhoneNumber = /^\d{10}$/.test(phoneNumber);
        
        if (!isValidPhoneNumber) {
            input.setCustomValidity('Phone number must have exactly 10 digits.');
            setIsValid(false);
            setErrorMessage('Phone number must have exactly 10 digits.');
        } else {
            input.setCustomValidity('');
            setIsValid(true);
            setErrorMessage('');
        }
    };

    return (
        <div className='flex flex-col xl:w-[40rem] w-full'>
            <div className='mx-3 mb-1 flex items-center text-zinc-600 gap-1 text-sm md:text-base'>
                <BsPhone />
                {label}
                {required && <span className='text-red-600 ml-1'>*</span>}
                <BiInfoCircle
                    onMouseOver={() => setInfoHovered(true)}
                    onMouseOut={() => setInfoHovered(false)}
                    className='ml-1 text-zinc-500 hover:text-black'
                />
                {
                    infoHovered &&
                    <div
                        className={` bg-zinc-800 sm:block hidden text-white px-2 rounded text-sm mx-2 py-0.5`}
                    >
                        {infoText}
                    </div>
                }
            </div>
            <input
                type='text' // Change type to text so it doesn't restrict non-numeric input in some browsers
                placeholder={placeholder}
                className={`border p-3 focus:outline-sky-700 rounded-md sm:text-base text-sm ${!isValid ? 'border-red-500' : ''}`}
                value={value}
                onChange={onChange}
                required={required}
                onFocus={() => setInfoHovered(true)}
                onBlur={handleBlur}
            />
            {!isValid && (
                <p className='text-red-500 text-sm mt-1'>
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default XPhoneInput;
