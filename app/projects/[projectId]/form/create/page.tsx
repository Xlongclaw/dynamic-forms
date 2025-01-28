"use client";
import ImageWithLoader from "@/app/components/ImageWithLoader";
import XCheckboxEdit from "@/app/components/XCheckBoxEdit";
import XDateTimeFieldEdit from "@/app/components/XDateTimeFieldEdit";
import XDropdownEdit from "@/app/components/XDropdownEdit";
import XEmailInputEdit from "@/app/components/XEmailInputEdit";
import XImageInput from "@/app/components/XImageInput";
import XImagesInput from "@/app/components/XImagesInput";
import XPhoneInputEdit from "@/app/components/XPhoneInputEdit";
import XRadioEdit from "@/app/components/XRadioButtonEdit";
import XTextAreaEdit from "@/app/components/XTextAreaEdit";
import XTextInputEdit from "@/app/components/XTextInputEdit";
import { normalCaseToCamelCase } from "@/app/utils/normalCaseToCamelCase";
import { uploadFileToR2 } from "@/app/utils/uploadFileToR2";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  BiCalendar,
  BiCalendarEvent,
  BiCarousel,
  BiCheck,
  BiCheckCircle,
  BiFile,
  BiImage,
  BiImageAdd,
  BiImages,
  BiMinus,
  BiPlus,
  BiPlusCircle,
  BiSave,
  BiX,
  BiXCircle,
} from "react-icons/bi";
import {
  BsClock,
  BsPhone,
  BsSave,
  BsSave2,
  BsTextParagraph,
  BsThreeDots,
} from "react-icons/bs";
import { CgMail, CgRadioChecked, CgSwap, CgTemplate } from "react-icons/cg";
import { FaSave } from "react-icons/fa";
import { GoCheckbox } from "react-icons/go";
import { IoRadioButtonOn, IoReload } from "react-icons/io5";
import {
  LuCheckCheck,
  LuClock,
  LuFile,
  LuImage,
  LuImages,
  LuMail,
  LuSmartphone,
  LuText,
} from "react-icons/lu";
import { MdEmail } from "react-icons/md";
import { PiTextT } from "react-icons/pi";
import { RiDeleteBinFill, RiDropdownList, RiText } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { SiRazorpay } from "react-icons/si";
import { TbForms, TbTextPlus } from "react-icons/tb";
import { TiDelete, TiTime } from "react-icons/ti";

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
  project?: string;
}

const CreateFormPage: React.FC = () => {
  const params = useParams();
  const projectId = params?.projectId;

  const [form, setForm] = useState<FormType>({
    title: "Form Title",
    description: "From description",
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [selectedMenuOption, setSelectedMenuOption] = React.useState<
    string | null
  >(null);

  const navigate = useRouter();

  const handleDiscardForm = () => {
    setForm({
      title: "Form Title",
      description: "From description",
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
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, title: e.target.value });
    setBannerFile(null);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm({ ...form, description: e.target.value });
  };

  React.useEffect(() => {
    if (!isEditingTitle) {
      if (form.title === "") setForm({ ...form, title: "Untitled" });
    }
  }, [isEditingTitle]);

  React.useEffect(() => {
    if (!isEditingDescription) {
      if (form.description === "")
        setForm({ ...form, description: "No Description" });
    }
  }, [isEditingDescription]);

  React;

  React.useEffect(() => {
    console.log(form);
  }, [form]);

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
        project: projectId,
      };
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/form`,
        finalForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Form created successfully:", response.data);
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
      navigate.push("/forms");
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
  };



  const handleEditField = (index: number) => {
    setEditIndex(index);
    setCurrentField(form.inputs[index]);
  };


  return (
    <div className="flex justify-between h-screen overflow-hidden">
      <div className="col-span-2 w-2/5 border-r-2 justify-center items-center flex h-full border-dashed bg-gray-50">
        {!bannerFile ? (
          <div className="flex flex-col items-center">
            <BiImage size={128} className="mb-0 text-zinc-200" />
            <label
              htmlFor="banner-input-btn"
              className="flex cursor-pointer items-center  pr-4 transition-all active:scale-90 text-sm p-2 gap-1 rounded-full bg-blue-600 hover:bg-blue-700  text-white"
            >
              <BiPlusCircle size={20} />
              Add Banner Image
            </label>
            <p className="mt-4 text-sm font-medium text-gray-500">{`(Drag and drop your image here)`}</p>
          </div>
        ) : (
          <div className="w-full h-full relative text-zinc-800">
            <ImageWithLoader
              className="h-full w-full object-cover"
              src={URL.createObjectURL(bannerFile)}
              alt=""
            />
            <div className="flex gap-2 absolute bottom-20 z-20 left-4">
              <label
                onClick={() => setBannerFile(null)}
                className="flex cursor-pointer  items-center font-medium text-xs  p-2 gap-2 rounded-full  bg-blue-600 hover:bg-red-500 hover:border-red-500 hover:text-white text-white"
              >
                <RiDeleteBinFill size={16} />
                {/* <BiX size={24} /> */}
              </label>
              <label
                htmlFor="banner-input-btn"
                className="flex pr-4  cursor-pointer items-center font-medium text-xs  p-2 gap-1 bg-blue-600 hover:bg-blue-700 transition-all hover:text-white text-white border-white rounded-full"
              >
                <CgSwap size={24} />
                Change Image
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
      {/* <BannerImageComponent/> */}
      <div className="col-span-3 w-3/5 px-32 pr-52 pt-16 pb-8 h-[92.5vh] overflow-y-auto custom-scroll1">
        <div className="w-[3rem] border gap-4 bg-white fixed top-1/2 -translate-y-1/2 right-0 h-full shadow-lg flex flex-col justify-start items-center py-4">
          {/* Menu */}
          <div className="relative">
            <BiX
              onClick={() => {
                setMenuVisible((state) => !state);
                setSelectedMenuOption(null);
              }}
              size={32}
              onBlur={() => setMenuVisible(false)}
              className={`p-1.5 active:scale-90 hover:scale-110 rounded-full  ${
                menuVisible
                  ? "bg-blue-600 text-white "
                  : "hover:bg-gray-100 hidden"
              } cursor-pointer transition-all`}
            />
            <BsThreeDots
              onClick={() => {
                setMenuVisible((state) => !state);
                setSelectedMenuOption(null);
              }}
              size={32}
              onBlur={() => setMenuVisible(false)}
              className={`p-1.5 active:scale-90 hover:scale-110 rounded-full  ${
                menuVisible
                  ? "bg-blue-600 text-white hidden"
                  : "hover:bg-gray-100 "
              } cursor-pointer transition-all`}
            />
            <div
              className={`absolute bg-gray-50 right-12 top-0 transition-all border rounded-xl overflow-hidden ${
                menuVisible ? "opacity-100" : "pointer-events-none opacity-0 "
              }`}
            >
              {selectedMenuOption === null && (
                <>
                  <div
                    onClick={() => setSelectedMenuOption("integrate-razorpay")}
                    className="p-4 hover:bg-blue-600 hover:text-white cursor-pointer  flex text-sm gap-2 items-center font-medium text-gray-600 border-b"
                  >
                    <SiRazorpay size={16} />
                    <p className="text-nowrap">{`Integrate Razorpay`}</p>
                  </div>
                  <div className="p-4 hover:bg-blue-600 hover:text-white cursor-pointer  flex text-sm gap-2 items-center font-medium text-gray-600 border-b">
                    <CgTemplate size={16} />
                    <p className="text-nowrap">{`Change Template`}</p>
                  </div>
                  <div className="p-4 hover:bg-blue-600 hover:text-white cursor-pointer  flex text-sm gap-2 items-center font-medium text-gray-600">
                    <BiCarousel size={16} />
                    <p className="text-nowrap">{`Add Carousel`}</p>
                  </div>
                </>
              )}
              {selectedMenuOption === "integrate-razorpay" && (
                <div className="p-4 w-[20rem] transition-all">
                  <div className="p-4  cursor-pointer  flex text-sm gap-2 items-center font-medium text-gray-600 ">
                    <SiRazorpay size={16} />
                    <p className="text-nowrap">{`Integrate Razorpay`}</p>
                  </div>
                  {/* ----------------- */}
                  <input
                    value={form.razorpay.keyId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        razorpay: { ...form.razorpay, keyId: e.target.value },
                      })
                    }
                    className="block w-full border px-3 py-2 mb-3 text-sm font-medium focus:outline-blue-50"
                    type="text"
                    placeholder="Razorpay Key ID"
                  />
                  <input
                    value={form.razorpay.appName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        razorpay: { ...form.razorpay, appName: e.target.value },
                      })
                    }
                    className="block w-full border px-3 py-2 mb-3 text-sm font-medium focus:outline-blue-50"
                    type="text"
                    placeholder="App Name"
                  />
                  <input
                    value={form.razorpay.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        razorpay: { ...form.razorpay, amount: e.target.value },
                      })
                    }
                    className="block w-full border px-3 py-2 mb-3 text-sm font-medium focus:outline-blue-50"
                    type="number"
                    placeholder="Amount ₹"
                  />
                  <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full pr-4">
                    <BiCheck />
                    <p className="text-sm ">Save credentials</p>
                  </button>
                </div>
              )}
            </div>
          </div>
          <TbForms
            onClick={() => {
              // Add new text Field
              setForm((prev) => ({
                ...prev,
                inputs: [
                  ...prev.inputs,
                  {
                    key: "untitled",
                    label: "Label",
                    type: "text",
                    whatsappLink: "",
                    infoText: "Info Text",
                    placeholder: "Placeholder",
                  },
                ],
              }));
            }}
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <LuSmartphone
            onClick={() => {
              // Add new text Field
              setForm((prev) => ({
                ...prev,
                inputs: [
                  ...prev.inputs,
                  {
                    key: "phone",
                    label: "Phone Number",
                    type: "phone",
                    whatsappLink: "",
                    infoText: "Info Text",
                    placeholder: "Placeholder",
                  },
                ],
              }));
            }}
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <LuMail
            onClick={() => {
              // Add new text Field
              setForm((prev) => ({
                ...prev,
                inputs: [
                  ...prev.inputs,
                  {
                    key: "emailAddress",
                    label: "Email Address",
                    type: "email",
                    whatsappLink: "",
                    infoText: "Info Text",
                    placeholder: "Placeholder",
                  },
                ],
              }));
            }}
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <RiDropdownList
            onClick={() => {
              // Add new text Field
              setForm((prev) => ({
                ...prev,
                inputs: [
                  ...prev.inputs,
                  {
                    key: "dropdown",
                    label: "DropDown",
                    type: "dropdown",
                    whatsappLink: "",
                    infoText: "Info Text",
                    placeholder: "Placeholder",
                  },
                ],
              }));
            }}
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <LuText
            onClick={() => {
              // Add new text Field
              setForm((prev) => ({
                ...prev,
                inputs: [
                  ...prev.inputs,
                  {
                    key: "description",
                    label: "Description",
                    type: "description",
                    whatsappLink: "",
                    infoText: "Info Text",
                    placeholder: "Placeholder",
                  },
                ],
              }));
            }}
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <CgRadioChecked
            onClick={() => {
              // Add new text Field
              setForm((prev) => ({
                ...prev,
                inputs: [
                  ...prev.inputs,
                  {
                    key: "radio",
                    label: "Label",
                    type: "radio",
                    whatsappLink: "",
                    infoText: "Info Text",
                    placeholder: "Placeholder",
                  },
                ],
              }));
            }}
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <BiCalendarEvent
            onClick={() => {
              // Add new text Field
              setForm((prev) => ({
                ...prev,
                inputs: [
                  ...prev.inputs,
                  {
                    key: "date",
                    label: "Label",
                    type: "date",
                    whatsappLink: "",
                    infoText: "Info Text",
                    placeholder: "Placeholder",
                  },
                ],
              }));
            }}
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <LuClock
            onClick={() => {
              // Add new text Field
              setForm((prev) => ({
                ...prev,
                inputs: [
                  ...prev.inputs,
                  {
                    key: "time",
                    label: "Label",
                    type: "time",
                    whatsappLink: "",
                    infoText: "Info Text",
                    placeholder: "Placeholder",
                  },
                ],
              }));
            }}
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <LuCheckCheck
            onClick={() => {
              // Add new text Field
              setForm((prev) => ({
                ...prev,
                inputs: [
                  ...prev.inputs,
                  {
                    key: "checkbox",
                    label: "Label",
                    type: "checkbox",
                    whatsappLink: "",
                    infoText: "Info Text",
                    placeholder: "Placeholder",
                  },
                ],
              }));
            }}
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded-full hover:bg-zinc-100 cursor-pointer transition-all"
          />

          <LuImage
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <LuImages
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded hover:bg-zinc-100 cursor-pointer transition-all"
          />
          <LuFile
            size={32}
            className="p-1.5 active:scale-90 hover:scale-110 rounded hover:bg-zinc-100 cursor-pointer transition-all"
          />
        </div>

        <div className="flex flex-col items-start">
          <div className="bg-gray-50 text-gray-300 p-4 w-full rounded-2xl border-2 border-dashed flex gap-8 mb-6 items-center">
            <div>
              <BiImageAdd size={128} />
            </div>
            <div>
              <p className="text-gray-600 text-lg font-medium">
                Drag and drop your landscape banner image here
              </p>
              <p className="text-sm text-gray-400">
                Your Banner Image (Landscape) must be a PNG or JPEG, up to 1 MB,
                of any size.
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="mb-3">
            {isEditingTitle ? (
              <input
                type="text"
                spellCheck={false}
                placeholder="Form Title"
                value={form.title}
                onChange={handleTitleChange}
                className="lg:text-4xl md:text-3xl outline-none focus: text-2xl lg:text-start text-center w-full mx-auto lg:leading-[3.5rem] lg:mx-0 font-semibold  mb-1"
                onBlur={() => setIsEditingTitle(false)} // Exit edit mode when blurred
                autoFocus // Automatically focus the input
              />
            ) : (
              <p
                className="lg:text-4xl md:text-3xl text-2xl lg:text-start text-center mx-auto lg:leading-[3.5rem] lg:mx-0 font-semibold  mb-1"
                onClick={() => setIsEditingTitle(true)} // Enter edit mode when clicked
              >
                {form.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="pb-3 mb-3 w-full flex flex-col items-start">
            {isEditingDescription ? (
              <textarea
                placeholder="Form Description"
                value={form.description}
                onChange={handleDescriptionChange}
                className="text-gray-500 font-medium tracking-[1px] text-sm lg:text-start text-center leading-7  pb-4 w-full"
                onBlur={() => setIsEditingDescription(false)} // Exit edit mode when blurred
                autoFocus
              />
            ) : (
              <p
                className="text-gray-500 font-medium tracking-[1px] text-sm lg:text-start text-center leading-7  pb-4"
                onClick={() => setIsEditingDescription(true)} // Enter edit mode when clicked
              >
                {form.description}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          {/* <XImageInput
            label="Banner Image (Landscape)"
            accept="*"
            onImageChange={(url) => {
              console.log(url);
            }}
          /> */}

          {/* <XImagesInput
            label="Graphics"
            accept="*"
            onImageChange={(urls) => {
              setForm({ ...form, graphics: urls });
            }}
          /> */}
        </div>

        {/* <div className="mb-6">
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
        </div> */}

        <div className="mb-6 ">
          {form.inputs.length === 0 ? (
            <p></p>
          ) : (
            <ul className="list-disc flex flex-col gap-8">
              {form.inputs.map((field, index) => (
                <div key={`FIELD_${index}`}>
                  {field.type === "text" && (
                    <div className="" key={index}>
                      <XTextInputEdit
                        label={field.label}
                        infoText={field.infoText!}
                        placeholder={field.placeholder!}
                        onDelete={() => {
                          setForm((prev) => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index),
                          }));
                        }}
                        onChange={(fieldKey, value) => {
                          handleEditField(index);
                          console.log(fieldKey, value);
                          if (
                            fieldKey === "label" &&
                            typeof value === "string"
                          ) {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? {
                                        ...input,
                                        key: normalCaseToCamelCase(value),
                                        label: value,
                                      }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          } else {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? { ...input, [fieldKey]: value }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          }

                          // Reset edit index if necessary
                          if (editIndex !== null) {
                            setEditIndex(null);
                          }
                        }}
                      />
                    </div>
                  )}
                  {field.type === "phone" && (
                    <div>
                      <XPhoneInputEdit
                        placeholder={field.placeholder!}
                        infoText={field.infoText!}
                        label={field.label}
                        onDelete={() => {
                          setForm((prev) => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index),
                          }));
                        }}
                        onChange={(fieldKey, value) => {
                          handleEditField(index);
                          console.log(fieldKey, value);
                          if (
                            fieldKey === "label" &&
                            typeof value === "string"
                          ) {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? {
                                        ...input,
                                        key: normalCaseToCamelCase(value),
                                        label: value,
                                      }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          } else {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? { ...input, [fieldKey]: value }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          }

                          // Reset edit index if necessary
                          if (editIndex !== null) {
                            setEditIndex(null);
                          }
                        }}
                      />
                    </div>
                  )}
                  {field.type === "email" && (
                    <div>
                      <XEmailInputEdit
                        infoText={field.infoText!}
                        label={field.label}
                        placeholder={field.placeholder!}
                        onDelete={() => {
                          setForm((prev) => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index),
                          }));
                        }}
                        onChange={(fieldKey, value) => {
                          handleEditField(index);
                          console.log(fieldKey, value);
                          if (
                            fieldKey === "label" &&
                            typeof value === "string"
                          ) {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? {
                                        ...input,
                                        key: normalCaseToCamelCase(value),
                                        label: value,
                                      }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          } else {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? { ...input, [fieldKey]: value }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          }

                          // Reset edit index if necessary
                          if (editIndex !== null) {
                            setEditIndex(null);
                          }
                        }}
                      />
                    </div>
                  )}
                  {field.type === "dropdown" && (
                    <div>
                      <XDropdownEdit
                        options={[]}
                        selectedValue=""
                        label={field.label}
                        placeholder={field.placeholder!}
                        onDelete={() => {
                          setForm((prev) => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index),
                          }));
                        }}
                        onChange={(fieldKey, value) => {
                          handleEditField(index);
                          console.log(fieldKey, value);
                          if (
                            fieldKey === "label" &&
                            typeof value === "string"
                          ) {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? {
                                        ...input,
                                        key: normalCaseToCamelCase(value),
                                        label: value,
                                      }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          } else {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? { ...input, [fieldKey]: value }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          }

                          // Reset edit index if necessary
                          if (editIndex !== null) {
                            setEditIndex(null);
                          }
                        }}
                      />
                    </div>
                  )}
                  {field.type === "description" && (
                    <div>
                      <XTextAreaEdit
                        infoText={field.infoText!}
                        label={field.label}
                        placeholder={field.placeholder!}
                        onDelete={() => {
                          setForm((prev) => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index),
                          }));
                        }}
                        onChange={(fieldKey, value) => {
                          handleEditField(index);
                          console.log(fieldKey, value);
                          if (
                            fieldKey === "label" &&
                            typeof value === "string"
                          ) {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? {
                                        ...input,
                                        key: normalCaseToCamelCase(value),
                                        label: value,
                                      }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          } else {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? { ...input, [fieldKey]: value }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          }

                          // Reset edit index if necessary
                          if (editIndex !== null) {
                            setEditIndex(null);
                          }
                        }}
                      />
                    </div>
                  )}
                  {field.type === "radio" && (
                    <div>
                      <XRadioEdit
                        options={[]}
                        selectedValue=""
                        label={field.label}
                        onDelete={() => {
                          setForm((prev) => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index),
                          }));
                        }}
                        onChange={(fieldKey, value) => {
                          handleEditField(index);
                          console.log(fieldKey, value);
                          if (
                            fieldKey === "label" &&
                            typeof value === "string"
                          ) {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? {
                                        ...input,
                                        key: normalCaseToCamelCase(value),
                                        label: value,
                                      }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          } else {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? { ...input, [fieldKey]: value }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          }

                          // Reset edit index if necessary
                          if (editIndex !== null) {
                            setEditIndex(null);
                          }
                        }}
                      />
                    </div>
                  )}
                  {field.type === "date" && (
                    <div>
                      <XDateTimeFieldEdit
                        type="date"
                        value=""
                        placeholder={field.placeholder}
                        label={field.label}
                        onDelete={() => {
                          setForm((prev) => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index),
                          }));
                        }}
                        onChange={(fieldKey, value) => {
                          handleEditField(index);
                          console.log(fieldKey, value);
                          if (
                            fieldKey === "label" &&
                            typeof value === "string"
                          ) {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? {
                                        ...input,
                                        key: normalCaseToCamelCase(value),
                                        label: value,
                                      }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          } else {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? { ...input, [fieldKey]: value }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          }

                          // Reset edit index if necessary
                          if (editIndex !== null) {
                            setEditIndex(null);
                          }
                        }}
                      />
                    </div>
                  )}
                  {field.type === "time" && (
                    <div>
                      <XDateTimeFieldEdit
                        type="time"
                        value=""
                        placeholder={field.placeholder}
                        label={field.label}
                        onDelete={() => {
                          setForm((prev) => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index),
                          }));
                        }}
                        onChange={(fieldKey, value) => {
                          handleEditField(index);
                          console.log(fieldKey, value);
                          if (
                            fieldKey === "label" &&
                            typeof value === "string"
                          ) {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? {
                                        ...input,
                                        key: normalCaseToCamelCase(value),
                                        label: value,
                                      }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          } else {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? { ...input, [fieldKey]: value }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          }

                          // Reset edit index if necessary
                          if (editIndex !== null) {
                            setEditIndex(null);
                          }
                        }}
                      />
                    </div>
                  )}
                  {field.type === "checkbox" && (
                    <div>
                      <XCheckboxEdit
                        options={[]}
                        selectedValues={[]}
                        label={field.label}
                        onDelete={() => {
                          setForm((prev) => ({
                            ...prev,
                            inputs: prev.inputs.filter((_, i) => i !== index),
                          }));
                        }}
                        onChange={(fieldKey, value) => {
                          handleEditField(index);
                          console.log(fieldKey, value);
                          if (
                            fieldKey === "label" &&
                            typeof value === "string"
                          ) {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? {
                                        ...input,
                                        key: normalCaseToCamelCase(value),
                                        label: value,
                                      }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          } else {
                            setForm((prev) => {
                              const updatedInputs = prev.inputs.map(
                                (input, idx) =>
                                  idx === index
                                    ? { ...input, [fieldKey]: value }
                                    : input
                              );
                              return {
                                ...prev,
                                inputs: updatedInputs,
                              };
                            });
                          }

                          // Reset edit index if necessary
                          if (editIndex !== null) {
                            setEditIndex(null);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </ul>
          )}
        </div>
        <div className="fixed bottom-0 w-full h-16 border-t bg-white left-0 flex items-center px-8 gap-2 justify-between">
          <div>
            {/* integrations */}
            <div className=" flex flex-col items-start text-white">
              {form.razorpay.keyId !== "" && (
                <div className="bg-green-700 py-1.5 pl-3 pr-2 flex gap-2 rounded-full items-center">
                  <SiRazorpay />
                  <p className="text-xs font-medium">Razorpay Integrated</p>
                  <BiX
                    onClick={() => {
                      setWithRazorpay(false);
                      setForm({
                        ...form,
                        razorpay: {
                          keyId: "",
                        },
                      });
                    }}
                    className="hover:bg-white p-0.5 rounded-full hover:text-red-600"
                    size={24}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDiscardForm()}
              className="text-sm font-medium text-blue-700 flex items-center gap-1 hover:bg-blue-100 py-2 rounded-full px-4"
            >
              <p>Discard Form</p>
            </button>
            <button
              onClick={handleSaveForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 pl-4 rounded-full flex items-center gap-1 text-sm"
            >
              <p>Save Form</p>
              <BiCheckCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFormPage;
