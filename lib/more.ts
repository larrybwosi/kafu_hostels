// import { PrismaClient } from "@prisma/client";
// import { z } from "zod";

// const prisma = new PrismaClient();

// // ==================== ZOD SCHEMAS ====================

// // User schemas
// const UserRoleEnum = z.enum(["USER", "ADMIN", "WARDEN"]);

// const UserCreateSchema = z.object({
//   email: z.string().email(),
//   name: z.string().min(1),
//   password: z.string().min(6),
//   phone: z.string(),
//   profileImage: z.string().url(),
//   address: z.string(),
//   studentId: z.string(),
//   emergencyContactName: z.string(),
//   emergencyContactRelation: z.string(),
//   emergencyContactPhone: z.string(),
//   role: UserRoleEnum.optional(),
//   notificationBooking: z.boolean().optional(),
//   notificationPayment: z.boolean().optional(),
//   notificationPromotions: z.boolean().optional(),
//   notificationNewsletter: z.boolean().optional(),
//   preferredLanguage: z.string().optional(),
//   preferQuietHours: z.boolean().optional(),
// });

// const UserUpdateSchema = UserCreateSchema.partial()
//   .omit({ password: true })
//   .extend({
//     password: z.string().min(6).optional(),
//   });

// // Hostel schemas
// const HostelCreateSchema = z.object({
//   name: z.string().min(1),
//   description: z.string(),
//   type: z.string(),
//   rooms: z.number().int().positive(),
//   roomCapacity: z.number().int().positive(),
//   capacity: z.number().int().positive(),
//   gender: z.string(),
//   price: z.number().positive(),
//   distance: z.string().optional(),
//   imageUrl: z.string().url(),
//   availability: z.string(),
//   images: z.array(z.string().url()),
//   featured: z.boolean().optional(),
//   contactEmail: z.string().email(),
//   contactPhone: z.string(),
//   contactWebsite: z.string().url().optional(),
//   address: z.string(),
//   latitude: z.number(),
//   longitude: z.number(),
//   wardenName: z.string(),
//   wardenPhone: z.string(),
//   wardenImage: z.string().url(),
//   rules: z.array(z.string()),
// });

// const HostelUpdateSchema = HostelCreateSchema.partial();

// // Amenity schemas
// const AmenityCreateSchema = z.object({
//   name: z.string().min(1),
//   icon: z.string(),
// });

// const AmenityUpdateSchema = AmenityCreateSchema.partial();

// // Booking schemas
// const BookingStatusEnum = z.enum([
//   "PENDING",
//   "CONFIRMED",
//   "CANCELLED",
//   "COMPLETED",
// ]);
// const PaymentStatusEnum = z.enum([
//   "UNPAID",
//   "PARTIALLY_PAID",
//   "PAID",
//   "REFUNDED",
// ]);

// const BookingCreateSchema = z.object({
//   startDate: z.date(),
//   endDate: z.date(),
//   status: BookingStatusEnum.optional(),
//   totalAmount: z.number().positive(),
//   paymentStatus: PaymentStatusEnum.optional(),
//   semester: z.string().optional(),
//   hostelId: z.string(),
//   userId: z.string(),
//   currentUserId: z.string().optional(),
// });

// const BookingUpdateSchema = BookingCreateSchema.partial();

// // Review schemas
// const ReviewCreateSchema = z.object({
//   rating: z.number().min(1).max(5),
//   comment: z.string().optional(),
//   hostelId: z.string(),
//   userId: z.string(),
// });

// const ReviewUpdateSchema = ReviewCreateSchema.partial();

// // Payment Method schemas
// const PaymentMethodCreateSchema = z.object({
//   type: z.string(),
//   last4: z.string().length(4),
//   expiryDate: z.string(),
//   brand: z.string(),
//   isDefault: z.boolean().optional(),
//   userId: z.string(),
// });

// const PaymentMethodUpdateSchema = PaymentMethodCreateSchema.partial();

// // ==================== Types based on Zod schemas ====================

// type UserCreate = z.infer<typeof UserCreateSchema>;
// type UserUpdate = z.infer<typeof UserUpdateSchema>;

// type HostelCreate = z.infer<typeof HostelCreateSchema>;
// type HostelUpdate = z.infer<typeof HostelUpdateSchema>;

// type AmenityCreate = z.infer<typeof AmenityCreateSchema>;
// type AmenityUpdate = z.infer<typeof AmenityUpdateSchema>;

// type BookingCreate = z.infer<typeof BookingCreateSchema>;
// type BookingUpdate = z.infer<typeof BookingUpdateSchema>;

// type ReviewCreate = z.infer<typeof ReviewCreateSchema>;
// type ReviewUpdate = z.infer<typeof ReviewUpdateSchema>;

// type PaymentMethodCreate = z.infer<typeof PaymentMethodCreateSchema>;
// type PaymentMethodUpdate = z.infer<typeof PaymentMethodUpdateSchema>;

// // ==================== USER CRUD FUNCTIONS ====================

// export async function createUser(data: UserCreate) {
//   const validatedData = UserCreateSchema.parse(data);
//   return prisma.user.create({
//     data: validatedData,
//   });
// }

// export async function getUsers(skip?: number, take?: number) {
//   return prisma.user.findMany({
//     skip: skip || 0,
//     take: take || 50,
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }

// export async function getUserById(id: string) {
//   return prisma.user.findUnique({
//     where: { id },
//     include: {
//       currentBooking: true,
//       previousBookings: true,
//       paymentMethods: true,
//       reviews: true,
//     },
//   });
// }

// export async function getUserByEmail(email: string) {
//   return prisma.user.findUnique({
//     where: { email },
//   });
// }

// export async function updateUser(id: string, data: UserUpdate) {
//   const validatedData = UserUpdateSchema.parse(data);
//   return prisma.user.update({
//     where: { id },
//     data: validatedData,
//   });
// }

// export async function deleteUser(id: string) {
//   return prisma.user.delete({
//     where: { id },
//   });
// }

// // ==================== HOSTEL CRUD FUNCTIONS ====================

// export async function createHostel(data: HostelCreate) {
//   const validatedData = HostelCreateSchema.parse(data);
//   return prisma.hostel.create({
//     data: validatedData,
//   });
// }

// export async function getHostels(skip?: number, take?: number) {
//   return prisma.hostel.findMany({
//     skip: skip || 0,
//     take: take || 50,
//     include: {
//       amenities: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }

// export async function getHostelById(id: string) {
//   return prisma.hostel.findUnique({
//     where: { id },
//     include: {
//       amenities: true,
//       reviews: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               profileImage: true,
//             },
//           },
//         },
//       },
//     },
//   });
// }

// export async function updateHostel(id: string, data: HostelUpdate) {
//   const validatedData = HostelUpdateSchema.parse(data);
//   return prisma.hostel.update({
//     where: { id },
//     data: validatedData,
//   });
// }

// export async function deleteHostel(id: string) {
//   return prisma.hostel.delete({
//     where: { id },
//   });
// }

// // ==================== BOOKING CRUD FUNCTIONS ====================

// export async function createBooking(data: BookingCreate) {
//   const validatedData = BookingCreateSchema.parse(data);

//   // Ensure the startDate is before or equal to endDate
//   if (validatedData.startDate > validatedData.endDate) {
//     throw new Error("Start date must be before or equal to end date");
//   }

//   return prisma.booking.create({
//     data: validatedData,
//     include: {
//       hostel: true,
//       user: true,
//     },
//   });
// }

// export async function getBookings(skip?: number, take?: number) {
//   return prisma.booking.findMany({
//     skip: skip || 0,
//     take: take || 50,
//     include: {
//       hostel: true,
//       user: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }

// export async function getBookingById(id: string) {
//   return prisma.booking.findUnique({
//     where: { id },
//     include: {
//       hostel: true,
//       user: true,
//     },
//   });
// }

// export async function getUserBookings(userId: string) {
//   return prisma.booking.findMany({
//     where: {
//       OR: [{ userId }, { currentUserId: userId }],
//     },
//     include: {
//       hostel: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }

// export async function updateBooking(id: string, data: BookingUpdate) {
//   const validatedData = BookingUpdateSchema.parse(data);

//   // If updating dates, ensure startDate is before endDate
//   if (
//     validatedData.startDate &&
//     validatedData.endDate &&
//     validatedData.startDate > validatedData.endDate
//   ) {
//     throw new Error("Start date must be before or equal to end date");
//   }

//   return prisma.booking.update({
//     where: { id },
//     data: validatedData,
//     include: {
//       hostel: true,
//       user: true,
//     },
//   });
// }

// export async function deleteBooking(id: string) {
//   return prisma.booking.delete({
//     where: { id },
//   });
// }

// // ==================== REVIEW CRUD FUNCTIONS ====================

// export async function createReview(data: ReviewCreate) {
//   const validatedData = ReviewCreateSchema.parse(data);

//   // Create the review
//   const review = await prisma.review.create({
//     data: validatedData,
//   });

//   // Update the hostel rating and review count
//   await updateHostelRating(validatedData.hostelId);

//   return review;
// }

// export async function getReviews(hostelId?: string) {
//   return prisma.review.findMany({
//     where: hostelId ? { hostelId } : undefined,
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           profileImage: true,
//         },
//       },
//       hostel: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }

// export async function updateReview(id: string, data: ReviewUpdate) {
//   const validatedData = ReviewUpdateSchema.parse(data);

//   const review = await prisma.review.update({
//     where: { id },
//     data: validatedData,
//   });

//   // If rating was updated, recalculate hostel rating
//   if (validatedData.rating) {
//     const reviewData = await prisma.review.findUnique({
//       where: { id },
//       select: { hostelId: true },
//     });

//     if (reviewData) {
//       await updateHostelRating(reviewData.hostelId);
//     }
//   }

//   return review;
// }

// export async function deleteReview(id: string) {
//   // Get hostelId before deletion for rating recalculation
//   const review = await prisma.review.findUnique({
//     where: { id },
//     select: { hostelId: true },
//   });

//   await prisma.review.delete({
//     where: { id },
//   });

//   // Recalculate hostel rating
//   if (review) {
//     await updateHostelRating(review.hostelId);
//   }

//   return true;
// }

// // Helper function to update hostel rating
// async function updateHostelRating(hostelId: string) {
//   const reviews = await prisma.review.findMany({
//     where: { hostelId },
//     select: { rating: true },
//   });

//   const reviewCount = reviews.length;
//   const rating =
//     reviewCount > 0
//       ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
//       : 0;

//   await prisma.hostel.update({
//     where: { id: hostelId },
//     data: {
//       rating,
//       reviewCount,
//     },
//   });

//   return { rating, reviewCount };
// }

// // ==================== PAYMENT METHOD CRUD FUNCTIONS ====================

// export async function createPaymentMethod(data: PaymentMethodCreate) {
//   const validatedData = PaymentMethodCreateSchema.parse(data);

//   // If this is set as default, unset any existing default payment methods
//   if (validatedData.isDefault) {
//     await prisma.paymentMethod.updateMany({
//       where: {
//         userId: validatedData.userId,
//         isDefault: true,
//       },
//       data: {
//         isDefault: false,
//       },
//     });
//   }

//   return prisma.paymentMethod.create({
//     data: validatedData,
//   });
// }

// export async function getUserPaymentMethods(userId: string) {
//   return prisma.paymentMethod.findMany({
//     where: { userId },
//     orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
//   });
// }

// export async function updatePaymentMethod(
//   id: string,
//   data: PaymentMethodUpdate
// ) {
//   const validatedData = PaymentMethodUpdateSchema.parse(data);

//   // If setting as default, unset any existing default payment methods
//   if (validatedData.isDefault) {
//     const currentPaymentMethod = await prisma.paymentMethod.findUnique({
//       where: { id },
//       select: { userId: true },
//     });

//     if (currentPaymentMethod) {
//       await prisma.paymentMethod.updateMany({
//         where: {
//           userId: currentPaymentMethod.userId,
//           isDefault: true,
//           id: { not: id },
//         },
//         data: { isDefault: false },
//       });
//     }
//   }

//   return prisma.paymentMethod.update({
//     where: { id },
//     data: validatedData,
//   });
// }

// export async function deletePaymentMethod(id: string) {
//   return prisma.paymentMethod.delete({
//     where: { id },
//   });
// }

// export async function setDefaultPaymentMethod(id: string, userId: string) {
//   // First, unset all defaults for this user
//   await prisma.paymentMethod.updateMany({
//     where: {
//       userId,
//       isDefault: true,
//     },
//     data: {
//       isDefault: false,
//     },
//   });

//   // Then set the new default
//   return prisma.paymentMethod.update({
//     where: { id },
//     data: {
//       isDefault: true,
//     },
//   });
// }

// // ==================== ADVANCED QUERY FUNCTIONS ====================

// // Search hostels with filters
// export async function searchHostels({
//   query,
//   gender,
//   minPrice,
//   maxPrice,
//   amenityIds,
//   featured,
//   skip,
//   take,
// }: {
//   query?: string;
//   gender?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   amenityIds?: string[];
//   featured?: boolean;
//   skip?: number;
//   take?: number;
// }) {
//   // Build where clause based on filters
//   const where: any = {};

//   if (query) {
//     where.OR = [
//       { name: { contains: query, mode: "insensitive" } },
//       { description: { contains: query, mode: "insensitive" } },
//       { address: { contains: query, mode: "insensitive" } },
//     ];
//   }

//   if (gender) {
//     where.gender = gender;
//   }

//   if (minPrice !== undefined || maxPrice !== undefined) {
//     where.price = {};
//     if (minPrice !== undefined) {
//       where.price.gte = minPrice;
//     }
//     if (maxPrice !== undefined) {
//       where.price.lte = maxPrice;
//     }
//   }

//   if (featured !== undefined) {
//     where.featured = featured;
//   }

//   // Determine if amenity filters should be applied
//   const includeAmenities = amenityIds && amenityIds.length > 0;

//   return prisma.hostel
//     .findMany({
//       where,
//       include: {
//         amenities: true,
//         reviews: {
//           include: {
//             user: {
//               select: {
//                 name: true,
//                 profileImage: true,
//               },
//             },
//           },
//           take: 3,
//           orderBy: {
//             createdAt: "desc",
//           },
//         },
//       },
//       skip: skip || 0,
//       take: take || 20,
//       orderBy: [{ featured: "desc" }, { rating: "desc" }],
//     })
//     .then((hostels) => {
//       // If amenity filters are applied, filter in memory
//       if (includeAmenities) {
//         return hostels.filter((hostel) =>
//           amenityIds!.every((amenityId) =>
//             hostel.amenities.some((amenity) => amenity.id === amenityId)
//           )
//         );
//       }
//       return hostels;
//     });
// }

// // Get hostel availability
// export async function getHostelAvailability(
//   hostelId: string,
//   startDate: Date,
//   endDate: Date
// ) {
//   // Find bookings that overlap with the requested date range
//   const bookings = await prisma.booking.findMany({
//     where: {
//       hostelId,
//       status: { not: "CANCELLED" },
//       OR: [
//         {
//           // Starts during the requested period
//           startDate: {
//             gte: startDate,
//             lte: endDate,
//           },
//         },
//         {
//           // Ends during the requested period
//           endDate: {
//             gte: startDate,
//             lte: endDate,
//           },
//         },
//         {
//           // Completely encompasses the requested period
//           AND: [
//             { startDate: { lte: startDate } },
//             { endDate: { gte: endDate } },
//           ],
//         },
//       ],
//     },
//     select: {
//       startDate: true,
//       endDate: true,
//     },
//   });

//   // Get hostel capacity
//   const hostel = await prisma.hostel.findUnique({
//     where: { id: hostelId },
//     select: { capacity: true },
//   });

//   if (!hostel) {
//     throw new Error("Hostel not found");
//   }

//   // Calculate booked days
//   const bookedDaysMap: Record<string, number> = {};

//   // For each day in the range, count bookings that cover that day
//   const currentDate = new Date(startDate);
//   while (currentDate <= endDate) {
//     const dateStr = currentDate.toISOString().split("T")[0];

//     // Count bookings that include this date
//     const bookingsOnThisDay = bookings.filter((booking) => {
//       const bookingStart = new Date(booking.startDate);
//       const bookingEnd = new Date(booking.endDate);
//       return currentDate >= bookingStart && currentDate <= bookingEnd;
//     }).length;

//     bookedDaysMap[dateStr] = bookingsOnThisDay;

//     // Move to next day
//     currentDate.setDate(currentDate.getDate() + 1);
//   }

//   // Calculate availability for each day
//   const availabilityByDay = Object.entries(bookedDaysMap).map(
//     ([date, bookings]) => ({
//       date,
//       totalCapacity: hostel.capacity,
//       booked: bookings,
//       available: hostel.capacity - bookings,
//       isFull: bookings >= hostel.capacity,
//     })
//   );

//   return {
//     hostelId,
//     capacity: hostel.capacity,
//     availabilityByDay,
//     isFullyBooked: availabilityByDay.every((day) => day.isFull),
//     availableDays: availabilityByDay.filter((day) => !day.isFull).length,
//   };
// }

// // Get user dashboard statistics
// export async function getUserDashboardStats(userId: string) {
//   const [currentBooking, totalBookings, reviewsCount, paymentMethodsCount] =
//     await Promise.all([
//       prisma.booking.findFirst({
//         where: {
//           currentUserId: userId,
//           status: { not: "COMPLETED" },
//         },
//         include: {
//           hostel: true,
//         },
//       }),
//       prisma.booking.count({
//         where: {
//           OR: [{ userId }, { currentUserId: userId }],
//         },
//       }),
//       prisma.review.count({
//         where: { userId },
//       }),
//       prisma.paymentMethod.count({
//         where: { userId },
//       }),
//     ]);

//   return {
//     currentBooking,
//     totalBookings,
//     reviewsCount,
//     paymentMethodsCount,
//   };
// }

// // ==================== TRANSACTION EXAMPLES ====================

// // Example of using transactions for complex operations
// export async function processBookingPayment(
//   bookingId: string,
//   amount: number,
//   paymentMethodId: string
// ) {
//   return prisma.$transaction(async (tx) => {
//     // 1. Get the booking
//     const booking = await tx.booking.findUnique({
//       where: { id: bookingId },
//       select: {
//         totalAmount: true,
//         paymentStatus: true,
//         status: true,
//       },
//     });

//     if (!booking) {
//       throw new Error("Booking not found");
//     }

//     if (booking.status === "CANCELLED") {
//       throw new Error("Cannot process payment for cancelled booking");
//     }

//     // 2. Calculate new payment status
//     const totalAmount = Number(booking.totalAmount);
//     let newPaymentStatus = booking.paymentStatus;

//     if (amount >= totalAmount) {
//       newPaymentStatus = "PAID";
//     } else if (amount > 0) {
//       newPaymentStatus = "PARTIALLY_PAID";
//     }

//     // 3. Update booking status and payment status
//     const updatedBooking = await tx.booking.update({
//       where: { id: bookingId },
//       data: {
//         paymentStatus: newPaymentStatus,
//         status: newPaymentStatus === "PAID" ? "CONFIRMED" : booking.status,
//       },
//     });

//     // 4. In a real implementation, you'd create a payment record here

//     return updatedBooking;
//   });
// }

// // Example of transaction to create a booking and handle related operations
// export async function createBookingWithConfirmation(data: BookingCreate) {
//   return prisma.$transaction(async (tx) => {
//     // Validate input
//     const validatedData = BookingCreateSchema.parse(data);

//     // Check if hostel exists and has availability
//     const hostel = await tx.hostel.findUnique({
//       where: { id: validatedData.hostelId },
//       select: { capacity: true },
//     });

//     if (!hostel) {
//       throw new Error("Hostel not found");
//     }

//     // Check for availability by counting existing bookings in the period
//     const existingBookingsCount = await tx.booking.count({
//       where: {
//         hostelId: validatedData.hostelId,
//         status: { not: "CANCELLED" },
//         OR: [
//           {
//             startDate: {
//               gte: validatedData.startDate,
//               lte: validatedData.endDate,
//             },
//           },
//           {
//             endDate: {
//               gte: validatedData.startDate,
//               lte: validatedData.endDate,
//             },
//           },
//           {
//             AND: [
//               { startDate: { lte: validatedData.startDate } },
//               { endDate: { gte: validatedData.endDate } },
//             ],
//           },
//         ],
//       },
//     });

//     if (existingBookingsCount >= hostel.capacity) {
//       throw new Error("No availability for the selected dates");
//     }

//     // Check if user already has a current booking
//     if (validatedData.currentUserId) {
//       const existingCurrentBooking = await tx.booking.findUnique({
//         where: { currentUserId: validatedData.currentUserId },
//       });

//       if (existingCurrentBooking) {
//         throw new Error("User already has a current booking");
//       }
//     }

//     // Create the booking
//     const booking = await tx.booking.create({
//       data: validatedData,
//       include: {
//         hostel: true,
//         user: true,
//       },
//     });

//     return booking;
//   });
// }
