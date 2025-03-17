import { hostelData } from "@/lib/data";
import { updateHostelSchema } from "@/lib/validation";
import db from "@/lib/db";
import { ZodError } from "zod";

export async function GET(request: Request, { id }: Record<string, string>) {
  const hostel = hostelData.find((hostel) => hostel.id === id);
  return Response.json(hostel);
}


// export async function GET(request: Request, { id }: Record<string, string>) {
//   const hostel = await db.hostel.findUnique({
//     where: { id },
//     include: {
//       reviews: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               image: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   return Response.json(hostel);
// }


export async function DELETE(request: Request, { id }: Record<string, string>) {
  await db.hostel.delete({
    where: { id },
  });

  return Response.json('Hostel deleted successfully');
}


export async function PATCH(request: Request, { id:hostelId }: Record<string, string>) {
  const input = await request.json();
  try {
    // Validate input
    const validatedData = updateHostelSchema.parse(input);

    // Check if hostel exists
    const existingHostel = await db.hostel.findUnique({
      where: { id: hostelId },
    });

    if (!existingHostel) {
      throw new Error("Hostel not found");
    }

    // If wardenId is provided, check if warden exists
    if (validatedData.wardenId) {
      const warden = await db.warden.findUnique({
        where: { id: validatedData.wardenId },
      });

      if (!warden) {
        throw new Error("Warden not found");
      }
    }

    // Update hostel
    const hostel = await db.hostel.update({
      where: { id: hostelId },
      data: {
        ...validatedData,
        ...(validatedData.price && { price: validatedData.price.toString() }), // Convert number to Decimal if provided
      },
      include: {
        warden: true,
      },
    });

    return hostel;
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          error: `Validation error: ${error.errors
            .map((e) => e.message)
            .join(", ")}`,
        }),
        { status: 400 }
      );
    }
    throw error;
  } finally {
    await db.$disconnect();
  }
}
