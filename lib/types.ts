declare interface Hostel {
  id: string;
  name: string;
  description: string;
  type: string;
  rooms: number;
  roomCapacity: number;
  capacity: number;
  gender: string;
  price: number;
  distance: number | null | 'incampus';
  rating: number;
  reviews: number;
  imageUrl: string;
  availability: string;
  images: string[];
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  warden: {
    name: string;
    phone: string;
    image: string;
  };
  rules: string[];
  amenities: {
    name: string;
    icon: string;
  }[];
  featured?: boolean;
}


declare interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  profileImage: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  address: string;
  studentId: string;
  paymentMethods: {
    type: string;
    last4: string;
    expiryDate: string;
    brand: string;
    isDefault: boolean;
  }[];
  notifications: {
    booking: boolean;
    payment: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  preferences: {
    language: string;
    quietHours: boolean;
  };
}
