import { hostelData } from "@/lib/data";
// import db from "@/lib/db";

export async function GET(request: Request, { id }: Record<string, string>) {
  const hostel = hostelData.find((hostel) => hostel.id === id);
  return Response.json(hostel);
}


// export async function getHostelById(request: Request, { id }: Record<string, string>) {
//   const hostel = await db.hostel.findUnique({
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

//   return Response.json(hostel);
// }


// export async function DELETE(request: Request, { id }: Record<string, string>) {
//   await db.hostel.delete({
//     where: { id },
//   });

//   return Response.json('Hostel deleted successfully');
// }