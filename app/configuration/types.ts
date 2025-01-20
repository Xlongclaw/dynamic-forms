export interface BaseField {
    type: "text" | "image" | "file" | "checkbox" | "radio" | "dropdown";
    label: string;
    key: string;
    required?: boolean;
  }
  
  export interface TextField extends BaseField {
    type: "text";
    placeholder: string;
    infoText: string;
  }
  
  export interface ImageField extends BaseField {
    type: "image";
    accept: string;
  }
  
  export interface FileField extends BaseField {
    type: "file";
    accept: string;
    multiple?: boolean;
  }
  
  export interface CheckboxField extends BaseField {
    type: "checkbox";
    isSingle?: boolean;
    options: string[];
  }
  
  export interface RadioField extends BaseField {
    type: "radio";
    options: string[];
  }
  
  export interface DropdownField extends BaseField {
    type: "dropdown";
    options: string[];
    placeholder?: string;
  }
  
  export type FormField =
    | TextField
    | ImageField
    | FileField
    | CheckboxField
    | RadioField
    | DropdownField;
  