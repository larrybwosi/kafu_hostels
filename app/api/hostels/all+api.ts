import { hostelData } from "@/lib/data";
import db from "@/lib/db";

export function GET(request: Request) {
  const hostels = hostelData
  return Response.json(hostels);
}


// export async function GET(request: Request) {
  
//   const { skip, take } = request
//   return db.hostel.findMany({
//     skip: skip || 0,
//     take: take || 50,
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }