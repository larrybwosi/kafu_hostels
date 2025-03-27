import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import FeaturedHostelCard from "@/components/feature-card";
import HostelCard from "@/components/hostel-card";
import { router } from "expo-router";
import { useGetAllHostels } from "@/lib/actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Get screen dimensions for responsive sizing
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Filter options
const filterOptions = {
  types: ["All", "On-campus", "Off-campus"],
  gender: ["All", "Male", "Female"],
  roomCapacity: [1, 2, 3, 4],
  availability: ["High", "Medium", "Low"],
};

interface FilterChipProps {
  label: string | number;
  selected: boolean;
  onPress: () => void;
}

// Filter Chip Component
const FilterChip = ({ label, selected, onPress }: FilterChipProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`mr-2 px-4 py-2 rounded-full ${
        selected ? "bg-blue-500" : "bg-gray-200"
      } mb-2`}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? "text-white" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

// Sort Modal Component
const SortModal = ({ visible, onClose, sortBy, setSortBy }: SortModalProps) => {
  const insets = useSafeAreaInsets();

  const sortOptions = [
    { id: "rating", label: "Top Rated" },
    { id: "price-low", label: "Price (Low to High)" },
    { id: "price-high", label: "Price (High to Low)" },
    { id: "distance", label: "Distance to Campus" },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{ paddingBottom: insets.bottom }}
          className="bg-white rounded-t-3xl absolute bottom-0 w-full p-5"
        >
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-5" />
          <Text className="text-xl font-bold text-gray-800 mb-4">Sort By</Text>

          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              className={`p-4 border-b border-gray-100 flex-row justify-between items-center`}
              onPress={() => {
                setSortBy(option.id);
                onClose();
              }}
            >
              <Text className="text-base text-gray-800">{option.label}</Text>
              {sortBy === option.id && (
                <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="mt-4 p-4 bg-gray-100 rounded-full"
            onPress={onClose}
          >
            <Text className="text-center font-medium text-gray-700">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// Empty State Component
const EmptyState = ({ message }: { message: string }) => (
  <View className="justify-center items-center py-10">
    <Ionicons name="search" size={48} color="#D1D5DB" />
    <Text className="text-gray-500 text-center mt-3 px-6">{message}</Text>
  </View>
);

// Main Hostels Component
const CampusHostels = () => {
  const { data, loading: isLoading, error, refetch } = useGetAllHostels();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeGender, setActiveGender] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHostels, setFilteredHostels] = useState(data || []);
  const [sortBy, setSortBy] = useState("rating");
  const [refreshing, setRefreshing] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const insets = useSafeAreaInsets();

  // Featured hostels
  const featuredHostels = (data || []).filter((hostel) => hostel.featured);

  useEffect(() => {
    if (!data) return;

    // Filter hostels based on search query and active filters
    let result = [...data]; // Create a new array to avoid mutating the original data

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
        (hostel) => hostel.gender === activeGender.toLowerCase()
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
    // Handle hostel selection with haptic feedback if available
    // You would need to add a haptic feedback library for this
    router.navigate(`/id?id=${hostel.id}`);
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch({});
    setRefreshing(false);
  }, [refetch]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setActiveType("All");
    setActiveGender("All");
    setSortBy("rating");
  };

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
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="text-red-500 mt-4 text-center">
          Unable to load hostels. Please check your connection and try again.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-blue-500 px-6 py-3 rounded-full"
          onPress={refetch}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasActiveFilters =
    activeType !== "All" || activeGender !== "All" || searchQuery !== "";

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2 bg-white shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-gray-800">
              Campus Hostels
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setShowSortModal(true)}
                className="mr-4"
              >
                <Ionicons name="funnel-outline" size={22} color="#3B82F6" />
              </TouchableOpacity>
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
              clearButtonMode="while-editing"
              returnKeyType="search"
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
              exiting={FadeOutUp.duration(200)}
              className="mt-3 pb-3"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-700 font-medium">Hostel Type:</Text>
                {hasActiveFilters && (
                  <TouchableOpacity onPress={resetFilters}>
                    <Text className="text-blue-500">Reset All</Text>
                  </TouchableOpacity>
                )}
              </View>

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

              <View className="mt-4 flex-row items-center">
                <Text className="text-sm text-gray-500">
                  {filteredHostels.length}{" "}
                  {filteredHostels.length === 1 ? "hostel" : "hostels"} found
                </Text>
              </View>
            </Animated.View>
          )}
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Featured Hostels Section */}
          {featuredHostels.length > 0 && (
            <View className="mt-4 pb-4">
              <View className="px-4 flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold text-gray-800">
                  Featured Hostels
                </Text>
                <TouchableOpacity>
                  <Text className="text-blue-500 font-medium">View All</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                data={featuredHostels}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
                renderItem={({ item }) => (
                  <FeaturedHostelCard
                    hostel={item}
                    onPress={() => handleHostelPress(item)}
                  />
                )}
                initialNumToRender={3}
                maxToRenderPerBatch={5}
                windowSize={5}
              />
            </View>
          )}

          {/* All Hostels Section */}
          <View
            className="px-4 pt-2 pb-6"
            style={{ paddingBottom: insets.bottom + 20 }}
          >
            <Text className="text-lg font-bold text-gray-800 mb-3">
              All Hostels
            </Text>

            {filteredHostels.length === 0 ? (
              <EmptyState
                message={
                  hasActiveFilters
                    ? "No hostels match your search criteria.\nTry adjusting your filters."
                    : "No hostels available at the moment.\nPull down to refresh."
                }
              />
            ) : (
              filteredHostels.map((hostel) => (
                <HostelCard
                  key={hostel.id}
                  hostel={hostel}
                  onPress={() => handleHostelPress(hostel)}
                />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sort Modal */}
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </SafeAreaView>
  );
};

export default CampusHostels;
