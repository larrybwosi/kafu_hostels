import { hostelData } from "@/lib/data";

export function GET(request: Request) {
  const hostels = hostelData
  return Response.json(hostels);
}
