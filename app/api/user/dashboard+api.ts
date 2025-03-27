import { auth } from "@/lib/auth";
import { mockBookingData, mockUser } from "@/lib/data";
import db from "@/lib/db";
import { loginFormSchema } from "@/lib/types/validation";
import { updateUserSchema } from "@/lib/validation";
import { ZodError } from "zod";

export async function GET( request: Request) {
  const headers = request.headers;
  
  try {
    const session = await auth.api.getSession({ headers });

    if (!session?.user.id){
      return Response.json({ ...mockUser, bookingsData: mockBookingData });
    }
    
    const userId = session.user.id;
    const user = await db.user.findUnique({ where: { id: userId } });

    const [currentBooking, totalBookings, reviewsCount, paymentMethodsCount] =
      await Promise.all([
        db.booking.findFirst({
          where: {
            currentUserId: userId,
            status: { not: "COMPLETED" },
          },
          include: {
            hostel: true,
          },
        }),
        db.booking.count({
          where: {
            OR: [{ userId }, { currentUserId: userId }],
          },
        }),
        db.review.count({
          where: { userId },
        }),
        db.paymentMethod.count({
          where: { userId },
        }),
      ]);

    return Response.json({
      ...user,
      currentBooking,
      totalBookings,
      reviewsCount,
      paymentMethodsCount,
    });
  } catch (error: any) {
    console.log(error);
    return Response.json({ error: error }, { status: 500 });
  }
}


export async function POST(request: Request) {
  const data = await request.json();
  const headers = request.headers;

  try {
    const validatedData = loginFormSchema.parse(data);
    const user = await auth.api.getSession({ headers });
    
    if(!user?.user.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const {
      name,
      studentRegNo,
      phone,
      idType,
      emergencyContact,
      gender,
      idNumber,
      roomPreference
    } = validatedData;
    const userUpdate = await db.user.update({
      where: { id: user?.user.id },
      data: {
        name: name,
        studentId: studentRegNo,
        phone,
        gender,
        identification: {
          create: {
            type: idType,
            number: idNumber,
            name: name,
          },
        },
        emergencyContact: {
          connectOrCreate: {
            where: {
              userId: user?.user.id,
            },
            create: {
              name: emergencyContact.name,
              phone: emergencyContact.phone,
              relation: emergencyContact.relation,
            },
          },
        },
      },
    });
    
    return Response.json(userUpdate, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const input = await request.json();
  const headers = request.headers;
  try {
    const session = await auth.api.getSession({
      headers
    })
    if(!session?.user.id) return Response.json({ error: "Unauthorized" });
    const userId = session.user.id;
    
    // Validate input
    const validatedData = updateUserSchema.parse(input);

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        emergencyContact: true,
        notificationPreferences: true,
      },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Extract emergency contact and notification preferences
    const { emergencyContact, notificationPreferences, ...userData } =
      validatedData;

    // Update user and related data
    const user = await db.user.update({
      where: { id: userId },
      data: {
        ...userData,
        ...(emergencyContact && {
          emergencyContact: {
            update: emergencyContact,
          },
        }),
        ...(notificationPreferences && {
          notificationPreferences: {
            update: notificationPreferences,
          },
        }),
      },
      include: {
        emergencyContact: true,
        notificationPreferences: true,
      },
    });

    // Remove password from returned data
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error;
  } finally {
    await db.$disconnect();
  }
}
