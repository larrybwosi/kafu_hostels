import { hostelData } from "../lib/data";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding...`);

  for (const data of hostelData) {
    // 1. First handle the warden
    const warden = await prisma.warden.upsert({
      where: { phone: data.warden.phone },
      update: {
        name: data.warden.name,
        phone: data.warden.phone,
        image: data.warden.image,
      },
      create: {
        name: data.warden.name,
        phone: data.warden.phone,
        image: data.warden.image,
      },
    });

    // 2. Transform amenities if they're in object format
    const amenities = data.amenities.map((amenity:any) =>
      typeof amenity === "object" ? amenity.name : amenity
    );

    // 3. Prepare the hostel data
    const hostelData = {
      // Basic info
      name: data.name,
      description: data.description,
      type: data.type,
      rooms: data.rooms,
      roomCapacity: data.roomCapacity,
      capacity: data.capacity,
      gender: data.gender,
      price: new Prisma.Decimal(data.price),
      distance: data.distance,
      rating: data.rating,
      reviewCount: data.reviews,
      availability: data.availability,
      featured: data.featured,

      // Contact info
      contactEmail: data.contact.email,
      contactPhone: data.contact.phone,
      contactWebsite: data.contact.website,

      // Location
      address: data.location.address,
      latitude: data.location.coordinates.lat,
      longitude: data.location.coordinates.lng,

      // Media
      imageUrl: data.imageUrl,
      images: data.images,

      // Rules & amenities
      rules: data.rules,
      amenities: amenities,

      // Relations
      wardenId: warden.id,
    };

    // 4. Create/update the hostel
    const hostel = await prisma.hostel.upsert({
      where: { id: data.id },
      update: hostelData,
      create: {
        id: data.id,
        ...hostelData,
      },
    });

    console.log(`Created/updated hostel ${hostel.name} with id: ${hostel.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
