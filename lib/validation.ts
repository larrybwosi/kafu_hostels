import { z } from "zod";
import {
  Role,
  BookingStatus,
  PaymentStatus,
  PaymentType,
} from "@prisma/client";

// User validation schemas
export const emergencyContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.string().min(1, "Relation is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
});

export const notificationPreferenceSchema = z.object({
  booking: z.boolean().default(true),
  payment: z.boolean().default(true),
  promotions: z.boolean().default(false),
  newsletter: z.boolean().default(false),
});

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  image: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  studentId: z.string().min(1, "Student ID is required"),
  role: z.nativeEnum(Role).default("USER"),
  emergencyContact: emergencyContactSchema,
  notificationPreferences: notificationPreferenceSchema.optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .optional(),
  image: z.string().optional(),
  address: z.string().min(1, "Address is required").optional(),
  emergencyContact: emergencyContactSchema.optional(),
  notificationPreferences: notificationPreferenceSchema.optional(),
});

// Hostel validation schemas
export const createHostelSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string().min(1, "Type is required"),
  rooms: z.number().int().positive("Rooms must be a positive integer"),
  roomCapacity: z
    .number()
    .int()
    .positive("Room capacity must be a positive integer"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  gender: z.string().min(1, "Gender is required"),
  price: z.number().positive("Price must be a positive number"),
  distance: z.string().optional(),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  contactWebsite: z.string().url("Invalid website URL").optional(),
  address: z.string().min(1, "Address is required"),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string().url("Invalid image URL"),
  images: z.array(z.string().url("Invalid image URL")),
  rules: z.array(z.string()),
  amenities: z.array(z.string()),
  featured: z.boolean().default(false),
  availability: z.string().min(1, "Availability is required"),
  wardenId: z.string().min(1, "Warden ID is required"),
});

export const updateHostelSchema = createHostelSchema.partial();

// Booking validation schema
export const createBookingSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  semester: z.string().optional(),
  hostelId: z.string().min(1, "Hostel ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

// Payment validation schemas
export const cardPaymentDetailsSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  last4: z.string().length(4, "Last 4 digits of card required"),
  brand: z.string().min(1, "Card brand is required"),
  expiryMonth: z.number().int().min(1).max(12, "Invalid expiry month"),
  expiryYear: z
    .number()
    .int()
    .min(new Date().getFullYear() % 100, "Card expired"),
});

export const mpesaPaymentDetailsSchema = z.object({
  transactionCode: z.string().min(1, "Transaction code is required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  accountReference: z.string().min(1, "Account reference is required"),
  merchantRequestId: z.string().optional(),
  checkoutRequestId: z.string().optional(),
});

export const createPaymentSchema = z
  .object({
    amount: z.number().positive("Amount must be a positive number"),
    currency: z.string().default("KES"),
    paymentMethod: z.nativeEnum(PaymentType),
    bookingId: z.string().min(1, "Booking ID is required"),
    userId: z.string().min(1, "User ID is required"),
    cardPayment: cardPaymentDetailsSchema.optional(),
    mpesaPayment: mpesaPaymentDetailsSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "CARD") {
        return !!data.cardPayment;
      } else if (data.paymentMethod === "MPESA") {
        return !!data.mpesaPayment;
      }
      return false;
    },
    {
      message: "Payment details are required based on the payment method",
      path: ["paymentDetails"],
    }
  );

// Review validation schema
export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
  hostelId: z.string().min(1, "Hostel ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

// Warden validation schema
export const createWardenSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
  image: z.string().optional(),
});

export const updateWardenSchema = createWardenSchema.partial();

// Export types for usage in functions
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateHostelInput = z.infer<typeof createHostelSchema>;
export type UpdateHostelInput = z.infer<typeof updateHostelSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateWardenInput = z.infer<typeof createWardenSchema>;
export type UpdateWardenInput = z.infer<typeof updateWardenSchema>;
