// import db from "@/lib/db";
import { HostelCreate, HostelCreateSchema } from "@/lib/validation";


export async function POST(request: Request) {
  // const data = await request.json();
  // const validatedData = HostelCreateSchema.parse(data);
  // const hostel = await db.hostel.create({
  //   data: validatedData,
  // });

  // return Response.json(hostel);
  return Response.json({ message: "Hostel created successfully" });
}