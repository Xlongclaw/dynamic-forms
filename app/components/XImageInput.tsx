import React, { useState } from 'react';
import {  BiImageAdd, BiImages } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';
import { RxReload } from 'react-icons/rx';
import { uploadFileToR2 } from '../utils/uploadFileToR2';
import Image from 'next/image';

interface XImageInputProps {
    label: string;
    accept: string; // Define the file types (e.g., 'image/*' or 'application/pdf')
    onImageChange: (string: string | null) => void;
}

const XImageInput: React.FC<XImageInputProps> = ({ label, accept, onImageChange }) => {


  const [imageFile, setImageFile] = useState<File | null>(null);


  const onDelete = () => {
    setImageFile(null);
    onImageChange(null)
  }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // if (e.target.files) {
        //     onImageChange(e.target.files[0]);
        // }

        
        if (e.target.files) {
            try {
                const fileUrl = await uploadFileToR2(e.target.files[0], 'onboarding', 'onboarding', 1);
                console.log('File uploaded successfully:', fileUrl);
                onImageChange(fileUrl)
                setImageFile(e.target.files[0])
            } catch (error) {
                console.error('Failed to upload file:', error);
                alert('Error uploading file');
            }
        }
    };

    const handleImageDelete = () => {
        onDelete();
    };

    const handleImageChangeFile = () => {
        onDelete();
    };

    return (
        <div className="w-[40rem] text-zinc-700 text-lg">
            {/* <ImImage/> */}
            <div className='flex items-center gap-3 mb-6'>
                {/* <BiImage size={54} /> */}
                <BiImages size={32} />
                <div>
                    <label htmlFor="image-upload" className="block text-base  text-zinc-700">
                        {label}
                    </label>
                    <p className='text-sm text-zinc-400 text-start mt-1'>Your {label} must be a PNG or JPEG, up to 1 MB, of any size. </p>

                </div>

            </div>

            <input
                type="file"

                id="custom-file-input"
                className="hidden"
                accept={accept}
                onChange={handleImageChange}

            />
            {
                !imageFile && (
                    <label
                        htmlFor="custom-file-input"
                        className="mt-2 cursor-pointer justify-center bg-zinc-50 text-zinc-700 py-2 px-2 rounded-md border flex items-center gap-2 text-sm font-medium"
                    >
                        <BiImageAdd size={24} />
                        CHOOSE FILE
                    </label>
                )
            }
            {imageFile && (
                <div className="mt-2 text-center">
                    <Image
                        src={URL.createObjectURL(imageFile)}
                        alt="Selected"
                        className="w-full h-60 object-cover rounded-md mx-auto"
                    />

                    <div className="mt-6 flex gap-2">
                        <button
                            type="button"
                            className=" text-black flex items-center gap-2 border p-2 rounded bg-zinc-150 bg-zinc-50 hover:bg-black hover:text-white transition-all"
                            onClick={handleImageChangeFile}
                        >
                            <RxReload />
                            <p className='text-sm'>

                                Change Image
                            </p>

                        </button>
                        <button
                            type="button"
                            className="text-red-600 flex items-center gap-2 border p-2 rounded hover:bg-red-500 bg-zinc-50 hover:text-white transition-all"
                            onClick={handleImageDelete}
                        >
                            <FiDelete />
                            <p className='text-sm'>

                                Delete Image
                            </p>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default XImageInput;
