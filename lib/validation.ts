import * as z from "zod";

// ==================== ZOD SCHEMAS ====================

// User schemas
const UserRoleEnum = z.enum(["USER", "ADMIN", "WARDEN"]);

export const UserCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
  phone: z.string(),
  profileImage: z.string().url(),
  address: z.string(),
  studentId: z.string(),
  emergencyContactName: z.string(),
  emergencyContactRelation: z.string(),
  emergencyContactPhone: z.string(),
  role: UserRoleEnum.optional(),
  notificationBooking: z.boolean().optional(),
  notificationPayment: z.boolean().optional(),
  notificationPromotions: z.boolean().optional(),
  notificationNewsletter: z.boolean().optional(),
  preferredLanguage: z.string().optional(),
  preferQuietHours: z.boolean().optional(),
});

export const UserUpdateSchema = UserCreateSchema.partial()
  .omit({ password: true })
  .extend({
    password: z.string().min(6).optional(),
  });

// Hostel schemas
export const HostelCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  type: z.string(),
  rooms: z.number().int().positive(),
  roomCapacity: z.number().int().positive(),
  capacity: z.number().int().positive(),
  gender: z.string(),
  price: z.number().positive(),
  distance: z.string().optional(),
  imageUrl: z.string().url(),
  availability: z.string(),
  images: z.array(z.string().url()),
  featured: z.boolean().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  contactWebsite: z.string().url().optional(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  wardenName: z.string(),
  wardenPhone: z.string(),
  wardenImage: z.string().url(),
  rules: z.array(z.string()),
});

const HostelUpdateSchema = HostelCreateSchema.partial();

// Amenity schemas
const AmenityCreateSchema = z.object({
  name: z.string().min(1),
  icon: z.string(),
});

export const AmenityUpdateSchema = AmenityCreateSchema.partial();

// Booking schemas
export const BookingStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);
export const PaymentStatusEnum = z.enum([
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
  "REFUNDED",
]);

export const BookingCreateSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  status: BookingStatusEnum.optional(),
  totalAmount: z.number().positive(),
  paymentStatus: PaymentStatusEnum.optional(),
  semester: z.string().optional(),
  hostelId: z.string(),
  userId: z.string(),
  currentUserId: z.string().optional(),
});

export const BookingUpdateSchema = BookingCreateSchema.partial();

// Review schemas
export const ReviewCreateSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  hostelId: z.string(),
  userId: z.string(),
});

export const ReviewUpdateSchema = ReviewCreateSchema.partial();

// Payment Method schemas
export const PaymentMethodCreateSchema = z.object({
  type: z.string(),
  last4: z.string().length(4),
  expiryDate: z.string(),
  brand: z.string(),
  isDefault: z.boolean().optional(),
  userId: z.string(),
});

const PaymentMethodUpdateSchema = PaymentMethodCreateSchema.partial();

// ==================== Types based on Zod schemas ====================

export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export type HostelCreate = z.infer<typeof HostelCreateSchema>;
export type HostelUpdate = z.infer<typeof HostelUpdateSchema>;

export type AmenityCreate = z.infer<typeof AmenityCreateSchema>;
export type AmenityUpdate = z.infer<typeof AmenityUpdateSchema>;

export type BookingCreate = z.infer<typeof BookingCreateSchema>;
export type BookingUpdate = z.infer<typeof BookingUpdateSchema>;

export type ReviewCreate = z.infer<typeof ReviewCreateSchema>;
export type ReviewUpdate = z.infer<typeof ReviewUpdateSchema>;

export type PaymentMethodCreate = z.infer<typeof PaymentMethodCreateSchema>;
export type PaymentMethodUpdate = z.infer<typeof PaymentMethodUpdateSchema>;
