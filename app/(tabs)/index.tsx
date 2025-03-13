import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

interface Hostel {
  id: string;
  name: string;
  type: string;
  rooms: number;
  roomCapacity: number;
  capacity: number;
  gender: string;
  price: number;
  distance: number;
  rating: number;
  amenities: string[];
  imageUrl: string;
  featured: boolean;
  availability: string;
}
// Mock Data for Hostels
const hostelData = [
  {
    id: "1",
    name: "Oakwood Hall",
    type: "Premium",
    rooms: 120,
    roomCapacity: 2,
    capacity: 240,
    gender: "Mixed",
    price: 750,
    distance: 0.5,
    rating: 4.8,
    amenities: ["WiFi", "Gym", "Laundry", "Study Room", "Kitchen"],
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    featured: true,
    availability: "High",
  },
  {
    id: "2",
    name: "Maple House",
    type: "Standard",
    rooms: 80,
    roomCapacity: 4,
    capacity: 320,
    gender: "Female",
    price: 550,
    distance: 1.2,
    rating: 4.5,
    amenities: ["WiFi", "Laundry", "Common Room"],
    imageUrl:
      "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    featured: true,
    availability: "Medium",
  },
  {
    id: "3",
    name: "Pine Lodge",
    type: "Economy",
    rooms: 150,
    roomCapacity: 3,
    capacity: 450,
    gender: "Male",
    price: 450,
    distance: 0.8,
    rating: 4.2,
    amenities: ["WiFi", "Vending Machines"],
    imageUrl:
      "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    featured: false,
    availability: "Low",
  },
  {
    id: "4",
    name: "Cedar Heights",
    type: "Premium",
    rooms: 90,
    roomCapacity: 2,
    capacity: 180,
    gender: "Mixed",
    price: 800,
    distance: 1.5,
    rating: 4.9,
    amenities: ["WiFi", "Gym", "Pool", "Study Rooms", "Cafe"],
    imageUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    featured: true,
    availability: "Low",
  },
  {
    id: "5",
    name: "Birch Dormitory",
    type: "Standard",
    rooms: 100,
    roomCapacity: 2,
    capacity: 200,
    gender: "Female",
    price: 600,
    distance: 0.3,
    rating: 4.6,
    amenities: ["WiFi", "Study Areas", "Laundry"],
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    featured: false,
    availability: "High",
  },
  {
    id: "6",
    name: "Willow Residence",
    type: "Economy",
    rooms: 130,
    roomCapacity: 4,
    capacity: 520,
    gender: "Male",
    price: 400,
    distance: 2.0,
    rating: 4.0,
    amenities: ["WiFi", "Basic Amenities"],
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    featured: false,
    availability: "Medium",
  },
];

// Filter options
const filterOptions = {
  types: ["All", "Premium", "Standard", "Economy"],
  gender: ["All", "Male", "Female", "Mixed"],
  roomCapacity: [1, 2, 3, 4],
  availability: ["High", "Medium", "Low"],
};

// Component for displaying availability tag
const AvailabilityTag = ({ availability }: { availability: string }) => {
  let bgColor = "";
  let textColor = "text-white";

  switch (availability) {
    case "High":
      bgColor = "bg-green-500";
      break;
    case "Medium":
      bgColor = "bg-yellow-500";
      break;
    case "Low":
      bgColor = "bg-red-500";
      break;
    default:
      bgColor = "bg-gray-500";
  }

  return (
    <View
      className={`${bgColor} rounded-full px-2 py-1 absolute top-2 right-2`}
    >
      <Text className={`${textColor} text-xs font-medium`}>{availability}</Text>
    </View>
  );
};

interface HostelCardProps {
  hostel: Hostel;
  onPress: (hostel: Hostel) => void;
}

// Featured Hostel Card Component
const FeaturedHostelCard = ({ hostel, onPress }: HostelCardProps) => {
  return (
    <Animated.View
      entering={FadeInRight.delay(hostel.id * 100).duration(400)}
      className="mr-4 w-72 rounded-xl overflow-hidden shadow-lg bg-white"
    >
      <TouchableOpacity onPress={() => onPress(hostel)} activeOpacity={0.9}>
        <View className="relative">
          <Image
            source={{ uri: hostel.imageUrl }}
            className="h-40 w-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            className="absolute inset-0"
          />
          <View className="absolute bottom-0 left-0 p-3">
            <Text className="text-white text-xl font-bold">{hostel.name}</Text>
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text className="text-white ml-1">{hostel.rating}</Text>
              <View className="w-1 h-1 bg-white rounded-full mx-2" />
              <Text className="text-white text-xs">{hostel.type}</Text>
            </View>
          </View>
          <AvailabilityTag availability={hostel.availability} />
          <View className="absolute top-2 left-2 bg-blue-500 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-bold">FEATURED</Text>
          </View>
        </View>

        <View className="p-3">
          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center">
              <FontAwesome5 name="building" size={12} color="#6B7280" />
              <Text className="text-gray-600 text-xs ml-1">
                {hostel.rooms} rooms
              </Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome5 name="users" size={12} color="#6B7280" />
              <Text className="text-gray-600 text-xs ml-1">
                {hostel.gender}
              </Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome5 name="user-friends" size={12} color="#6B7280" />
              <Text className="text-gray-600 text-xs ml-1">
                {hostel.roomCapacity}/room
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-blue-600 font-bold">
              ${hostel.price}/month
            </Text>
            <View className="flex-row items-center">
              <FontAwesome5 name="walking" size={12} color="#6B7280" />
              <Text className="text-gray-600 text-xs ml-1">
                {hostel.distance} km to campus
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface HostelCardProps {
  hostel: Hostel;
  onPress: (hostel: Hostel) => void;
}
// Regular Hostel Card Component
const HostelCard = ({ hostel, onPress }: HostelCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(hostel.id * 100).duration(400)}
      className="mb-4 rounded-xl overflow-hidden shadow-lg bg-white"
    >
      <TouchableOpacity onPress={() => onPress(hostel)} activeOpacity={0.9}>
        <View className="flex-row">
          <View className="relative w-1/3">
            <Image
              source={{ uri: hostel.imageUrl }}
              className="h-40 w-full"
              resizeMode="cover"
            />
            <AvailabilityTag availability={hostel.availability} />
          </View>

          <View className="p-3 flex-1 justify-between">
            <View>
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-800">
                  {hostel.name}
                </Text>
                <View className="flex-row items-center">
                  <MaterialIcons name="star" size={16} color="#FFD700" />
                  <Text className="ml-1">{hostel.rating}</Text>
                </View>
              </View>

              <Text className="text-blue-500 text-xs font-medium mt-1">
                {hostel.type}
              </Text>

              <View className="flex-row flex-wrap mt-2">
                <View className="flex-row items-center mr-3 mb-1">
                  <FontAwesome5 name="building" size={10} color="#6B7280" />
                  <Text className="text-gray-600 text-xs ml-1">
                    {hostel.rooms} rooms
                  </Text>
                </View>
                <View className="flex-row items-center mr-3 mb-1">
                  <FontAwesome5 name="users" size={10} color="#6B7280" />
                  <Text className="text-gray-600 text-xs ml-1">
                    {hostel.gender}
                  </Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <FontAwesome5 name="user-friends" size={10} color="#6B7280" />
                  <Text className="text-gray-600 text-xs ml-1">
                    {hostel.roomCapacity}/room
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-blue-600 font-bold">
                ${hostel.price}/month
              </Text>
              <View className="flex-row items-center">
                <FontAwesome5 name="walking" size={10} color="#6B7280" />
                <Text className="text-gray-600 text-xs ml-1">
                  {hostel.distance} km
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}
// Filter Chip Component
const FilterChip = ({ label, selected, onPress }: FilterChipProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mr-2 px-3 py-1 rounded-full ${
        selected ? "bg-blue-500" : "bg-gray-200"
      }`}
    >
      <Text
        className={`text-xs font-medium ${
          selected ? "text-white" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Main Hostels Component
const CampusHostels = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeGender, setActiveGender] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHostels, setFilteredHostels] = useState(hostelData);
  const [sortBy, setSortBy] = useState("rating");

  // Featured hostels
  const featuredHostels = hostelData.filter((hostel) => hostel.featured);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    // Filter hostels based on search query and active filters
    let result = hostelData;

    if (searchQuery) {
      result = result.filter((hostel) =>
        hostel.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeType !== "All") {
      result = result.filter((hostel) => hostel.type === activeType);
    }

    if (activeGender !== "All") {
      result = result.filter((hostel) => hostel.gender === activeGender);
    }

    // Sort hostels
    switch (sortBy) {
      case "price-low":
        result = result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      case "distance":
        result = result.sort((a, b) => a.distance - b.distance);
        break;
      default:
        result = result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredHostels(result);
  }, [searchQuery, activeType, activeGender, sortBy]);

  const handleHostelPress = (hostel: Hostel) => {
    // Handle hostel selection
    console.log("Selected hostel:", hostel);
    // You would typically navigate to a detail screen here
  };

  const renderSortOptions = () => (
    <View className="flex-row pb-3 border-b border-gray-200">
      <Text className="text-gray-700 font-medium mr-2">Sort by:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FilterChip
          label="Top Rated"
          selected={sortBy === "rating"}
          onPress={() => setSortBy("rating")}
        />
        <FilterChip
          label="Price (Low to High)"
          selected={sortBy === "price-low"}
          onPress={() => setSortBy("price-low")}
        />
        <FilterChip
          label="Price (High to Low)"
          selected={sortBy === "price-high"}
          onPress={() => setSortBy("price-high")}
        />
        <FilterChip
          label="Distance to Campus"
          selected={sortBy === "distance"}
          onPress={() => setSortBy("distance")}
        />
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading hostels...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View className="px-4 pt-4 pb-2 bg-white">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-800">
            Campus Hostels
          </Text>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="flex-row items-center"
          >
            <Text className="text-blue-500 font-medium mr-1">Filters</Text>
            <Ionicons
              name={showFilters ? "chevron-up" : "chevron-down"}
              size={16}
              color="#3B82F6"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-3 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search hostels..."
            placeholderTextColor="#6B7280"
            className="ml-2 flex-1 text-gray-800"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Options */}
        {showFilters && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            className="mt-3 pb-3"
          >
            <Text className="text-gray-700 font-medium mb-2">Hostel Type:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-3"
            >
              {filterOptions.types.map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  selected={activeType === type}
                  onPress={() => setActiveType(type)}
                />
              ))}
            </ScrollView>

            <Text className="text-gray-700 font-medium mb-2">Gender:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filterOptions.gender.map((gender) => (
                <FilterChip
                  key={gender}
                  label={gender}
                  selected={activeGender === gender}
                  onPress={() => setActiveGender(gender)}
                />
              ))}
            </ScrollView>

            {renderSortOptions()}
          </Animated.View>
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Featured Hostels Section */}
        <View className="mt-4 pb-4">
          <View className="px-4 flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">
              Featured Hostels
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          >
            {featuredHostels.map((hostel) => (
              <FeaturedHostelCard
                key={hostel.id}
                hostel={hostel}
                onPress={handleHostelPress}
              />
            ))}
          </ScrollView>
        </View>

        {/* All Hostels Section */}
        <View className="px-4 pt-2 pb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            All Hostels
          </Text>

          {filteredHostels.length === 0 ? (
            <View className="justify-center items-center py-10">
              <Ionicons name="search" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 text-center mt-3">
                No hostels match your search criteria.{"\n"}
                Try adjusting your filters.
              </Text>
            </View>
          ) : (
            filteredHostels.map((hostel) => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                onPress={handleHostelPress}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CampusHostels;
