import { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
  SafeAreaView,
  Linking,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Carousel from "@/components/ui/carousel";
import { useGetHostel } from "@/lib/actions";
import { formatCurrency } from "@/lib/currency";
import { useSession } from "@/lib/auth-client";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Review {
  userName: string;
  userImage: string;
  date: string;
  rating: number;
  comment: string;
}
  interface CarouselItem {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
  }

// ReviewCard Component
const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <View className="mb-4 p-4 bg-white rounded-xl shadow-sm">
      <View className="flex-row mb-3">
        <Image
          source={{ uri: review.userImage }}
          className="h-10 w-10 rounded-full"
        />
        <View className="ml-3">
          <Text className="font-bold text-gray-800">{review.userName}</Text>
          <Text className="text-gray-500 text-xs">{review.date}</Text>
        </View>
        <View className="ml-auto flex-row items-center">
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text className="ml-1 font-bold">{review.rating}</Text>
        </View>
      </View>
      <Text className="text-gray-700">{review.comment}</Text>
    </View>
  );
};

// Section Header Component
const SectionHeader = ({ title, icon }: { title: string; icon: string }) => {
  return (
    <View className="flex-row items-center mb-3 mt-6">
      <FontAwesome5 name={icon} size={16} color="#3B82F6" />
      <Text className="text-lg font-bold text-gray-800 ml-2">{title}</Text>
    </View>
  );
};

// Amenity Item Component
const AmenityItem = ({ name, icon }: { name: string; icon: string }) => {
  return (
    <View className="items-center mr-5 mb-4 w-16">
      <View className="h-12 w-12 rounded-full bg-blue-100 items-center justify-center mb-1">
        <FontAwesome5 name={icon} size={18} color="#3B82F6" />
      </View>
      <Text className="text-xs text-center text-gray-700">{name}</Text>
    </View>
  );
};

// Booking Floating Button Component
const BookingButton = ({
  price,
  onPress,
}: {
  price: string;
  onPress: () => void;
}) => {
  return (
    <BlurView
      intensity={80}
      tint="light"
      className="absolute bottom-0 left-0 right-0 p-4 flex-row items-center justify-between"
    >
      <View>
        <Text className="text-gray-700 text-xs">Price per semester</Text>
        <Text className="text-2xl font-bold text-blue-600">
          {formatCurrency(Number(price))}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onPress}
        className="bg-blue-600 py-3 px-6 rounded-full"
      >
        <Text className="text-white font-bold">Book Now</Text>
      </TouchableOpacity>
    </BlurView>
  );
};

// Main Hostel Detail Component
const HostelDetail = () => {
  const { id } = useLocalSearchParams()
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { data:hostel, loading, error, refetch } = useGetHostel(id as string);
  const { data, isPending } = useSession()

  // Mock reviews data
  const reviews = [
    {
      id: "1",
      userName: "Michael Peters",
      userImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      rating: 4.9,
      date: "Oct 12, 2024",
      comment:
        "Excellent facilities and very clean. The staff are friendly and the location is perfect for students.",
    },
    {
      id: "2",
      userName: "Emma Johnson",
      userImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      date: "Sep 28, 2024",
      comment:
        "Great amenities and the study rooms are perfect for group projects. The gym could be bigger though.",
    },
  ];

  // Calculate header opacity for scroll effect
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  if (loading || isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error || !hostel) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error: {error}</Text>
      </View>
    );
  }
  // Handle booking
  const handleBooking = (id: string) => {
    if (hostel.gender !== data?.user?.gender) {
      Alert.alert(
        "Gender Mismatch",
        "You cannot book a hostel for a different gender.",
        [{ text: "OK" }]
      )
      return
    }
    router.push(`/booking?id=${id}`);
  };

  // Handle contact
  const handleContact = (type: "phone" | "email" | "website") => {
    switch (type) {
      case "phone":
        Linking.openURL(`tel:${hostel?.contact.phone}`);
        break;
      case "email":
        Linking.openURL(`mailto:${hostel?.contact.email}`);
        break;
      case "website":
        Linking.openURL(hostel?.contact?.website || "");
        break;
    }
  };
  const carouselData: CarouselItem[] = hostel?.images.map((image, index) => ({
    id: index.toString(),
    imageUrl: image,
    title: `Image ${index + 1}`,
    description: `Description for Image ${index + 1}`,
  }));

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Animated Header */}
      <Animated.View
        className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 py-3"
        style={{
          backgroundColor: "white",
          opacity: headerOpacity,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="ml-4 text-lg font-bold text-gray-800 flex-1">
            {hostel.name}
          </Text>
        </View>
        <TouchableOpacity className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center">
          <Ionicons name="heart-outline" size={18} color="#374151" />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Carousel */}
        <View className="relative" style={{ height: SCREEN_WIDTH * 0.7 }}>
          <Carousel
            data={carouselData}
            autoPlay={true}
            interval={5000}
            showDots={true}
            showControls={true}
            onItemPress={() => {}}
          />
          <TouchableOpacity
            className="absolute top-12 left-4 h-8 w-8 bg-black/30 rounded-full items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="absolute top-12 right-4 h-8 w-8 bg-black/30 rounded-full items-center justify-center"
            onPress={() => console.log("Add to favorites")}
          >
            <Ionicons name="heart-outline" size={18} color="white" />
          </TouchableOpacity>

          {/* Carousel Indicators */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
            {hostel.images.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  activeImageIndex === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Hostel Info */}
        <View className="px-4 pt-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                {hostel.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text className="ml-1 text-gray-700">
                  {hostel.rating} ({hostel.reviews} reviews)
                </Text>
                <View className="h-1 w-1 bg-gray-400 rounded-full mx-2" />
                <Text className="text-gray-700">{hostel.type}</Text>
              </View>
            </View>
          </View>

          {/* Location */}
          <View className="flex-row items-center mt-3">
            <MaterialIcons name="location-on" size={16} color="#6B7280" />
            <Text className="ml-1 text-gray-600">
              {hostel.location.address}
            </Text>
            <Text className="ml-1 text-blue-600 text-sm">
              • {hostel.distance} km from campus
            </Text>
          </View>

          {/* Description */}
          <Text className="text-gray-700 mt-4 leading-6">
            {hostel.description}
          </Text>

          {/* Stats Overview */}
          <View className="flex-row justify-between mt-6 bg-blue-50 p-4 rounded-xl">
            <View className="items-center">
              <Text className="text-xs text-gray-600">Capacity</Text>
              <Text className="text-lg font-bold text-gray-800">
                {hostel.capacity}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-600">Rooms</Text>
              <Text className="text-lg font-bold text-gray-800">
                {hostel.rooms}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-600">Room Type</Text>
              <Text className="text-lg font-bold text-gray-800">
                {hostel.roomCapacity} Person
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-600">Gender</Text>
              <Text className="text-lg font-bold text-gray-800">
                {hostel.gender}
              </Text>
            </View>
          </View>

          {/* Amenities */}
          <SectionHeader title="Amenities" icon="concierge-bell" />
          <View className="flex-row flex-wrap">
            {hostel.amenities.map((amenity, index) => (
              <AmenityItem
                key={index}
                name={amenity.name}
                icon={amenity.icon}
              />
            ))}
          </View>

          {/* Rules */}
          <SectionHeader title="Hostel Rules" icon="clipboard-list" />
          <View className="bg-gray-50 p-4 rounded-xl">
            {hostel.rules.map((rule, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <View className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                <Text className="text-gray-700">{rule}</Text>
              </View>
            ))}
          </View>

          {/* Warden */}
          <SectionHeader title="Contact Warden" icon="user" />
          <View className="flex-row items-center bg-white p-4 rounded-xl shadow-sm">
            <Image
              source={{ uri: hostel.warden.image }}
              className="h-16 w-16 rounded-full"
            />
            <View className="ml-4">
              <Text className="font-bold text-gray-800">
                {hostel.warden.name}
              </Text>
              <Text className="text-gray-600">{hostel.warden.phone}</Text>
              <TouchableOpacity
                className="bg-blue-100 px-4 py-2 rounded-full mt-2"
                onPress={() => Linking.openURL(`tel:${hostel.warden.phone}`)}
              >
                <Text className="text-blue-700 text-sm font-medium">
                  Call Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact */}
          <SectionHeader title="Contact Information" icon="address-book" />
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => handleContact("phone")}
              className="flex-1 bg-white mr-2 p-4 rounded-xl items-center shadow-sm"
            >
              <MaterialIcons name="phone" size={24} color="#3B82F6" />
              <Text className="text-gray-700 mt-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleContact("email")}
              className="flex-1 bg-white mx-2 p-4 rounded-xl items-center shadow-sm"
            >
              <MaterialIcons name="email" size={24} color="#3B82F6" />
              <Text className="text-gray-700 mt-2">Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleContact("website")}
              className="flex-1 bg-white ml-2 p-4 rounded-xl items-center shadow-sm"
            >
              <MaterialIcons name="language" size={24} color="#3B82F6" />
              <Text className="text-gray-700 mt-2">Website</Text>
            </TouchableOpacity>
          </View>

          {/* Reviews */}
          <SectionHeader title="Reviews" icon="star" />
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          <TouchableOpacity
            className="bg-white border border-blue-500 rounded-xl p-4 items-center mt-2"
            onPress={() => console.log("View all reviews")}
          >
            <Text className="text-blue-600 font-medium">View All Reviews</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Booking Button */}
      <BookingButton price={hostel.price.toString()} onPress={()=>handleBooking(hostel?.id)} />
    </SafeAreaView>
  );
};

export default HostelDetail;
