import { $fetch } from "./auth-client";
import { client } from "./sanity/client";
import { LoginFormData } from "./types/validation";
import { useFetch } from "./useFetch";
import imageUrlBuilder from "@sanity/image-url";

const endpoint =
  process.env.NODE_ENV === "production"
    ? "https://kafu-hostels.expo.app"
    : "http://localhost:8081";

export interface Hostel {
      _id: string;
      _type: string;
      name: string;
      description: string;
      type: string;
      gender: string;
      price: number;
      distance: number;
      rating: number;
      reviews: number;
      featured: boolean;
      availability: boolean;
      totalRooms: number;
      roomCapacity: number;
      currentOccupancy: number;
      mainImageUrl: string;
      images: string[];
      wardenInfo: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        profileImageUrl: string;
      };
      contact: {
        email: string;
        phone: string;
        website?: string;
      };
      location: {
        address: string;
        coordinates: { lat: number; lng: number };
      };
      rules: string[];
      amenities: string[];
    }

// Initialize the image URL builder
const builder = imageUrlBuilder(client);

// Function to get image URL from Sanity image reference
function urlFor(source: any) {
  return source ? builder.image(source) : null;
}

// Get all hostels with expanded references and image URLs
const getAllHostels = async (): Promise<Hostel[]> => {
  try {
    // Fetch hostels with expanded warden references
    const hostels = await client.fetch(`
      *[_type == "hostel"] {
        _id,
        _type,
        name,
        description,
        type,
        gender,
        price,
        distance,
        rating,
        reviews,
        featured,
        availability,
        totalRooms,
        roomCapacity,
        currentOccupancy,
        "mainImageUrl": mainImage.asset->url,
        "images": images[].asset->url,
        "wardenInfo": warden->{
          _id,
          firstName,
          lastName,
          email,
          phone,
          "profileImageUrl": profileImage.asset->url
        },
        contact,
        location,
        rules,
        amenities
      }
    `);

    // Process the data to make it easier to use in the frontend
    const processedHostels = hostels.map(hostel => ({
      ...hostel,
      // Create full image URLs for easy display
      imageUrl: hostel.mainImageUrl,
      // Combine warden first name and last name
      warden: {
        ...hostel.wardenInfo,
        name: `${hostel.wardenInfo?.firstName || ''} ${hostel.wardenInfo?.lastName || ''}`.trim(),
        image: hostel.wardenInfo?.profileImageUrl || 'https://via.placeholder.com/150'
      }
    }));

    console.log(`Fetched ${processedHostels.length} hostels`);
    return processedHostels;
  } catch (error) {
    console.error("Error fetching hostels:", error);
    return [];
  }
};

const getHostel = async (id: string): Promise<Hostel> => {
  try {
    // Fetch single hostel with expanded references
    const [hostel] = await client.fetch(`
      *[_type == "hostel" && _id == $id] {
        _id,
        _type,
        name,
        description,
        type,
        gender,
        price,
        distance,
        rating,
        reviews,
        featured,
        availability,
        totalRooms,
        roomCapacity,
        currentOccupancy,
        "mainImageUrl": mainImage.asset->url,
        "images": images[].asset->url,
        "wardenInfo": warden->{
          _id,
          firstName,
          lastName,
          email,
          phone,
          "profileImageUrl": profileImage.asset->url
        },
        contact,
        location,
        rules,
        amenities,
        "rooms": *[_type == "room" && hostel._ref == ^._id] {
          _id,
          roomNumber,
          floor,
          capacity,
          isAvailable
        }
      }
    `, { id });

    if (!hostel) {
      throw new Error(`Hostel with ID ${id} not found`);
    }

    // Process the data for frontend consumption
    const processedHostel = {
      ...hostel,
      imageUrl: hostel.mainImageUrl,
      warden: {
        ...hostel.wardenInfo,
        name: `${hostel.wardenInfo?.firstName || ''} ${hostel.wardenInfo?.lastName || ''}`.trim(),
        image: hostel.wardenInfo?.profileImageUrl || 'https://via.placeholder.com/150'
      }
    };

    return processedHostel;
  } catch (error) {
    console.error(`Error fetching hostel with ID ${id}:`, error);
    throw error;
  }
};

const handleSignUp = async (data: LoginFormData) => {
  const newUser = await $fetch(`${endpoint}/api/user/dashboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));
  return newUser;
}

const handleProfileUpdate = async (data: any) => {
  const updatedData = await client.patch(data._id).set(data).commit();
  return updatedData;
}

interface Booking {
  id: string;
  status: string;
  hostelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  daysRemaining: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  nextPaymentDate: string;
  roomNumber: string;
  address: string;
  image: string;
  amenities: string[];
  isFeatured: boolean;
}

const getUserData = async (): Promise<User & { bookingsData: Booking[] }> => {
  try {
    // First try to get authenticated user data from API
    const response = await fetch(`/api/user/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data from API');
    }
    
    return await response.json();
  } catch (error) {
    console.log("Error fetching user data, using mock data:", error);
    
    // Fallback to mock data
    return {
      id: "mock-user-id",
      name: "John Doe",
      email: "john.doe@example.com",
      profileImage: "https://randomuser.me/api/portraits/men/44.jpg",
      phone: "+1234567890",
      address: "123 University Ave, Campus Area",
      createdAt: new Date().toISOString(),
      studentId: "STU12345",
      emergencyContact: {
        name: "Jane Doe",
        relation: "Parent",
        phone: "+1987654321",
      },
      bookingsData: [
        {
          id: "booking-1",
          status: "active",
          hostelName: "Hargreaves Hostel",
          roomType: "Shared Room",
          checkIn: "2023-09-01",
          checkOut: "2024-05-30",
          daysRemaining: 120,
          totalAmount: 12000,
          amountPaid: 8000,
          amountDue: 4000,
          nextPaymentDate: "2023-12-15",
          roomNumber: "HAR-101",
          address: "Main Campus, Block A",
          image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
          amenities: ["Wi-Fi", "Laundry", "Study Room"],
          isFeatured: true,
        },
      ],
    };
  }
};

const createHostel = async (hostel: any) => {
  const newHostel = await $fetch(`${endpoint}/api/hostels/all/api/hostels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hostel),
  }).then((res) => res.data);
  return newHostel;
};

const useGetAllHostels = () => {
  return useFetch({
    fn: getAllHostels,
  });
}

const useGetHostel = (id: string) => {
  return useFetch({
    fn: () => getHostel(id),
    params: { id },
  });
}

const useGetUserData = () => {
  return useFetch({
    fn: async() => await getUserData(),
  });
}

export {
  useGetAllHostels,
  useGetHostel,
  useGetUserData,
  createHostel,
  handleSignUp,
  handleProfileUpdate,
  urlFor
};