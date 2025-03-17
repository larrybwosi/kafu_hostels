import { $fetch } from "./auth-client";
import { LoginFormData } from "./types/validation";
import { useFetch } from "./useFetch";

const endpoint = "http://localhost:8081";
const getAllHostels = async (): Promise<Hostel[]> => {
  const hostels = await fetch(`${endpoint}/api/hostels/all`, {
    cache: "force-cache",
  }).then((res) => res.json());
  return hostels;
};

const getHostel = async (id: string): Promise<Hostel> => {
  const hostel = await fetch(`${endpoint}/api/hostels/${id}`, { cache: "no-cache" }).then((res) => res.json());
  return hostel;
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
  const updatedData = await $fetch(`${endpoint}/api/user/dashboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));
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
  const user = await $fetch(`${endpoint}/api/user/dashboard`, {
    method: "GET",
    cache: "force-cache",
  }).then((res) => res.data).catch((error) => console.log(error));
  return user as User & { bookingsData: Booking[] };
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

const useGetAllHostels = () =>{
  return useFetch({
    fn: getAllHostels,
  });
}

const useGetHostel = (id: string) => {
  return useFetch({
    fn: ()=>getHostel(id),
    params: { id },
  });
}

const useGetUserData = () => {
  return useFetch({
    fn: ()=>getUserData(),
  });
}

export {
  useGetAllHostels,
  useGetHostel,
  useGetUserData,
  createHostel,
  handleSignUp,
  handleProfileUpdate,
};