import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Modal,
} from "react-native";
import {
  Search,
  Filter,
  MapPin,
  Users,
  Bed,
  DollarSign,
  Wifi,
  Car,
  X,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const apartmentData = [
  {
    id: 1,
    name: "Campus View Apartments",
    location: "0.5 miles from campus",
    rooms: 2,
    capacity: 4,
    price: 850,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    amenities: ["WiFi", "Parking", "Laundry"],
    available: "Aug 2025",
  },
  {
    id: 2,
    name: "Student Hub Residences",
    location: "1.2 miles from campus",
    rooms: 1,
    capacity: 2,
    price: 650,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    amenities: ["WiFi", "Gym"],
    available: "Sep 2025",
  },
  {
    id: 3,
    name: "University Heights",
    location: "0.8 miles from campus",
    rooms: 3,
    capacity: 6,
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    amenities: ["WiFi", "Parking", "Laundry", "Gym"],
    available: "Aug 2025",
  },
  {
    id: 4,
    name: "Scholar's Place",
    location: "0.3 miles from campus",
    rooms: 1,
    capacity: 1,
    price: 550,
    image:
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&h=600&fit=crop",
    amenities: ["WiFi", "Laundry"],
    available: "Aug 2025",
  },
  {
    id: 5,
    name: "Collegiate Commons",
    location: "1.5 miles from campus",
    rooms: 4,
    capacity: 8,
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    amenities: ["WiFi", "Parking", "Laundry", "Gym", "Pool"],
    available: "Sep 2025",
  },
  {
    id: 6,
    name: "Bright Hall Studios",
    location: "0.7 miles from campus",
    rooms: 1,
    capacity: 2,
    price: 700,
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop",
    amenities: ["WiFi", "Gym"],
    available: "Aug 2025",
  },
];

export default function StudentApartmentSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 2000,
    rooms: [],
    capacity: [],
    amenities: [],
  });

  const allAmenities = ["WiFi", "Parking", "Laundry", "Gym", "Pool"];

  const filteredApartments = useMemo(() => {
    return apartmentData.filter((apt) => {
      const matchesSearch =
        apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrice =
        apt.price >= filters.minPrice && apt.price <= filters.maxPrice;

      const matchesRooms =
        filters.rooms.length === 0 || filters.rooms.includes(apt.rooms);

      const matchesCapacity =
        filters.capacity.length === 0 ||
        filters.capacity.includes(apt.capacity);

      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every((a) => apt.amenities.includes(a));

      return (
        matchesSearch &&
        matchesPrice &&
        matchesRooms &&
        matchesCapacity &&
        matchesAmenities
      );
    });
  }, [searchQuery, filters]);

  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 2000,
      rooms: [],
      capacity: [],
      amenities: [],
    });
  };

  const activeFilterCount =
    filters.rooms.length + filters.capacity.length + filters.amenities.length;

  const renderApartmentItem = ({ item: apt }) => (
    <View className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-4">
      <Image
        source={{ uri: apt.image }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="font-semibold text-lg text-gray-900 flex-1 mr-2">
            {apt.name}
          </Text>
          <Text className="text-lg font-bold text-blue-600">
            ${apt.price}/mo
          </Text>
        </View>

        <View className="flex-row items-center text-sm text-gray-600 mb-3">
          <MapPin size={16} color="#6b7280" />
          <Text className="text-gray-600 ml-1">{apt.location}</Text>
        </View>

        <View className="flex-row gap-4 mb-3">
          <View className="flex-row items-center gap-1">
            <Bed size={16} color="#374151" />
            <Text className="text-gray-700">
              {apt.rooms} {apt.rooms === 1 ? "Room" : "Rooms"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Users size={16} color="#374151" />
            <Text className="text-gray-700">Up to {apt.capacity}</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mb-3">
          {apt.amenities.map((amenity) => (
            <View key={amenity} className="px-2 py-1 bg-gray-100 rounded">
              <Text className="text-gray-700 text-xs">{amenity}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row justify-between items-center pt-3 border-t border-gray-200">
          <Text className="text-sm text-gray-600">
            Available: {apt.available}
          </Text>
          <TouchableOpacity className="px-4 py-2 bg-blue-500 rounded-lg">
            <Text className="text-white font-medium text-sm">View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Student Housing
          </Text>

          {/* Search Bar */}
          <View className="relative">
            <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <Search size={20} color="#9ca3af" />
            </View>
            <TextInput
              placeholder="Search by name or location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className="mt-3 w-full flex-row items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg"
          >
            <Filter size={20} color="#374151" />
            <Text className="font-medium text-gray-700">Filters</Text>
            {activeFilterCount > 0 && (
              <View className="bg-blue-500 px-2 py-0.5 rounded-full">
                <Text className="text-white text-xs">{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Results */}
      <View className="flex-1 px-4 py-4">
        <Text className="text-sm text-gray-600 mb-4">
          {filteredApartments.length}{" "}
          {filteredApartments.length === 1 ? "apartment" : "apartments"} found
        </Text>

        {filteredApartments.length === 0 ? (
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-gray-500">
              No apartments match your criteria. Try adjusting your filters.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredApartments}
            renderItem={renderApartmentItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row justify-between items-center px-4 py-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-4 py-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-semibold text-gray-900">Filters</Text>
              {activeFilterCount > 0 && (
                <TouchableOpacity onPress={clearFilters}>
                  <Text className="text-sm text-blue-500">Clear all</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Price Range */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Price Range (per month)
              </Text>
              <View className="flex-row gap-3 items-center">
                <TextInput
                  value={filters.minPrice.toString()}
                  onChangeText={(text) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: Number(text) || 0,
                    }))
                  }
                  placeholder="Min"
                  keyboardType="numeric"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <Text className="text-gray-500">-</Text>
                <TextInput
                  value={filters.maxPrice.toString()}
                  onChangeText={(text) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: Number(text) || 2000,
                    }))
                  }
                  placeholder="Max"
                  keyboardType="numeric"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </View>
            </View>

            {/* Rooms */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Rooms
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => toggleFilter("rooms", num)}
                    className={`px-4 py-2 rounded-lg ${
                      filters.rooms.includes(num)
                        ? "bg-blue-500"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`font-medium text-sm ${
                        filters.rooms.includes(num)
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {num} {num === 1 ? "Room" : "Rooms"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Capacity */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Capacity
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[1, 2, 4, 6, 8].map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => toggleFilter("capacity", num)}
                    className={`px-4 py-2 rounded-lg ${
                      filters.capacity.includes(num)
                        ? "bg-blue-500"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`font-medium text-sm ${
                        filters.capacity.includes(num)
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {num} {num === 1 ? "Person" : "People"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amenities */}
            <View className="mb-2">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Amenities
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {allAmenities.map((amenity) => (
                  <TouchableOpacity
                    key={amenity}
                    onPress={() => toggleFilter("amenities", amenity)}
                    className={`px-4 py-2 rounded-lg ${
                      filters.amenities.includes(amenity)
                        ? "bg-blue-500"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`font-medium text-sm ${
                        filters.amenities.includes(amenity)
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {amenity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View className="px-4 py-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={() => setShowFilters(false)}
              className="w-full py-3 bg-blue-500 rounded-lg"
            >
              <Text className="text-white font-medium text-center">
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
