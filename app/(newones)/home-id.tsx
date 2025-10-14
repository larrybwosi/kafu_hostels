import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Users,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Wifi,
  Car,
  Droplet,
  Zap,
  Wind,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Home,
  CheckCircle2,
} from "lucide-react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const apartmentData = {
  id: 1,
  name: "Campus View Apartments",
  tagline: "Modern Living Steps from Campus",
  location: "123 University Ave, College Town",
  distance: "0.5 miles from campus",
  price: 850,
  deposit: 850,
  rooms: 2,
  bathrooms: 2,
  capacity: 4,
  squareFeet: 950,
  available: "August 1, 2025",
  rating: 4.7,
  reviews: 48,
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop",
  ],
  description:
    "Welcome to Campus View Apartments, where modern student living meets convenience. Our spacious 2-bedroom units are designed with students in mind, featuring contemporary finishes, ample storage, and all the amenities you need to succeed academically while enjoying your college experience. Located just a short walk from campus, you'll never miss a class or campus event.",
  amenities: [
    {
      icon: Wifi,
      name: "High-Speed WiFi",
      description: "Gigabit fiber internet included",
    },
    {
      icon: Car,
      name: "Parking",
      description: "1 covered parking spot per unit",
    },
    {
      icon: Droplet,
      name: "In-Unit Laundry",
      description: "Washer and dryer in every apartment",
    },
    {
      icon: Wind,
      name: "Central AC/Heat",
      description: "Climate control year-round",
    },
    {
      icon: Zap,
      name: "All Utilities",
      description: "Water, electricity, and gas included",
    },
    {
      icon: Shield,
      name: "24/7 Security",
      description: "Secure building access and cameras",
    },
  ],
  features: [
    "Fully furnished option available",
    "Modern kitchen with stainless steel appliances",
    "Spacious bedrooms with built-in closets",
    "Study lounge and computer lab",
    "Fitness center with cardio and weights",
    "Game room with pool table",
    "Package receiving service",
    "On-site maintenance team",
    "Bike storage",
    "Pet-friendly (cats allowed)",
  ],
  warden: {
    name: "Sarah Mitchell",
    role: "Property Manager",
    phone: "(555) 123-4567",
    email: "sarah.mitchell@campusview.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Sarah has been managing Campus View for 5 years and is dedicated to creating a safe, comfortable environment for all students. Available 24/7 for emergencies.",
    availability: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
  },
  floorPlan:
    "https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&h=600&fit=crop",
  leaseDuration: "12 months (Academic year options available)",
  policies: [
    "No smoking inside units",
    "Quiet hours: 10PM-8AM on weekdays",
    "Maximum 2 guests overnight",
    "Renter's insurance required",
    "30-day notice to vacate",
  ],
  nearby: [
    { name: "Main Campus", distance: "0.5 mi", time: "10 min walk" },
    { name: "University Library", distance: "0.3 mi", time: "6 min walk" },
    { name: "Student Center", distance: "0.6 mi", time: "12 min walk" },
    { name: "Grocery Store", distance: "0.4 mi", time: "8 min walk" },
    { name: "Bus Stop", distance: "0.1 mi", time: "2 min walk" },
  ],
};

export default function ApartmentDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % apartmentData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + apartmentData.images.length) % apartmentData.images.length
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <View>
            <Text className="font-semibold text-gray-900 mb-2">
              About This Apartment
            </Text>
            <Text className="text-gray-700 mb-4 leading-relaxed">
              {apartmentData.description}
            </Text>

            <Text className="font-semibold text-gray-900 mb-3 mt-6">
              Key Features
            </Text>
            <View className="gap-2">
              {apartmentData.features.map((feature, idx) => (
                <View key={idx} className="flex-row items-start gap-2">
                  <CheckCircle2
                    size={20}
                    color="#10b981"
                    className="flex-shrink-0 mt-0.5"
                  />
                  <Text className="text-gray-700 text-sm flex-1">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            <View className="mt-6 pt-6 border-t border-gray-200">
              <Text className="font-semibold text-gray-900 mb-3">
                Lease Information
              </Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Available From:</Text>
                  <Text className="font-medium">{apartmentData.available}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Lease Duration:</Text>
                  <Text className="font-medium">
                    {apartmentData.leaseDuration}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Security Deposit:</Text>
                  <Text className="font-medium">${apartmentData.deposit}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Bathrooms:</Text>
                  <Text className="font-medium">{apartmentData.bathrooms}</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case "amenities":
        return (
          <View>
            <Text className="font-semibold text-gray-900 mb-4">
              Included Amenities
            </Text>
            <View className="gap-4">
              {apartmentData.amenities.map((amenity, idx) => (
                <View
                  key={idx}
                  className="flex-row gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <amenity.icon size={24} color="#2563eb" />
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">
                      {amenity.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {amenity.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View className="mt-6">
              <Text className="font-semibold text-gray-900 mb-3">
                Floor Plan
              </Text>
              <Image
                source={{ uri: apartmentData.floorPlan }}
                className="w-full h-48 rounded-lg border border-gray-200"
                resizeMode="cover"
              />
            </View>
          </View>
        );

      case "location":
        return (
          <View>
            <Text className="font-semibold text-gray-900 mb-2">Address</Text>
            <Text className="text-gray-700 mb-1">{apartmentData.location}</Text>
            <Text className="text-blue-600 text-sm mb-6">
              {apartmentData.distance}
            </Text>

            <Text className="font-semibold text-gray-900 mb-3">
              Nearby Locations
            </Text>
            <View className="gap-3">
              {apartmentData.nearby.map((place, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <View>
                    <Text className="font-medium text-gray-900">
                      {place.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {place.distance} • {place.time}
                    </Text>
                  </View>
                  <MapPin size={20} color="#9ca3af" />
                </View>
              ))}
            </View>

            <View className="mt-6">
              <View className="w-full h-48 bg-gray-200 rounded-lg items-center justify-center">
                <MapPin size={32} color="#9ca3af" />
              </View>
              <Text className="text-xs text-gray-500 mt-2 text-center">
                Interactive map would be displayed here
              </Text>
            </View>
          </View>
        );

      case "policies":
        return (
          <View>
            <Text className="font-semibold text-gray-900 mb-3">
              House Rules & Policies
            </Text>
            <View className="gap-2">
              {apartmentData.policies.map((policy, idx) => (
                <View key={idx} className="flex-row items-start gap-2">
                  <View className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <Text className="text-gray-700 text-sm flex-1">{policy}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="px-4 py-4 flex-row items-center gap-3">
          <TouchableOpacity className="p-2 rounded-full">
            <ArrowLeft size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Apartment Details
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View className="relative">
          <View className="relative h-72 bg-gray-200">
            <TouchableOpacity onPress={() => setShowImageModal(true)}>
              <Image
                source={{ uri: apartmentData.images[currentImageIndex] }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg"
            >
              <ChevronLeft size={20} color="#374151" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg"
            >
              <ChevronRight size={20} color="#374151" />
            </TouchableOpacity>
            <View className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 rounded-full">
              <Text className="text-white text-sm">
                {currentImageIndex + 1} / {apartmentData.images.length}
              </Text>
            </View>
          </View>

          {/* Thumbnail Strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2 p-4 bg-white"
          >
            {apartmentData.images.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setCurrentImageIndex(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  idx === currentImageIndex
                    ? "border-blue-500"
                    : "border-transparent opacity-60"
                }`}
              >
                <Image
                  source={{ uri: img }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
        <View className="px-4 py-4">
          {/* Title and Price */}
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 mr-2">
                <Text className="text-2xl font-bold text-gray-900">
                  {apartmentData.name}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {apartmentData.tagline}
                </Text>
              </View>
              <View className="text-right">
                <Text className="text-2xl font-bold text-blue-600">
                  ${apartmentData.price}
                </Text>
                <Text className="text-sm text-gray-600">per month</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-2 mb-3">
              <MapPin size={16} color="#6b7280" />
              <Text className="text-sm text-gray-700">
                {apartmentData.location}
              </Text>
            </View>

            <View className="flex-row items-center gap-3 mb-3">
              <View className="flex-row items-center gap-1">
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <Text className="font-semibold">{apartmentData.rating}</Text>
                <Text className="text-gray-600 text-sm">
                  ({apartmentData.reviews} reviews)
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between pt-3 border-t border-gray-200">
              <View className="items-center flex-1">
                <Bed size={20} color="#6b7280" />
                <Text className="text-sm font-semibold mt-1">
                  {apartmentData.rooms} Rooms
                </Text>
              </View>
              <View className="items-center flex-1">
                <Users size={20} color="#6b7280" />
                <Text className="text-sm font-semibold mt-1">
                  Up to {apartmentData.capacity}
                </Text>
              </View>
              <View className="items-center flex-1">
                <Home size={20} color="#6b7280" />
                <Text className="text-sm font-semibold mt-1">
                  {apartmentData.squareFeet} sq ft
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="bg-white rounded-lg mb-4 shadow-sm overflow-hidden">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="border-b border-gray-200"
            >
              <View className="flex-row">
                {["overview", "amenities", "location", "policies"].map(
                  (tab) => (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab)}
                      className={`px-4 py-3 font-medium text-sm ${
                        activeTab === tab
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-600"
                      }`}
                    >
                      <Text
                        className={`font-medium text-sm ${
                          activeTab === tab ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </ScrollView>

            <View className="p-4">{renderTabContent()}</View>
          </View>

          {/* Property Manager Card */}
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <Text className="font-semibold text-gray-900 mb-3">
              Property Manager
            </Text>
            <View className="flex-row gap-3">
              <Image
                source={{ uri: apartmentData.warden.image }}
                className="w-16 h-16 rounded-full"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="font-medium text-gray-900">
                  {apartmentData.warden.name}
                </Text>
                <Text className="text-sm text-gray-600 mb-2">
                  {apartmentData.warden.role}
                </Text>
                <Text className="text-xs text-gray-600 mb-2">
                  {apartmentData.warden.bio}
                </Text>
              </View>
            </View>

            <View className="mt-3 pt-3 border-t border-gray-200 gap-2">
              <View className="flex-row items-center gap-2">
                <Clock size={16} color="#6b7280" />
                <Text className="text-gray-700 text-sm">
                  {apartmentData.warden.availability}
                </Text>
              </View>
              <View className="flex-row gap-2 mt-3">
                <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 px-4 py-2 bg-blue-500 rounded-lg">
                  <Phone size={16} color="white" />
                  <Text className="text-white font-medium text-sm">Call</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <Mail size={16} color="#374151" />
                  <Text className="text-gray-700 font-medium text-sm">
                    Email
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Padding for Fixed CTA */}
        <View className="h-32" />
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <View className="flex-row gap-3">
          <TouchableOpacity className="flex-1 px-6 py-3 bg-blue-500 rounded-lg">
            <Text className="text-white font-semibold text-center">
              Schedule Tour
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 px-6 py-3 bg-green-500 rounded-lg">
            <Text className="text-white font-semibold text-center">
              Apply Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Modal */}
      <Modal
        visible={showImageModal}
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
      >
        <View className="flex-1 bg-black">
          <TouchableOpacity
            onPress={() => setShowImageModal(false)}
            className="absolute top-12 right-4 z-10 p-2 bg-white/10 rounded-full"
          >
            <X size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-1 justify-center">
            <Image
              source={{ uri: apartmentData.images[currentImageIndex] }}
              className="w-full h-96"
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            onPress={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full"
          >
            <ChevronRight size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
