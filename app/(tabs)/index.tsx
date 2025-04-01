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
  Alert,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import FeaturedHostelCard from "@/components/feature-card";
import HostelCard from "@/components/hostel-card";
import { router } from "expo-router";
import { seedHostels, useGetAllHostels } from "@/lib/actions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import seedAllHostels from "@/lib/sanity/seed";

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
const EmptyState = ({ message, onSeed }: { message: string, onSeed?: () => void }) => (
  <View className="justify-center items-center py-10">
    <Ionicons name="search" size={48} color="#D1D5DB" />
    <Text className="text-gray-500 text-center mt-3 px-6 mb-4">{message}</Text>
    {onSeed && (
      <TouchableOpacity
        onPress={onSeed}
        className="bg-indigo-600 py-2 px-6 rounded-lg"
      >
        <Text className="text-white font-medium">Seed Demo Data</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Main Hostels Component
const CampusHostels = () => {
  const { data: hostels, loading: isLoading, error, refetch } = useGetAllHostels();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeGender, setActiveGender] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredHostels, setFilteredHostels] = useState(hostels || []);
  const [sortBy, setSortBy] = useState("rating");
  const [refreshing, setRefreshing] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [seedingHostels, setSeedingHostels] = useState(false);
  const insets = useSafeAreaInsets();

  // Featured hostels
  const featuredHostels = filteredHostels.filter((hostel) => hostel.featured);

  useEffect(() => {
    if (!hostels) return;

    // Filter hostels based on search query and active filters
    let result = [...hostels]; // Create a new array to avoid mutating the original data

    // Filter by search query (hostel name)
    if (searchQuery) {
      result = result.filter((hostel) =>
        hostel.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by hostel type (e.g., "On-campus")
    if (activeType !== "All") {
      result = result.filter((hostel) => 
        hostel.type?.toLowerCase() === activeType.toLowerCase()
      );
    }

    // Filter by gender (e.g., "male", "female")
    if (activeGender !== "All") {
      result = result.filter(
        (hostel) => hostel.gender?.toLowerCase() === activeGender.toLowerCase()
      );
    }

    // Sort hostels
    switch (sortBy) {
      case "price-low":
        result = result.sort((a, b) => (a.price || 0) - (b.price || 0)); // Sort by price (low to high)
        break;
      case "price-high":
        result = result.sort((a, b) => (b.price || 0) - (a.price || 0)); // Sort by price (high to low)
        break;
      case "rating":
        result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); // Sort by rating (high to low)
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
        break;
    }

    setFilteredHostels(result);
  }, [hostels, searchQuery, activeType, activeGender, sortBy]);

  const handleHostelPress = (hostel) => {
    // Navigate to the hostel detail page
    router.push({
      pathname: "/id",
      params: { id: hostel._id },
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch({});
    } catch (e) {
      console.error("Error refreshing hostel data:", e);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const resetFilters = () => {
    setActiveType("All");
    setActiveGender("All");
    setSearchQuery("");
  };

  const handleSeedHostels = async () => {
    try {
      setSeedingHostels(true);
      
      // Show alert to confirm
      Alert.alert(
        "Seed Hostels",
        "This will add sample hostels to the database. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: async () => {
              try {
                await seedHostels();
                Alert.alert("Success", "Hostels seeded successfully!");
                // Refetch after seeding
                await refetch({});
              } catch (error) {
                Alert.alert("Error", 
                  error instanceof Error 
                    ? error.message 
                    : "Failed to seed hostels. Check console for details."
                );
              } finally {
                setSeedingHostels(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error seeding hostels:", error);
      Alert.alert("Error", "Failed to seed hostels. Check console for details.");
    } finally {
      setSeedingHostels(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Pressable onPress={async() => await seedAllHostels()}>
          <Text>Seed Data </Text>
        </Pressable>
        <View className="flex-1">
          {/* Header + Search */}
          <View className="px-4 pt-3 pb-4 bg-white shadow-sm">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-2xl font-bold text-gray-800">
                  Find Hostels
                </Text>
                <Text className="text-gray-500">
                  {filteredHostels.length} hostel
                  {filteredHostels.length !== 1 ? "s" : ""} available
                </Text>
              </View>

              <TouchableOpacity
                className="h-10 w-10 bg-blue-50 rounded-full items-center justify-center"
                onPress={() => setShowSortModal(true)}
              >
                <Ionicons name="options-outline" size={20} color="#3B82F6" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-2 text-gray-800"
                placeholder="Search by hostel name"
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter Chips */}
          <View className="px-4 py-3 bg-white border-t border-gray-100">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-1"
            >
              <View className="flex-row">
                <Text className="text-gray-500 self-center mr-2">Type:</Text>
                {filterOptions.types.map((type) => (
                  <FilterChip
                    key={`type-${type}`}
                    label={type}
                    selected={activeType === type}
                    onPress={() => setActiveType(type)}
                  />
                ))}
              </View>
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-1"
            >
              <View className="flex-row">
                <Text className="text-gray-500 self-center mr-2">Gender:</Text>
                {filterOptions.gender.map((gender) => (
                  <FilterChip
                    key={`gender-${gender}`}
                    label={gender}
                    selected={activeGender === gender}
                    onPress={() => setActiveGender(gender)}
                  />
                ))}
              </View>
            </ScrollView>

            {/* Reset filters button (only show if there are active filters) */}
            {(activeType !== "All" ||
              activeGender !== "All" ||
              searchQuery) && (
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={resetFilters}
              >
                <Text className="text-blue-500 font-medium">Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Content */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {isLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text className="text-gray-500 mt-3">Loading hostels...</Text>
              </View>
            ) : error ? (
              <View className="flex-1 justify-center items-center p-4">
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
                <Text className="text-red-500 font-medium text-center mt-3 mb-1">
                  Error loading hostels
                </Text>
                <Text className="text-gray-500 text-center mb-4">
                  {typeof error === "string"
                    ? error
                    : "Could not load hostels. Please try again."}
                </Text>
                <TouchableOpacity
                  onPress={() => refetch()}
                  className="bg-indigo-600 py-2 px-6 rounded-lg"
                >
                  <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
              </View>
            ) : filteredHostels.length === 0 && !searchQuery ? (
              <EmptyState
                message="No hostels available. Seed some demo data to get started."
                onSeed={() => {
                  Alert.alert(
                    "Seed Hostels",
                    "Would you like to seed demo hostel data?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Seed",
                        onPress: async () => {
                          try {
                            console.log("Seeding hostels...");
                            const response = await fetch(
                              `/api/hostels/seed`
                            );
                            if (response.ok) {
                              const result = await response.json();
                              Alert.alert(
                                "Success",
                                `Successfully seeded ${result.count} hostels.`,
                                [{ text: "OK", onPress: () => refetch() }]
                              );
                            } else {
                              const errorData = await response.json();
                              Alert.alert(
                                "Error",
                                errorData.message || "Failed to seed hostels"
                              );
                            }
                          } catch (error) {
                            console.error("Error seeding hostels:", error);
                            Alert.alert(
                              "Error",
                              "Failed to seed hostels. Please try again."
                            );
                          }
                        },
                      },
                    ]
                  );
                }}
              />
            ) : filteredHostels.length === 0 && searchQuery ? (
              <EmptyState
                message={`No hostels found matching "${searchQuery}"`}
              />
            ) : (
              <>
                {/* Featured Hostels */}
                {featuredHostels.length > 0 && (
                  <View className="py-4">
                    <Text className="px-4 text-lg font-bold text-gray-800 mb-3">
                      Featured Hostels
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 16 }}
                      className="mb-2"
                    >
                      {featuredHostels.map((hostel) => (
                        <FeaturedHostelCard
                          key={hostel._id}
                          hostel={hostel}
                          onPress={() => handleHostelPress(hostel)}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* All Hostels */}
                <View className="p-4">
                  <Text className="text-lg font-bold text-gray-800 mb-3">
                    All Hostels
                  </Text>
                  <View className="space-y-4">
                    {filteredHostels.map((hostel) => (
                      <HostelCard
                        key={hostel._id}
                        hostel={hostel}
                        onPress={() => handleHostelPress(hostel)}
                      />
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Admin Actions (for debug/testing) */}
            <View className="px-4 py-6">
              <TouchableOpacity
                className="bg-gray-200 py-3 rounded-full items-center mb-8"
                onPress={handleSeedHostels}
                disabled={seedingHostels}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="cloud-upload-outline"
                    size={18}
                    color="#4B5563"
                  />
                  <Text className="ml-2 text-gray-700 font-medium">
                    {seedingHostels ? "Seeding..." : "Seed Hostels Data"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Sort Modal */}
          <SortModal
            visible={showSortModal}
            onClose={() => setShowSortModal(false)}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CampusHostels;
