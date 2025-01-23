"use client";
import ImageWithLoader from "@/app/components/ImageWithLoader";
import XImagesInput from "@/app/components/XImagesInput";
import { normalCaseToCamelCase } from "@/app/utils/normalCaseToCamelCase";
import { uploadFileToR2 } from "@/app/utils/uploadFileToR2";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { BiFile, BiImageAdd, BiMinus, BiPlus, BiX } from "react-icons/bi";
import { GoCheckbox } from "react-icons/go";
import { IoRadioButtonOn, IoReload } from "react-icons/io5";
import { PiTextT } from "react-icons/pi";
import { RxDropdownMenu } from "react-icons/rx";
import { TbTextPlus } from "react-icons/tb";
import { TiDelete } from "react-icons/ti";

interface FormField {
  type: string;
  label: string;
  placeholder?: string;
  infoText?: string;
  required?: boolean;
  key: string;
  options?: string[];
  accept?: string;
  multiple?: boolean;
  isSingle?: boolean;
  whatsappLink: string;
}

interface IRazorpay {
  appName?: string;
  amount?: any;
  keyId?: string;
}

interface FormType {
  title: string;
  description: string;
  instructions: string[];
  banner: string;
  graphics: string[];
  inputs: FormField[];
  razorpay: IRazorpay;
}

const CreateFormPage: React.FC = () => {
  const [form, setForm] = useState<FormType>({
    title: "",
    description: "",
    instructions: [],
    banner: "",
    graphics: [],
    inputs: [],
    razorpay: {
      amount: 0,
      appName: "",
      keyId: "",
    },
  });

  const [currentField, setCurrentField] = useState<FormField>({
    type: "text",
    label: "",
    placeholder: "",
    infoText: "",
    required: false,
    key: "",
    options: [],
    accept: "",
    multiple: false,
    isSingle: false,
    whatsappLink: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentOption, setCurrentOption] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [graphicsFiles, setGraphicsFiles] = useState<File[]>([]);
  const [withRazorpay, setWithRazorpay] = useState<boolean>(false);

  React.useEffect(() => {
    console.log(form);
  }, [form]);

  const handleAddOption = () => {
    if (currentOption.trim()) {
      setCurrentField((prev) => ({
        ...prev,
        options: [...(prev.options || []), currentOption],
      }));
      setCurrentOption("");
    }
  };

  const handleSaveField = () => {
    if (!currentField.label || !currentField.key) {
      alert("Please fill out the label and key for the field.");
      return;
    }

    if (editIndex !== null) {
      setForm((prev) => {
        const updatedInputs = [...prev.inputs];
        updatedInputs[editIndex] = currentField;
        return { ...prev, inputs: updatedInputs };
      });
      setEditIndex(null);
    } else {
      setForm((prev) => ({
        ...prev,
        inputs: [...prev.inputs, currentField],
      }));
    }

    setCurrentField({
      type: "text",
      label: "",
      placeholder: "",
      infoText: "",
      required: false,
      key: "",
      options: [],
      accept: "",
      multiple: false,
      isSingle: false,
      whatsappLink: "",
    });
  };

  // const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setBannerFile(file);
  //     setBannerPreview(URL.createObjectURL(file));
  //   }
  // };

  // const handleGraphicsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files) {
  //     const newFiles = Array.from(files);
  //     setGraphicsFiles((prev) => [...prev, ...newFiles]);
  //     const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
  //     setGraphicsPreviews((prev) => [...prev, ...newPreviews]);
  //   }
  // };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.url; // Return the uploaded file URL
  };

  const handleSaveForm = async () => {
    try {
      let bannerUrl = "";

      if (bannerFile) {
        bannerUrl = await uploadFileToR2(
          bannerFile,
          "onboarding",
          "onboarding",
          1
        );
      }

      const finalForm = {
        ...form,
        banner: bannerUrl,
        graphics: form.graphics,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/form`,
        finalForm
      );
      console.log("Form created successfully:", response.data);
      alert("Form created successfully!");

      // Reset form state
      setForm({
        title: "",
        description: "",
        instructions: [],
        banner: "",
        graphics: [],
        inputs: [],
        razorpay: {},
      });
      setBannerFile(null);
      setGraphicsFiles([]);
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Failed to save form. Please try again.");
    }
  };

  const handleBannerImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setBannerFile(e.target.files[0]);
    }

    //   if (e.target.files) {
    //     try {
    //         const fileUrl = await uploadFileToR2(e.target.files[0], 'onboarding', 'onboarding', 1);
    //         console.log('File uploaded successfully:', fileUrl);
    //         // onImageChange(fileUrl)
    //         // setImageFile(e.target.files[0])
    //     } catch (error) {
    //         console.error('Failed to upload file:', error);
    //         alert('Error uploading file');
    //     }
    // }
  };

  const handleDeleteOption = (index: number) => {
    setCurrentField((prev) => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index),
    }));
  };

  const handleEditField = (index: number) => {
    setEditIndex(index);
    setCurrentField(form.inputs[index]);
  };

  const handleDeleteField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      inputs: prev.inputs.filter((_, i) => i !== index),
    }));
  };

  // const handleDeleteBanner = () => {
  //   setBannerFile(null);
  //   setBannerPreview(null); // Clear the preview
  // };

  // const handleDeleteGraphic = (index: number) => {
  //   setGraphicsFiles((prev) => prev.filter((_, i) => i !== index)); // Remove specific file by index
  //   setGraphicsPreviews((prev) => prev.filter((_, i) => i !== index)); // Remove specific preview by index
  // };

  return (
    <div className="grid grid-cols-5">
      <div className="col-span-2 border-r justify-center items-center fixed flex w-2/5 h-full">
        {!bannerFile ? (
          <div className="flex flex-col items-center">
            <BiImageAdd size={64} className="mb-4 text-zinc-200" />
            <label
              htmlFor="banner-input-btn"
              className="flex cursor-pointer items-center border-zinc-800 pr-4 transition-all active:scale-90 font-medium text-sm border p-2 gap-2 rounded-full bg-zinc-800 hover:bg-white hover:text-black text-white"
            >
              <BiPlus size={24} />
              Add Banner Image
            </label>
          </div>
        ) : (
          <div className="w-full h-full relative text-zinc-800">
            <ImageWithLoader
              className="h-full w-full object-cover"
              src={URL.createObjectURL(bannerFile)}
              alt=""
            />
            <div className="flex gap-2 absolute bottom-4 right-4">
              <label
                htmlFor="banner-input-btn"
                className="flex pr-4  cursor-pointer items-center font-medium text-xs border p-2 gap-2 bg-white hover:bg-transparent transition-all hover:text-white text-zinc-800 border-white rounded-full"
              >
                <IoReload size={24} />
                Change Image
              </label>
              <label
                onClick={() => setBannerFile(null)}
                className="flex cursor-pointer  items-center font-medium text-xs border p-2 gap-2 rounded-full border-white bg-white hover:bg-red-500 hover:border-red-500 hover:text-white text-red-500"
              >
                <BiX size={24} />
              </label>
            </div>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          id="banner-input-btn"
          accept={"image/*"}
          onChange={handleBannerImageChange}
        />
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-3 p-8 mr-20 mt-16 ">
        <div className="w-[3rem] border gap-4 bg-white fixed top-1/2 -translate-y-1/2 right-8 shadow-lg rounded-full flex flex-col justify-start items-center py-8">
          <PiTextT
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <TbTextPlus
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <BiImageAdd
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <GoCheckbox
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <IoRadioButtonOn
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <RxDropdownMenu
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <BiFile
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4">Create Form</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Form Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="block w-full border px-3 py-2 mb-3"
          />
          <textarea
            placeholder="Form Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="block w-full border px-3 py-2 mb-3"
          />
          {/* <XImagesInput
            label="Graphics"
            accept="*"
            onImageChange={(urls) => {
              setForm({ ...form, graphics: urls });
            }}
          /> */}
          <div className="flex gap-2">
            {!withRazorpay ? (
              <button
                onClick={() => setWithRazorpay(true)}
                className="bg-green-600 hover:bg-green-700  text-white  flex justify-center items-center rounded-full py-2 px-4 gap-2 transition-all cursor-pointer active:scale-95"
              >
                <BiPlus />
                <p>Add Razorpay</p>
              </button>
            ) : (
              <button
                onClick={() => {
                  setWithRazorpay(false);
                  setForm({ ...form, razorpay: {} });
                }}
                className="bg-red-700 hover:bg-red-600  text-white  flex justify-center items-center rounded-full py-2 px-4 gap-2 transition-all cursor-pointer active:scale-95"
              >
                <BiMinus />
                <p>Remove Razorpay</p>
              </button>
            )}
          </div>
          {withRazorpay && (
            <div className="flex flex-col mt-4">
              <p className="text-sm mb-4 text-red-400">
                * To enable Razorpay functionality, ensure that fields with the
                keys email and password are created.
              </p>
              <input
                onChange={(e) =>
                  setForm({
                    ...form,
                    razorpay: { ...form.razorpay, keyId: e.target.value },
                  })
                }
                className="block w-full border px-3 py-2 mb-3"
                type="text"
                placeholder="Razorpay Key ID"
              />
              <input
                onChange={(e) =>
                  setForm({
                    ...form,
                    razorpay: { ...form.razorpay, appName: e.target.value },
                  })
                }
                className="block w-full border px-3 py-2 mb-3"
                type="text"
                placeholder="App Name"
              />
              <input
                onChange={(e) =>
                  setForm({
                    ...form,
                    razorpay: { ...form.razorpay, amount: e.target.value },
                  })
                }
                className="block w-full border px-3 py-2 mb-3"
                type="number"
                placeholder="Amount"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">
            {editIndex !== null ? "Edit Field" : "Add Form Field"}
          </h2>
          <select
            value={currentField.type}
            onChange={(e) =>
              setCurrentField({ ...currentField, type: e.target.value })
            }
            className="block w-full border px-3 py-2 mb-3"
          >
            <option value="text">Text</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="image">Image</option>
            <option value="description">Description</option>
            <option value="images">Images</option>
            <option value="file">File</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="dropdown">Dropdown</option>
            <option value="whatsappLink">WhatsApp Link</option>
          </select>
          <input
            type="text"
            placeholder="Field Label"
            value={currentField.label}
            onChange={(e) => {
              setCurrentField({ ...currentField, label: e.target.value });
              // setCurrentField({
              //   ...currentField,
              //   key: normalCaseToCamelCase(e.target.value),
              // });
            }}
            className="block w-full border px-3 py-2 mb-3"
          />
          <input
            type="text"
            placeholder="Field Key"
            value={currentField.key}
            onChange={(e) => {
              setCurrentField({
                ...currentField,
                key: e.target.value,
              });
            }}
            className="block w-full border px-3 py-2 mb-3"
          />
          {currentField.type === "text" && (
            <input
              type="text"
              placeholder="Placeholder"
              value={currentField.placeholder}
              onChange={(e) =>
                setCurrentField({
                  ...currentField,
                  placeholder: e.target.value,
                })
              }
              className="block w-full border px-3 py-2 mb-3"
            />
          )}

          {currentField.type === "whatsappLink" && (
            <input
              type="text"
              placeholder="WhatsApp Link"
              value={currentField.whatsappLink}
              onChange={(e) =>
                setCurrentField({
                  ...currentField,
                  whatsappLink: e.target.value,
                })
              }
              className="block w-full border px-3 py-2 mb-3"
            />
          )}
          <input
            type="text"
            placeholder="Info Text (Optional)"
            value={currentField.infoText}
            onChange={(e) =>
              setCurrentField({ ...currentField, infoText: e.target.value })
            }
            className="block w-full border px-3 py-2 mb-3"
          />
          <label className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              checked={currentField.required}
              onChange={(e) =>
                setCurrentField({ ...currentField, required: e.target.checked })
              }
            />
            <span>Required</span>
          </label>
          {["checkbox", "radio", "dropdown"].includes(currentField.type) && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Add Option"
                  value={currentOption}
                  onChange={(e) => setCurrentOption(e.target.value)}
                  className="block w-full border px-3 py-2 mb-2"
                />
                <button
                  onClick={handleAddOption}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Add Option
                </button>
              </div>
              <ul className="list-disc pl-6 mb-3">
                {currentField.options?.map((option, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {option}
                    <button
                      onClick={() => handleDeleteOption(index)}
                      className="text-red-500 ml-3"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            onClick={handleSaveField}
            className="bg-green-500 text-white px-3 py-2 rounded"
          >
            {editIndex !== null ? "Save Changes" : "Add Field"}
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Form Fields</h2>
          {form.inputs.length === 0 ? (
            <p>No fields added yet.</p>
          ) : (
            <ul className="list-disc pl-6">
              {form.inputs.map((field, index) => (
                <li key={index} className="mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong>{field.label}</strong> ({field.type})
                    </div>
                    <div>
                      <button
                        onClick={() => handleEditField(index)}
                        className="text-blue-500 mx-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteField(index)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Banner</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="block mb-3"
          />
          {bannerPreview && (
            <div className="mb-3">
              <img src={bannerPreview} alt="Banner Preview" className="w-full h-48 object-cover" />
              <button
                onClick={handleDeleteBanner}
                className="ml-3 text-red-500"
              >
                Delete
              </button>
            </div>
          )}
        </div> */}

        <button
          onClick={handleSaveForm}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Form
        </button>
      </div>
    </div>
  );
};

export default CreateFormPage;
