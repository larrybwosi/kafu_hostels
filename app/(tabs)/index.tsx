import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import FeaturedHostelCard from "@/components/feature-card";
import HostelCard from "@/components/hostel-card";
import { router } from "expo-router";
import { useGetAllHostels } from "@/lib/actions";

// Filter options
const filterOptions = {
  types: ["All", "On-campus", "Off-campus"], // Updated types
  gender: ["All", "Male", "Female"], // Updated gender options
  roomCapacity: [1, 2, 3, 4],
  availability: ["High", "Medium", "Low"],
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
  const { data, loading: isLoading, error } = useGetAllHostels();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeGender, setActiveGender] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHostels, setFilteredHostels] = useState(data || []);
  const [sortBy, setSortBy] = useState("rating");

  // Featured hostels
  const featuredHostels = (data || []).filter((hostel) => hostel.featured);

  useEffect(() => {
    if (!data) return;

    // Filter hostels based on search query and active filters
    let result = data;

    // Filter by search query (hostel name)
    if (searchQuery) {
      result = result.filter((hostel) =>
        hostel.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by hostel type (e.g., "On-campus")
    if (activeType !== "All") {
      result = result.filter((hostel) => hostel.type === activeType);
    }

    // Filter by gender (e.g., "male", "female")
    if (activeGender !== "All") {
      result = result.filter(
        (hostel) => hostel.gender === activeGender.toLocaleLowerCase()
      );
    }

    // Sort hostels
    switch (sortBy) {
      case "price-low":
        result = result.sort((a, b) => a.price - b.price); // Sort by price (low to high)
        break;
      case "price-high":
        result = result.sort((a, b) => b.price - a.price); // Sort by price (high to low)
        break;
      case "rating":
        result = result.sort((a, b) => b.rating - a.rating); // Sort by rating (high to low)
        break;
      case "distance":
        // Handle "incampus" distance case
        result = result.sort((a, b) => {
          if (a.distance === "incampus" && b.distance === "incampus") return 0;
          if (a.distance === "incampus") return -1;
          if (b.distance === "incampus") return 1;
          return (a.distance || 0) - (b.distance || 0); // Sort by distance (low to high)
        });
        break;
      default:
        result = result.sort((a, b) => b.rating - a.rating); // Default sort by rating (high to low)
    }

    // Update the filtered hostels state
    setFilteredHostels(result);
  }, [searchQuery, activeType, activeGender, sortBy, data]);

  const handleHostelPress = (hostel: Hostel) => {
    // Handle hostel selection
    router.navigate(`/id?id=${hostel.id}`);
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

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading hostels...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-5">
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
