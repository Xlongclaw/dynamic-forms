import React from 'react';
import { BiInfoCircle } from 'react-icons/bi';
import { BsTextParagraph } from 'react-icons/bs';

interface XTextAreaProps {
    label: string;
    placeholder: string;
    infoText: string;
    required?: boolean;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    rows?: number; // To define the number of rows in the text area
    cols?: number; // To define the number of columns in the text area
}

const XTextArea: React.FC<XTextAreaProps> = ({
    label,
    placeholder,
    infoText,
    required = false,
    value,
    onChange,
    rows = 4, // Default to 4 rows
    cols = 50, // Default to 50 columns
}) => {
    const [infoHovered, setInfoHovered] = React.useState<boolean>(false);

    return (
        <div className='flex flex-col xl:w-[40rem] w-full'>
            <div className='mx-3 mb-1 flex items-center text-zinc-600 gap-1 text-sm md:text-base text-nowrap'>
                <BsTextParagraph />
                <label
                className="font-medium  h-[24px] min-w-48"
               
              >
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
              </label>
            </div>
            <textarea
                placeholder={placeholder}
                className='border p-3 focus:outline-sky-700 rounded-md sm:text-base text-sm'
                value={value}
                onChange={onChange}
                required={required}
                rows={rows}
                cols={cols}
                onFocus={() => setInfoHovered(true)}
                onBlur={() => setInfoHovered(false)}
            />
              <p
              className=" text-gray-600 ml-4 mt-0.5 text-sm"
            >
              {infoText}
            </p>
        </div>
    );
};

export default XTextArea;
