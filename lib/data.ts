

export const hostelData: Hostel[] = [
  {
    id: "1",
    name: "Hargreaves Hostel",
    description:
      "A comfortable and secure hostel for male students, located in the heart of the campus.",
    type: "On-campus",
    rooms: 20,
    roomCapacity: 4,
    capacity: 80,
    gender: "male",
    price: 12000,
    distance: "incampus",
    rating: 4.5,
    reviews: 120,
    imageUrl:
      "https://media.istockphoto.com/id/2155965052/photo/new-condo-houston-texas-usa.webp?a=1&b=1&s=612x612&w=0&k=20&c=dPPtZAII1Emj7o_VB_9r-W1wAG_snOXlGnARbog4JVY=",
    featured: true,
    availability: "Available",
    images: [
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    ],
    contact: {
      email: "hargreaves@hostel.com",
      phone: "+254712345678",
      website: "https://hargreaveshostel.com",
    },
    location: {
      address: "Main Campus, Block A",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "John Doe",
      phone: "+254712345679",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: [
      "No visitors after 10 PM",
      "Strictly no alcohol",
      "Keep noise levels low after 9 PM",
    ],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Laundry", icon: "washing-machine" },
      { name: "Study Room", icon: "book" },
    ],
  },
  {
    id: "2",
    name: "Washington Hostel",
    description:
      "A cozy hostel with a homely atmosphere, perfect for male students.",
    type: "On-campus",
    rooms: 12,
    roomCapacity: 2,
    capacity: 24,
    gender: "male",
    price: 15000,
    distance: "incampus",
    rating: 4.2,
    reviews: 90,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww",
    featured: false,
    availability: "Available",
    images: [
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    ],
    contact: {
      email: "washington@hostel.com",
      phone: "+254712345680",
      website: "https://washingtonhostel.com",
    },
    location: {
      address: "Main Campus, Block B",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Jane Smith",
      phone: "+254712345681",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: ["No smoking", "Keep rooms clean", "Respect quiet hours"],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Gym", icon: "dumbbell" },
      { name: "Cafeteria", icon: "coffee" },
    ],
  },
  {
    id: "3",
    name: "Chilson A Hostel",
    description: "A modern hostel with excellent facilities for male students.",
    type: "On-campus",
    rooms: 8,
    roomCapacity: 2,
    capacity: 16,
    gender: "male",
    price: 14000,
    distance: "incampus",
    rating: 4.3,
    reviews: 85,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww",
    featured: false,
    availability: "Available",
    images: [
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    ],
    contact: {
      email: "chilsona@hostel.com",
      phone: "+254712345682",
      website: "https://chilsonahostel.com",
    },
    location: {
      address: "Main Campus, Block C",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Peter Johnson",
      phone: "+254712345683",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: [
      "No pets allowed",
      "Strictly no parties",
      "Keep common areas clean",
    ],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Library", icon: "book" },
      { name: "TV Room", icon: "tv" },
    ],
  },
  {
    id: "4",
    name: "Khama Hostel",
    description:
      "A vibrant hostel with a strong sense of community for male students.",
    type: "On-campus",
    rooms: 12,
    roomCapacity: 2,
    capacity: 24,
    gender: "male",
    price: 13000,
    distance: "incampus",
    rating: 4.4,
    reviews: 95,
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D",
    featured: true,
    availability: "Available",
    images: [
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    ],
    contact: {
      email: "khama@hostel.com",
      phone: "+254712345684",
      website: "https://khamahostel.com",
    },
    location: {
      address: "Main Campus, Block D",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Alice Brown",
      phone: "+254712345685",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: ["No loud music", "Keep bathrooms clean", "Respect curfew hours"],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Swimming Pool", icon: "swimmer" },
      { name: "Cafeteria", icon: "coffee" },
    ],
  },
  {
    id: "5",
    name: "Amugune Hostel",
    description: "A peaceful and serene hostel for male students.",
    type: "On-campus",
    rooms: 13,
    roomCapacity: 2,
    capacity: 26,
    gender: "male",
    price: 11000,
    distance: "incampus",
    rating: 4.1,
    reviews: 80,
    imageUrl:
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    featured: false,
    availability: "Available",
    images: [
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    ],
    contact: {
      email: "amugune@hostel.com",
      phone: "+254712345686",
      website: "https://amugunehostel.com",
    },
    location: {
      address: "Main Campus, Block E",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Michael Green",
      phone: "+254712345687",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: [
      "No cooking in rooms",
      "Keep noise levels low",
      "Respect fellow students",
    ],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Laundry", icon: "washing-machine" },
      { name: "Study Room", icon: "book" },
    ],
  },
  {
    id: "6",
    name: "Ngaira Hostel",
    description: "A spacious and well-maintained hostel for male students.",
    type: "On-campus",
    rooms: 17,
    roomCapacity: 2,
    capacity: 34,
    gender: "male",
    price: 12500,
    distance: "incampus",
    rating: 4.0,
    reviews: 75,
    imageUrl:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    featured: false,
    availability: "Available",
    images: [
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    ],
    contact: {
      email: "ngaira@hostel.com",
      phone: "+254712345688",
      website: "https://ngairahostel.com",
    },
    location: {
      address: "Main Campus, Block F",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Sarah White",
      phone: "+254712345689",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: ["No smoking", "Keep rooms tidy", "Respect quiet hours"],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Gym", icon: "dumbbell" },
      { name: "Cafeteria", icon: "coffee" },
    ],
  },
  {
    id: "7",
    name: "Amugitsi Hostel",
    description: "A safe and welcoming hostel for female students.",
    type: "On-campus",
    rooms: 22,
    roomCapacity: 2,
    capacity: 44,
    gender: "female",
    price: 13000,
    distance: "incampus",
    rating: 4.6,
    reviews: 110,
    imageUrl:
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D",
    featured: true,
    availability: "Available",
    images: [
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    ],
    contact: {
      email: "amugitsi@hostel.com",
      phone: "+254712345690",
      website: "https://amugitsihostel.com",
    },
    location: {
      address: "Main Campus, Block G",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Emily Davis",
      phone: "+254712345691",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: [
      "No male visitors",
      "Keep noise levels low",
      "Respect curfew hours",
    ],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Laundry", icon: "washing-machine" },
      { name: "Study Room", icon: "book" },
    ],
  },
  {
    id: "8",
    name: "Maraga Hostel",
    description: "A comfortable and secure hostel for female students.",
    type: "On-campus",
    rooms: 13,
    roomCapacity: 2,
    capacity: 26,
    gender: "female",
    price: 14000,
    distance: "incampus",
    rating: 4.3,
    reviews: 95,
    imageUrl:
      "https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D",
    featured: false,
    availability: "Available",
    images: [
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    ],
    contact: {
      email: "maraga@hostel.com",
      phone: "+254712345692",
      website: "https://maragahostel.com",
    },
    location: {
      address: "Main Campus, Block H",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Laura Wilson",
      phone: "+254712345693",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: ["No smoking", "Keep rooms clean", "Respect quiet hours"],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Gym", icon: "dumbbell" },
      { name: "Cafeteria", icon: "coffee" },
    ],
  },
  {
    id: "9",
    name: "Mwaitsi Hostel",
    description: "A vibrant and lively hostel for female students.",
    type: "On-campus",
    rooms: 13,
    roomCapacity: 2,
    capacity: 26,
    gender: "female",
    price: 13500,
    distance: "incampus",
    rating: 4.4,
    reviews: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1628592102751-ba83b0314276?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D",
    featured: true,
    availability: "Available",
    images: [
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    ],
    contact: {
      email: "mwaitsi@hostel.com",
      phone: "+254712345694",
      website: "https://mwaitsihostel.com",
    },
    location: {
      address: "Main Campus, Block I",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Grace Lee",
      phone: "+254712345695",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: ["No loud music", "Keep bathrooms clean", "Respect curfew hours"],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Swimming Pool", icon: "swimmer" },
      { name: "Cafeteria", icon: "coffee" },
    ],
  },
  {
    id: "10",
    name: "Nolega Hostel",
    description: "A spacious and well-maintained hostel for female students.",
    type: "On-campus",
    rooms: 30,
    roomCapacity: 2,
    capacity: 60,
    gender: "female",
    price: 12500,
    distance: "incampus",
    rating: 4.2,
    reviews: 85,
    imageUrl:
      "https://media.istockphoto.com/id/1990444472/photo/scandinavian-style-cozy-living-room-interior.webp?a=1&b=1&s=612x612&w=0&k=20&c=F5A3eF6myaJpITu5ABnGqNjacGWYskuxeZviU-KpxPE=",
    featured: false,
    availability: "Available",
    images: [
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    ],
    contact: {
      email: "nolega@hostel.com",
      phone: "+254712345696",
      website: "https://nolegahostel.com",
    },
    location: {
      address: "Main Campus, Block J",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Sophia Clark",
      phone: "+254712345697",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: [
      "No pets allowed",
      "Strictly no parties",
      "Keep common areas clean",
    ],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Library", icon: "book" },
      { name: "TV Room", icon: "tv" },
    ],
  },
  {
    id: "11",
    name: "Kenya Hostel",
    description: "A modern and comfortable hostel for female students.",
    type: "On-campus",
    rooms: 10,
    roomCapacity: 4,
    capacity: 40,
    gender: "female",
    price: 12000,
    distance: "incampus",
    rating: 4.1,
    reviews: 80,
    imageUrl:
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    featured: false,
    availability: "Available",
    images: [
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    ],
    contact: {
      email: "kenya@hostel.com",
      phone: "+254712345698",
      website: "https://kenyahostel.com",
    },
    location: {
      address: "Main Campus, Block K",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Olivia Taylor",
      phone: "+254712345699",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: [
      "No cooking in rooms",
      "Keep noise levels low",
      "Respect fellow students",
    ],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Laundry", icon: "washing-machine" },
      { name: "Study Room", icon: "book" },
    ],
  },
  {
    id: "12",
    name: "Tana Hostel",
    description: "A peaceful and serene hostel for female students.",
    type: "On-campus",
    rooms: 20,
    roomCapacity: 4,
    capacity: 40,
    gender: "female",
    price: 11000,
    distance: "incampus",
    rating: 4.0,
    reviews: 75,
    imageUrl:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
    featured: false,
    availability: "Available",
    images: [
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    ],
    contact: {
      email: "tana@hostel.com",
      phone: "+254712345700",
      website: "https://tanahostel.com",
    },
    location: {
      address: "Main Campus, Block L",
      coordinates: { lat: -1.286389, lng: 36.817223 },
    },
    warden: {
      name: "Emma Harris",
      phone: "+254712345701",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    rules: ["No smoking", "Keep rooms tidy", "Respect quiet hours"],
    amenities: [
      { name: "Wi-Fi", icon: "wifi" },
      { name: "Gym", icon: "dumbbell" },
      { name: "Cafeteria", icon: "coffee" },
    ],
  },
];