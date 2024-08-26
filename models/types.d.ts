import { Document, Types } from "mongoose";



export interface PatientDoc {
  fullname: string;
  phonenumber: string;
  email: string;
  gender: "female" | "male";
  emergency: string;
  dob: string;
  address: string;
  records?: Types.ObjectId[];
  info?: {
    bloodgroup: string;
    weight: string;
    height: string;
    allergies: string;
    habits: string;
    medicalhistory: string;
  };
}

interface MedDoc {
  medicine: Types.ObjectId;
  instruction: string;
  quantity: string;
  // dosage: "Morning" | "Afternoon" | "Evening";
}

export interface RecordDoc {
  patient: Types.ObjectId;
  complains: string;
  diagnosos: string;
  vitalsigns: string;
  treatment: Types.ObjectId[];
  medicine: MedDoc[];
}

export interface TreatmentDoc {
  name: string;
  description: string;
  status: boolean;
}

export interface MedicineDoc {
  name: string;
  measure: string;
  stock: number;
  des: sting;
}

export interface CampaignDoc {
  title: string;
  subject: string;

  message: string;
}
