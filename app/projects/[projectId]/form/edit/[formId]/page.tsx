"use client";
import ImageWithLoader from "@/app/components/ImageWithLoader";
import XCheckboxEdit from "@/app/components/XCheckBoxEdit";
import XDateTimeFieldEdit from "@/app/components/XDateTimeFieldEdit";
import XDropdownEdit from "@/app/components/XDropdownEdit";
import XEmailInputEdit from "@/app/components/XEmailInputEdit";
import XFileInputEdit from "@/app/components/XFileInputEdit";
import XFilesInputEdit from "@/app/components/XFilesInputEdit";
import XImageInput from "@/app/components/XImageInput";
import XImageInputEdit from "@/app/components/XImageInputEdit";
import XImagesInput from "@/app/components/XImagesInput";
import XImagesInputEdit from "@/app/components/XImagesInputEdit";
import XPhoneInputEdit from "@/app/components/XPhoneInputEdit";
import XRadioEdit from "@/app/components/XRadioButtonEdit";
import XTextAreaEdit from "@/app/components/XTextAreaEdit";
import XTextInputEdit from "@/app/components/XTextInputEdit";
import XTooltip from "@/app/components/XTooltip";
import { normalCaseToCamelCase } from "@/app/utils/normalCaseToCamelCase";
import { uploadFileToR2 } from "@/app/utils/uploadFileToR2";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  BiArrowBack,
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
  LuFiles,
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
  sequence: number;
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

const EditFormPage: React.FC = () => {
  const params = useParams();
  const projectId = params?.projectId;
  const formId = params?.formId;

  const [loading, setLoading] = React.useState<boolean>(false);
  const [formSaveLoading, setFormSaveLoading] = React.useState<boolean>(false);
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

  const [existingForm, setExistingForm] = React.useState<FormType>({
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

  React.useEffect(() => {
    setForm((existingForm));
  }, [existingForm]);

  React.useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      if (!formId) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/form/project/${projectId}/form/${formId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch form with ID: ${formId}`);
        }

        const data = await response.json();
        setExistingForm(data.form);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching form data:", error);
        alert("Failed to fetch form data.");
      }
    };

    fetchForm();
  }, [formId]);

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
    sequence: 0,
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


  React.useEffect(() => {
    console.log(form);
    
  }, [form]);


  
  const handleSaveForm = async () => {
    try {
      setFormSaveLoading(true);
      let bannerUrl = "";

      if (bannerFile) {
        bannerUrl = await uploadFileToR2(
          bannerFile,
          "onboarding",
          "onboarding",
          5
        );
      }

      const finalForm = {
        ...form,
        banner: bannerUrl,
        graphics: form.graphics,
        project: projectId,
      };
      const token = localStorage.getItem("authToken");
      const integrationToken = localStorage.getItem("integrationToken");
      if (token) {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/form/${formId}`,
          finalForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Form Edited successfully:", response.data);
      } else {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/form/${formId}`,
          finalForm,
          {
            headers: {
              "x-integration-token": integrationToken,
            },
          }
        );
        console.log("Form Edited successfully:", response.data);
      }
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
      setFormSaveLoading(false);
      navigate.push(`/projects/${projectId}/form`);
    } catch (error) {
      setFormSaveLoading(false);
      console.error("Error saving form:", error);
      alert("Failed to save form. Please try again.");
    }
  };

  const reArrangeForInputs = () => {
    setForm((prev) => ({
      ...prev,
      inputs: prev.inputs.map((obj, index) => ({
        ...obj,
        sequence: index + 1,
      })),
    }));
  };

  const handleBannerImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setBannerFile(e.target.files[0]);
    }
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLLIElement>,
    index: number
  ) => {
    event.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const newItems = [...form.inputs];
      const draggedItem = newItems[draggedIndex];
      newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, draggedItem);

      // Update the sequence based on the new order
      const updatedItems = newItems.map((item, i) => ({
        ...item,
        sequence: i + 1,
      }));
      setForm((prev)=>({ ...prev, inputs: updatedItems }));
      setDraggedIndex(index);
    }
  };

  const handleEditField = (index: number) => {
    setEditIndex(index);
    setCurrentField(form.inputs[index]);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="flex justify-between h-screen overflow-hidden">
      <div onClick={()=>navigate.back()} className="bg-white h-12 active:scale-90 transition-all w-12 absolute top-6 left-6 flex justify-center items-center border rounded-full hover:bg-blue-600 hover:text-white cursor-pointer">
              <BiArrowBack  size={20}/>
            </div>
      <div className="col-span-2 w-2/5 border-r-2 justify-center items-center flex h-full border-dashed bg-gray-50">
        {!bannerFile && !form.banner ? (
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
              src={bannerFile ? URL.createObjectURL(bannerFile) : form.banner}
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
          <XTooltip text="Text Field" position="left">
            <TbForms
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
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
          </XTooltip>
          <XTooltip text="Phone Number Input" position="left">
            <LuSmartphone
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
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
          </XTooltip>

          <XTooltip text="Email Input Field" position="left">
            <LuMail
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
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
          </XTooltip>
          <XTooltip text="Dropdown List" position="left">
            <RiDropdownList
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
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
          </XTooltip>
          <XTooltip text="Text Description" position="left">
            <LuText
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
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
          </XTooltip>
          <XTooltip text="Radio Options (Single selection)" position="left">
            <CgRadioChecked
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
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
          </XTooltip>
          <XTooltip text="Checkbox Field (Multiple Selection)" position="left">
            <LuCheckCheck
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
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
          </XTooltip>
{/* 
          <XTooltip text="Date Selection Field" position="left">
            <BiCalendarEvent
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
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
          </XTooltip>
          <XTooltip text="Time Selection Field" position="left">
            <LuClock
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
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
          </XTooltip> */}

          <XTooltip text="Image Input Field (Single)" position="left">
            <LuImage
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
                      key: "image",
                      label: "Image",
                      type: "image",
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
          </XTooltip>
          <XTooltip text="Images Input Field (Multiple)" position="left">
            <LuImages
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
                      key: "images",
                      label: "Images",
                      type: "images",
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
          </XTooltip>
          <XTooltip text="File Input (Single)" position="left">
            <LuFile
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
                      key: "file",
                      label: "File",
                      type: "file",
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
          </XTooltip>
          <XTooltip text="File Input (Multiple)" position="left">
            <LuFiles
              onClick={() => {
                // Add new text Field
                setForm((prev) => ({
                  ...prev,
                  inputs: [
                    ...prev.inputs,
                    {
                      sequence: form.inputs.length + 1,
                      key: "files",
                      label: "Files",
                      type: "files",
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
          </XTooltip>
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

        <div className="mb-6 ">
          {form.inputs.length === 0 ? (
            <p></p>
          ) : (
            <ul className="list-none flex flex-col gap-8">
              {form.inputs
                // .sort((a, b) => a.sequence - b.sequence)
                .map((field, index) => 
                  
                  {
                    // console.log(field.sequence,index)
                    
                    return (
                      <li
                    key={field.sequence}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(event) => handleDragOver(event, index)}
                    onDragEnd={handleDragEnd}
                    className={` bg-white rounded-md cursor-pointer transition-all ${
                      draggedIndex === index
                        ? "opacity-50 scale-105 shadow-lg"
                        : ""
                    }`}
                  >
                    {field.type === "text" && (
                      <div className="">
                        <XTextInputEdit
                        required={field.required}
                          label={field.label}
                          infoText={field.infoText!}
                          placeholder={field.placeholder!}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                         required={field.required}
                          placeholder={field.placeholder!}
                          infoText={field.infoText!}
                          label={field.label}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                         required={field.required}
                          infoText={field.infoText!}
                          label={field.label}
                          placeholder={field.placeholder!}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                         required={field.required}
                          options={field.options? field.options : []}
                          selectedValue=""
                          label={field.label}
                          placeholder={field.placeholder!}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                         required={field.required}
                          infoText={field.infoText!}
                          label={field.label}
                          placeholder={field.placeholder!}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                         required={field.required}
                          options={field.options? field.options : []}
                          selectedValue=""
                          label={field.label}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                         required={field.required}
                          type="date"
                          value=""
                          placeholder={field.placeholder}
                          label={field.label}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                         required={field.required}
                          type="time"
                          value=""
                          placeholder={field.placeholder}
                          label={field.label}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                         required={field.required}
                          options={field.options? field.options : []}
                          selectedValues={[]}
                          label={field.label}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                    {field.type === "image" && (
                      <div className="" key={index}>
                        <XImageInputEdit
                         required={field.required}
                          label={field.label}
                          infoText={field.infoText!}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                    {field.type === "images" && (
                      <div className="" key={index}>
                        <XImagesInputEdit
                         required={field.required}
                          label={field.label}
                          infoText={field.infoText!}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                    {field.type === "file" && (
                      <div className="" key={index}>
                        <XFileInputEdit
                         required={field.required}
                          label={field.label}
                          infoText={field.infoText!}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                    {field.type === "files" && (
                      <div className="" key={index}>
                        <XFilesInputEdit
                         required={field.required}
                          label={field.label}
                          infoText={field.infoText!}
                          onDelete={() => {
                            setForm((prev) => ({
                              ...prev,
                              inputs: prev.inputs.filter((_, i) => i !== index),
                            }));
                            reArrangeForInputs();
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
                  </li>
                    )
                  }

                  
                )}
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
              onClick={() => {
                handleSaveForm();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white active:scale-95 px-2 py-2 pl-4 rounded-full flex items-center gap-1 text-sm"
            >
              <p>Save Form</p>
              {formSaveLoading ? (
                <div className="spinner-white ml-1"></div>
              ) : (
                <BiCheckCircle size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFormPage;
