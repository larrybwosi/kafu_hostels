/**
 * This file contains functions to seed the Sanity database with hostel data
 */

import { createClient } from '@sanity/client';
import { hostelData } from '../data';

// Use any type for fetch to avoid TS errors
// @ts-ignore
import fetch from 'node-fetch';

// Set up Sanity client
const client = createClient({
  projectId: process.env.EXPO_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.EXPO_SANITY_DATASET || "production",
  token: process.env.EXPO_PUBLIC_SANITY_TOKEN,
  useCdn: false,
  apiVersion: "2023-05-03",
});

/**
 * Upload an image to Sanity
 * @param imageUrl The URL of the image to upload
 * @returns The uploaded image asset reference
 */
export const uploadImage = async (imageUrl: string) => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    // Convert to buffer
    const buffer = await response.buffer();
    
    // Upload to Sanity
    const result = await client.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop(),
    });
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: result._id,
      },
    };
  } catch (error) {
    console.error(`Error uploading image ${imageUrl}:`, error);
    return null;
  }
};

/**
 * Create or get a warden document
 * @param warden The warden data
 * @returns The created or retrieved warden document
 */
export const getOrCreateWarden = async (warden: any) => {
  if (!warden) return null;

  try {
    // Check if warden already exists
    const existingWarden = await client.fetch(
      `*[_type == "warden" && name == $name][0]`,
      { name: warden.name }
    );

    if (existingWarden) {
      console.log(`Warden ${warden.name} already exists`);
      return existingWarden;
    }

    // Upload warden image if available
    let imageAsset = null;
    if (warden.image) {
      imageAsset = await uploadImage(warden.image);
    }

    // Create new warden
    const wardenDoc = {
      _type: 'warden',
      name: warden.name,
      email: warden.email,
      phone: warden.phone,
      ...(imageAsset && { image: imageAsset }),
    };

    const createdWarden = await client.create(wardenDoc);
    console.log(`Created warden: ${warden.name}`);
    return createdWarden;
  } catch (error) {
    console.error(`Error creating warden ${warden.name}:`, error);
    return null;
  }
};

/**
 * Create a hostel document
 * @param hostel The hostel data
 * @returns The created hostel document
 */
export const createHostel = async (hostel: any) => {
  try {
    // Check if hostel already exists
    const existingHostel = await client.fetch(
      `*[_type == "hostel" && name == $name][0]`,
      { name: hostel.name }
    );

    if (existingHostel) {
      console.log(`Hostel ${hostel.name} already exists`);
      return existingHostel;
    }

    // Upload main image
    let mainImage = null;
    if (hostel.image) {
      mainImage = await uploadImage(hostel.image);
    }

    // Upload additional images
    const images = [];
    if (hostel.images && Array.isArray(hostel.images)) {
      for (const imageUrl of hostel.images) {
        const uploadedImage = await uploadImage(imageUrl);
        if (uploadedImage) {
          images.push(uploadedImage);
        }
      }
    }

    // Create or get warden
    let wardenRef = null;
    if (hostel.warden) {
      const warden = await getOrCreateWarden(hostel.warden);
      if (warden) {
        wardenRef = {
          _type: 'reference',
          _ref: warden._id,
        };
      }
    }

    // Create hostel document
    const hostelDoc = {
      _type: 'hostel',
      name: hostel.name,
      description: hostel.description,
      type: hostel.type,
      gender: hostel.gender,
      price: hostel.price,
      rating: hostel.rating || 0,
      roomCapacity: hostel.roomCapacity,
      rooms: hostel.rooms,
      ...(mainImage && { mainImage }),
      ...(images.length > 0 && { images }),
      ...(wardenRef && { warden: wardenRef }),
      location: {
        _type: 'location',
        address: hostel.location.address,
        city: hostel.location.city,
        state: hostel.location.state,
        country: hostel.location.country,
        coordinates: {
          _type: 'geopoint',
          lat: hostel.location.coordinates?.lat || 0,
          lng: hostel.location.coordinates?.lng || 0,
        },
      },
      amenities: hostel.amenities || [],
      rules: hostel.rules || [],
      contact: {
        _type: 'contact',
        email: hostel.contact.email,
        phone: hostel.contact.phone,
        website: hostel.contact.website,
      },
    };

    const createdHostel = await client.create(hostelDoc);
    console.log(`Created hostel: ${hostel.name}`);

    // Create room documents for each hostel
    if (hostel.roomDetails && Array.isArray(hostel.roomDetails)) {
      for (const room of hostel.roomDetails) {
        const roomDoc = {
          _type: 'room',
          roomNumber: room.roomNumber,
          type: room.type,
          capacity: room.capacity,
          price: room.price,
          isAvailable: room.isAvailable,
          hostel: {
            _type: 'reference',
            _ref: createdHostel._id,
          },
          ...(room.features && { features: room.features }),
        };

        const createdRoom = await client.create(roomDoc);
        console.log(`Created room ${room.roomNumber} for hostel ${hostel.name}`);
      }
    }

    return createdHostel;
  } catch (error) {
    console.error(`Error creating hostel ${hostel.name}:`, error);
    return null;
  }
};

/**
 * Seed all hostels from the data file
 * @param limit Optional limit on the number of hostels to seed
 * @returns Array of created hostels
 */
export const seedAllHostels = async (limit?: number) => {
  try {
    const hostelsToSeed = limit ? hostelData.slice(0, limit) : hostelData;
    console.log(`Seeding ${hostelsToSeed.length} hostels...`);
    
    const createdHostels = [];
    for (const hostel of hostelsToSeed) {
      const createdHostel = await createHostel(hostel);
      if (createdHostel) {
        createdHostels.push({
          id: createdHostel._id,
          name: createdHostel.name,
          rooms: hostel.rooms || 0,
        });
      }
    }

    console.log(`Successfully seeded ${createdHostels.length} hostels`);
    return createdHostels;
  } catch (error) {
    console.error('Error seeding hostels:', error);
    throw error;
  }
};

/**
 * Run the seed function
 */
export const runSeed = async (limit?: number) => {
  try {
    const result = await seedAllHostels(limit);
    console.log('Seeding completed successfully!');
    return result;
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
};

// Export default function to run the seed
export default seedAllHostels;
