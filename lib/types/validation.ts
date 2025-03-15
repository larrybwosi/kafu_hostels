// schema.ts
import { z } from "zod";

export const emergencyContactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  relationship: z.string().min(1, { message: "Relationship is required" }),
  contactNumber: z
    .string()
    .regex(/^\d{10,}$/, { message: "Enter a valid contact number" }),
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
  roomPreference: z.enum(["single", "shared"]),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
