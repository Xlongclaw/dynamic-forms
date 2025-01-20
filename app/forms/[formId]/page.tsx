"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import XTextInput from "@/app/components/XTextInput";
import XImageInput from "@/app/components/XImageInput";
import XFileInput from "@/app/components/XFileInput";
import XCheckbox from "@/app/components/XCheckBox";
import XRadio from "@/app/components/XRadioButton";
import XDropdown from "@/app/components/XDropdown";
import { uploadFileToR2 } from "@/app/utils/uploadFileToR2";
import Image from "next/image";
import toast from "react-hot-toast";
import { BsCheck2Circle } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
import FeedbackPage from "./FeedbackPage";

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
      setSubmitted(true);
    } catch (error) {
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
    <div className="grid grid-cols-5">
      <div className="col-span-2 bg-black"></div>
      <Image
        width={1000}
        height={1000}
        src={formTemplateData.banner || ""}
        className="h-full fixed col-span-1 flex-1 bg-black w-2/5 object-top object-cover"
        alt=""
      />

      <div className="col-span-3 p-8 flex-1">
        <form
          className="flex flex-col gap-8 mx-auto justify-center items-center mt-16"
          onSubmit={handleSubmit}
        >
          {formTemplateData && (
            <div className="flex flex-col items-start w-[40rem]">
              <label className="text-4xl font-semibold tracking-[1px] mb-4">
                {formTemplateData.title}
              </label>
              <p className="text-zinc-500 font-normal text-sm leading-7 border-b pb-4">
                {formTemplateData.description}
              </p>
              <p className="my-4 bg-green-600 px-2 rounded-full text-white text-sm">
                Instructions
              </p>
              {formTemplateData.instructions.map((ins: string, i: number) => (
                <p className="text-sm leading-7" key={ins}>
                  {ins}
                </p>
              ))}
              <p className="text-red-500 text-sm py-4 border-b w-full">
                {" "}
                <strong>*</strong> Indicates required question
              </p>
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

              case "image":
                return (
                  <XImageInput
                    key={field.key}
                    label={field.label}
                    accept={field.accept}
                    onImageChange={(url) => {
                      setImageUrl(url);
                      handleInputChange(field.key, url);
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
          <button
            type="submit"
            className="bg-blue-500 w-[40rem] py-3 rounded-md text-white hover:bg-blue-700"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
