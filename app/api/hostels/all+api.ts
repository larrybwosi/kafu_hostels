import { hostelData } from "@/lib/data";
import db from "@/lib/db";

export async function GET(request: Request) {
  try {
    const hostels = await db.hostel.findMany();
    
    return Response.json(hostels);
  } catch (error) {
    console.log(error)
  }
}

