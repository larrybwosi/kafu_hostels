import db from "@/lib/db";
import { createHostelSchema } from "@/lib/validation";


export async function POST(request: Request) {
  const data = await request.json();
  const validatedData = createHostelSchema.parse(data);
  const hostel = await db.hostel.create({
    data: validatedData,
  });

  return Response.json(hostel);
}