import React from 'react';
import { BiInfoCircle } from 'react-icons/bi';
import { BsTextParagraph } from 'react-icons/bs';

interface XTextInputProps {
    label: string;
    placeholder: string;
    infoText: string;
    required?: boolean;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const XTextInput: React.FC<XTextInputProps> = ({ label, placeholder, infoText, required = false, value, onChange }) => {
    const [infoHovered, setInfoHovered] = React.useState<boolean>(false);

    return (
        <div className='flex flex-col xl:w-[40rem] w-full'>
            <div className='mx-3 mb-1 flex items-center text-zinc-600 gap-1 text-sm md:text-base'>
                <BsTextParagraph/>
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
                type='text'
                placeholder={placeholder}
                className='border p-3 focus:outline-sky-700 rounded-md sm:text-base text-sm'
                value={value}
                onChange={onChange}
                required={required}
                onFocus={() => setInfoHovered(true)}
                onBlur={() => setInfoHovered(false)}
            />
        </div>
    );
};

export default XTextInput;
