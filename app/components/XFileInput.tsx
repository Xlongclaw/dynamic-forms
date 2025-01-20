import React from 'react';

interface XFileInputProps {
    label: string;
    accept: string;
    onFilesChange: (files: FileList | null) => void;
    multiple?: boolean;
    required?: boolean;
}

const XFileInput: React.FC<XFileInputProps> = ({ label, accept, onFilesChange, multiple = false, required = false }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onFilesChange(e.target.files);
        }
    };

    return (
        <div className="w-[30rem]">
            <label htmlFor="file-upload" className="block text-lg font-medium">
                {label} {required && <span className="text-red-600">*</span>}
            </label>
            <input
                type="file"
                id="file-upload"
                className="w-full p-2 border rounded"
                accept={accept}
                onChange={handleFileChange}
                multiple={multiple}
                required={required}
            />
        </div>
    );
};

export default XFileInput;
