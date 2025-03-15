import { loginFormSchema } from "@/lib/types/validation";

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