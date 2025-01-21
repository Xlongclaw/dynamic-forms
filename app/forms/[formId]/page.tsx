"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import XTextInput from "@/app/components/XTextInput";
import XImageInput from "@/app/components/XImageInput";
import XFileInput from "@/app/components/XFileInput";
import XCheckbox from "@/app/components/XCheckBox";
import XRadio from "@/app/components/XRadioButton";
import XDropdown from "@/app/components/XDropdown";
import Image from "next/image";
import toast from "react-hot-toast";
import FeedbackPage from "./FeedbackPage";
import ImageWithLoader from "@/app/components/ImageWithLoader";
import XImagesInput from "@/app/components/XImagesInput";
import XEmailInput from "@/app/components/XEmailInput";
import XPhoneInput from "@/app/components/XPhoneInput";
import XTextArea from "@/app/components/XTextArea";
import Link from "next/link";
import {
  BsArrowRight,
  BsChevronRight,
  BsInfoCircle,
  BsWhatsapp,
} from "react-icons/bs";
import XGraphicsDisplay from "@/app/components/XGraphicsDisplay";
import { BiChevronRight } from "react-icons/bi";

const Form = () => {
  const params = useParams(); // Access dynamic route parameters
  const formId = params?.formId; // Retrieve the formId parameter

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formTemplateData, setFormTemplateData] = useState<any>(null);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const [otherFiles, setOtherFiles] = useState<FileList | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = React.useState<boolean>(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // Access the base URL from environment variables

  // Fetch form fields from API
  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) return;

      try {
        console.log(API_BASE_URL);

        const response = await fetch(`${API_BASE_URL}/form/${formId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch form with ID: ${formId}`);
        }

        const data = await response.json();
        setFormFields(data.form.inputs);
        setFormTemplateData(data.form);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching form data:", error);
        alert("Failed to fetch form data.");
      }
    };

    fetchForm();
  }, [formId, API_BASE_URL]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const finalData = {
        ...formData,
      };
      console.log(finalData);
      console.log(`${API_BASE_URL}/response/${formId}/responses`);

      const response = await fetch(
        `${API_BASE_URL}/response/${formId}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      toast.success("Form submitted successfully!");
      setSubmitLoading(false);
      setSubmitted(true);
    } catch (error) {
      console.log(error);

      toast.error("Form submission failed. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <div className="spinner"></div>
        <p className="ml-4 text-lg font-semibold">Loading...</p>
      </div>
    );

  if (submitted === true) return <FeedbackPage />;

  return (
    <div className="w-screen flex overflow-hidden justify-center">
      {formTemplateData.banner && (
        <div className=" h-screen lg:w-2/5 w-1/2 lg:block hidden">
          <ImageWithLoader
            src={formTemplateData.banner}
            className="h-full"
            alt=""
          />
        </div>
      )}

      <div
        className={`col-span-3 ${
          !formTemplateData.banner || formTemplateData.banner == ""
            ? "w-full"
            : "lg:w-3/5"
        }  lg:p-8 md:p-6 sm:p-4 p-3 h-screen overflow-y-auto`}
      >
        {formTemplateData.bannerLandscape !== "" &&
          formTemplateData.bannerLandscape && (
            <ImageWithLoader
              alt=""
              src={formTemplateData.bannerLandscape}
              className="lg:hidden"
            />
          )}
        <form
          className="flex flex-col md:gap-8 gap-6 mx-auto justify-center items-center lg:mt-16 mt-8"
          onSubmit={handleSubmit}
        >
          {formTemplateData && (
            <div className="flex flex-col items-start xl:w-[40rem] w-full">
              <label className="lg:text-4xl md:text-3xl text-2xl lg:text-start text-center w-full mx-auto lg:leading-[3.5rem] lg:mx-0 font-semibold tracking-[1px] mb-4">
                {formTemplateData.title}
              </label>
              <p className="text-zinc-500 font-normal text-sm lg:text-start text-center leading-7 border-b pb-4">
                {formTemplateData.description}
              </p>
              <p className="my-4 bg-green-600 px-2 rounded-full text-white text-sm">
                Instructions
              </p>
              {formTemplateData.instructions.map((ins: string) => (
                <p className="text-sm leading-7" key={ins}>
                  {ins}
                </p>
              ))}
              <p className="text-red-500 text-sm py-4 border-b w-full">
                {" "}
                <strong>*</strong> Indicates required question
              </p>
              <XGraphicsDisplay imageArr={formTemplateData.graphics} />
            </div>
          )}

          {formFields.map((field) => {
            switch (field.type) {
              case "text":
                return (
                  <XTextInput
                    key={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    infoText={field.infoText}
                    required={field.required}
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                  />
                );

              case "email":
                return (
                  <XEmailInput
                    key={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    infoText={field.infoText}
                    required={field.required}
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                  />
                );
              case "phone":
                return (
                  <XPhoneInput
                    key={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    infoText={field.infoText}
                    required={field.required}
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                  />
                );
              case "description":
                return (
                  <XTextArea
                    key={field.key}
                    label={field.label}
                    placeholder={field.placeholder}
                    infoText={field.infoText}
                    required={field.required}
                    value={formData[field.key] || ""}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                  />
                );

              case "image":
                return (
                  <XImageInput
                    key={field.key}
                    label={field.label}
                    accept={field.accept}
                    onImageChange={(urls) => {
                      handleInputChange(field.key, urls![0]);
                    }}
                  />
                );

              case "images":
                return (
                  <XImagesInput
                    key={field.key}
                    label={field.label}
                    accept={field.accept}
                    onImageChange={(urls) => {
                      handleInputChange(field.key, urls);
                    }}
                  />
                );

              case "file":
                return (
                  <XFileInput
                    key={field.key}
                    label={field.label}
                    accept={field.accept}
                    multiple={field.multiple}
                    onFilesChange={(files) => {
                      setOtherFiles(files);
                      handleInputChange(field.key, files);
                    }}
                  />
                );

              case "checkbox":
                return (
                  <XCheckbox
                    key={field.key}
                    label={field.label}
                    isSingle={field.isSingle}
                    options={field.options}
                    selectedValues={
                      field.isSingle
                        ? formData[field.key]
                          ? [field.label]
                          : []
                        : formData[field.key] || []
                    }
                    onChange={(value, checked) => {
                      if (field.isSingle) {
                        handleInputChange(field.key, checked);
                      } else {
                        const updatedValues = checked
                          ? [...(formData[field.key] || []), value]
                          : (formData[field.key] || []).filter(
                              (item: string) => item !== value
                            );
                        handleInputChange(field.key, updatedValues);
                      }
                    }}
                  />
                );

              case "radio":
                return (
                  <XRadio
                    key={field.key}
                    label={field.label}
                    options={field.options}
                    selectedValue={formData[field.key] || ""}
                    onChange={(value) => handleInputChange(field.key, value)}
                  />
                );

              case "dropdown":
                return (
                  <XDropdown
                    required
                    key={field.key}
                    label={field.label}
                    options={field.options}
                    selectedValue={formData[field.key] || ""}
                    onChange={(value) => handleInputChange(field.key, value)}
                    placeholder={field.placeholder}
                  />
                );

              default:
                return null;
            }
          })}

          {/* Conclusion Message */}
          <div className="text-sm text-zinc-400 font-medium px-4">
            {formTemplateData.conclusionMessage}
          </div>

          <button
            type="submit"
            className="bg-blue-600 gap-4 flex py-3 px-8 xl:w-[40rem] w-full justify-between items-center sm:text-base text-sm rounded-full text-white hover:bg-blue-700"
          >
            <p></p>
            <p>Submit</p>

            {!submitLoading ? (
              <BsArrowRight size={20} />
            ) : (
              <div className="white-spinner"></div>
            )}
          </button>

          {formFields.map((field) => {
            switch (field.type) {
              case "whatsappLink":
                return (
                  <Link
                    className="bg-green-600 text-white flex justify-center items-center gap-2 xl:w-[40rem] w-full text-center py-3 rounded-full hover:bg-green-700 active:scale-95 transition-all"
                    key={field.key}
                    href={field.whatsappLink}
                  >
                    <BsWhatsapp size={20} />
                    <p className=" mt-[1px]">{field.label}</p>
                  </Link>
                );
            }
          })}
          <div className="xl:w-[40rem] w-full bg-zinc-700 text-white flex justify-center rounded-2xl p-8">
            <div className="flex items-start gap-2">
              <BsInfoCircle className="flex-shrink-0 mt-1" />
              <p className="text-sm">
                Do not submit confidential information such as credit card
                details, mobile and ATM PINs, OTPs, account passwords, etc.{" "}
                <span className="underline">Report Abuse</span>
              </p>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-sm font-medium text-zinc-800 mb-1">Powered by </p>
            <div>
              <p className="">
                {" "}
                <span className="font-bold text-3xl mr-2">Ricoz</span>
                <span className="font-medium">Forms</span>{" "}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
