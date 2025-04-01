import { seedAllHostels } from "@/lib/sanity/seed";

export async function GET(request: Request) {
  // Check for an API key in the request headers to secure this endpoint
  const apiKey = request.headers.get('x-api-key');
  
  // Set this to a strong, secret value in a real application
  const expectedApiKey = 'SEED_API_KEY';
  
  if (apiKey !== expectedApiKey) {
    return Response.json(
      { error: 'Unauthorized access. Invalid API key.' },
      { status: 401 }
    );
  }
  
  try {
    // Parse limit parameter
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    
    console.log(`Starting seed process with limit: ${limit || 'unlimited'}`);
    
    // Start seeding process
    const results = await seedAllHostels();
    
    return Response.json({
      success: true,
      message: 'Hostels seeded successfully',
      count: results.length,
      hostels: results.map(result => ({
        name: result.hostel.name,
        id: result.hostel._id,
        rooms: result.rooms.length
      }))
    });
  } catch (error) {
    console.error('Error seeding hostels:', error);
    
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 