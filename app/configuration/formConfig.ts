import { FormField } from "./types";

interface FormType {
  title: string,
  description: string,
  instructions: string[],
  banner: string,
  graphics: string[],
  inputs: FormField[]
}

const forms: FormType[] =
  [
    {
      title: "",
      description: "",
      instructions: ["1. ashdg", "2. asjdkh"],
      banner: "Imagurl",
      graphics: ["Image Url 1", "imgurl 2"],
      inputs: [
        {
          type: "text",
          label: "Brand Name",
          placeholder: "Enter Brand Name",
          infoText: "Accept payments via 100+ modes",
          required: true,
          key: "brandName",
        },
        {
          type: "text",
          label: "Business Name",
          placeholder: "Enter Business Name",
          infoText: "Accept payments via 100+ modes",
          required: true,
          key: "businessName",
        },
        {
          type: "text",
          label: "Busine",
          placeholder: "Enter Business Name",
          infoText: "Accept payments via 100+ modes",
          required: true,
          key: "busine",
        },
        {
          type: "text",
          label: "Contact Number",
          placeholder: "+91 123456 789",
          infoText: "Accept payments via 100+ modes",
          required: true,
          key: "contactNumber",
        },
        {
          type: "text",
          label: "Email",
          placeholder: "abc@gmail.com",
          infoText: "Accept payments via 100+ modes",
          required: true,
          key: "email",
        },
        {
          type: "text",
          label: "State",
          placeholder: "LA",
          infoText: "Accept payments via 100+ modes",
          required: true,
          key: "state",
        },
        {
          type: "text",
          label: "City",
          placeholder: "New York",
          infoText: "Accept payments via 100+ modes",
          required: true,
          key: "city",
        },
        {
          type: "image",
          label: "Upload Profile Picture",
          accept: "image/*",
          key: "imageFile",
        },
        {
          type: "file",
          label: "Upload Other Files",
          accept: ".pdf,.docx,.txt,.jpg,.png",
          multiple: true,
          key: "otherFiles",
        },
        {
          type: "checkbox",
          label: "I agree to the terms and conditions",
          isSingle: true,
          options: [],
          key: "isChecked",
        },
        {
          type: "checkbox",
          label: "Select your hobbies",
          options: ["Reading", "Traveling", "Cooking", "Gaming"],
          key: "selectedOptions",
        },
        {
          type: "radio",
          label: "Select an option",
          options: ["Option 1", "Option 2", "Option 3"],
          key: "selectedRadio",
        },
        {
          type: "dropdown",
          label: "Choose a fruit",
          options: ["Apple", "Banana", "Cherry", "Date"],
          key: "selectedDropdown",
        },
      ]
    }
  ]

export default forms[0].inputs;
