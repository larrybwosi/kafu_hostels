import { loginFormSchema } from "@/lib/types/validation";

interface Booking {
  hostelId: string;
  semesterName: string;
  semesterPeriod: string;
  paymentAmount: number;
  mobileNumber: string;
  paymentMethod: string;
  balanceAmount: number;
  specialRequests: string;
}

export async function POST(request: Request) {
  const data = await request.json();
  const validatedData = loginFormSchema.parse(data);
  if(!validatedData) {
    return new Response("Invalid data", {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
  console.log(validatedData);
  return Response.json({ message: "Hostel created successfully" });
}