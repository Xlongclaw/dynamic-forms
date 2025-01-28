import { Document, Types } from "mongoose";
export interface IntegrationKey {
  for: string;
  key: string;
}

export interface IProject extends Document {
  projectName: string;
  projectDescription: string;
  integrationKeys: IntegrationKey[];
  forms: Types.ObjectId[]; // Array of ObjectIds referencing the 'Form' model
  createdAt: Date;
  updatedAt: Date;
}
