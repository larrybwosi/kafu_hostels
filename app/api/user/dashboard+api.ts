import { auth } from "@/lib/auth";
import { hostelData } from "@/lib/data";
import db from "@/lib/db";
import { loginFormSchema } from "@/lib/types/validation";

// export async function GET(userId: string) {
//   const [currentBooking, totalBookings, reviewsCount, paymentMethodsCount] =
//     await Promise.all([
//       db.booking.findFirst({
//         where: {
//           currentUserId: userId,
//           status: { not: "COMPLETED" },
//         },
//         include: {
//           hostel: true,
//         },
//       }),
//       db.booking.count({
//         where: {
//           OR: [{ userId }, { currentUserId: userId }],
//         },
//       }),
//       db.review.count({
//         where: { userId },
//       }),
//       db.paymentMethod.count({
//         where: { userId },
//       }),
//     ]);

//   return Response.json({
//     currentBooking,
//     totalBookings,
//     reviewsCount,
//     paymentMethodsCount,
//   })
// }

const userDataRes = {
  id: "usr_2938428",
  name: "Emma Thompson",
  email: "emma.thompson@example.com",
  phone: "+254 78 123-4567",
  joinedDate: "May 2022",
  profileImage: "https://i.pravatar.cc/300?img=5",
  emergencyContact: {
    name: "Michael Thompson",
    relation: "Brother",
    phone: "+254 72 987-6543",
  },
  address: "123 Kaimosi Friends University, Kaimosi, Kenya",
  studentId: "STU-2023-45678",
  paymentMethods: [
    {
      type: "card",
      last4: "4242",
      expiryDate: "09/25",
      brand: "Visa",
      isDefault: true,
    },
    {
      type: "mpesa",
      last4: "9876",
      bankName: "Mpesa",
      isDefault: false,
    },
  ],
  notifications: {
    booking: true,
    payment: true,
    promotions: false,
    newsletter: true,
  },
  preferences: {
    quietHours: true,
    nonSmoking: true,
    earlyRiser: false,
  },
};

interface Booking {
  id: string;
  status: string;
  hostelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  daysRemaining: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  nextPaymentDate: string;
  roomNumber: string;
  address: string;
  image: string;
  amenities: string[];
  isFeatured: boolean;
}
const bookingsData = [
  hostelData[0],
  {
    id: "bkg_27651298",
    status: "completed",
    hostelName: "Lakeside Student Housing",
    roomType: "Standard Single Room",
    checkIn: "2023-09-01",
    checkOut: "2024-06-15",
    totalAmount: 5800,
    amountPaid: 5800,
    roomNumber: "215",
    address: "300 Lake View Rd, University City, CA 94322",
    image:
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=400",
    amenities: ["WiFi", "Gym", "Laundry"],
    isFeatured: false,
    rating: 4.5,
    review:
      "Great location, clean facilities, and helpful staff. Would book again!",
  },
  {
    id: "bkg_25638741",
    status: "completed",
    hostelName: "Downtown Student Lofts",
    roomType: "Shared Studio Apartment",
    checkIn: "2022-09-01",
    checkOut: "2023-06-30",
    totalAmount: 6200,
    amountPaid: 6200,
    roomNumber: "512",
    address: "150 Main Street, University City, CA 94320",
    image:
      "https://images.unsplash.com/photo-1560448204-603b3fc33dcd?q=80&w=400",
    amenities: ["WiFi", "TV Lounge", "Bike Storage", "Security"],
    isFeatured: false,
    rating: 4.0,
    review:
      "Decent place with good amenities. The location was convenient for classes.",
  },
];

export async function GET(request: Request) {
  console.log(bookingsData);
  return Response.json({ ...userDataRes,bookingsData });
}

export async function POST(request: Request) {
  const data = await request.json();
  const headers = new Headers();
  try {
    
  const validatedData = loginFormSchema.parse(data);
  const user = await auth.api.getSession({ headers });

  await db.user.update({ where: { id: user?.user.id }, data: validatedData });
  return Response.json({ ...userDataRes, ...data });
  } catch (error) {
    return Response.json({ error });
  }
}