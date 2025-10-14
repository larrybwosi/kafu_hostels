// schema.ts
import { z } from "zod/v3";

export const emergencyContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export const loginFormSchema = z.object({
  studentRegNo: z
    .string()
    .min(1, { message: "Student registration number is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  name: z.string().min(3, { message: "Name is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  idType: z.enum(["birth_certificate", "national_id"]),
  idNumber: z.string().min(1, { message: "ID number is required" }),
  gender: z.enum(["male", "female", "other"]),
  emergencyContact: emergencyContactSchema,
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  roomPreference: z.enum(["single", "shared"]),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
