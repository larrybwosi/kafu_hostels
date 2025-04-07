import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AvailabilityTag from "./availability-tag";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Hostel } from "@/lib/actions";
import { router } from "expo-router";

interface HostelCardProps {
  hostel: Hostel;
}

const HostelCard = ({ hostel }: HostelCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(Number(hostel._id) * 100).duration(400)}
      className="mb-4 rounded-xl overflow-hidden shadow-lg bg-white w-full max-w-screen-sm mx-auto"
    >
      <TouchableOpacity onPress={() => router.navigate(`/id?id=${hostel._id}`)} activeOpacity={0.9}>
        <View className="flex-row">
          {/* Image Container */}
          <View className="relative w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6">
            <Image
              source={{ uri: hostel.imageUrl }}
              className="h-40 w-full"
              resizeMode="cover"
            />
            <AvailabilityTag availability={hostel.availability} />
          </View>

          {/* Details Container */}
          <View className="p-3 flex-1 justify-between">
            <View>
              {/* Title and Rating */}
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">
                  {hostel.name}
                </Text>
                <View className="flex-row items-center">
                  <MaterialIcons name="star" size={16} color="#FFD700" />
                  <Text className="ml-1 text-sm sm:text-base md:text-lg">
                    {hostel.rating}
                  </Text>
                </View>
              </View>

              {/* Hostel Type */}
              <Text className="text-blue-500 text-xs font-medium mt-1 sm:text-sm md:text-base">
                {hostel.type}
              </Text>

              {/* Features */}
              <View className="flex-row flex-wrap mt-2">
                <View className="flex-row items-center mr-3 mb-1">
                  <FontAwesome5 name="building" size={10} color="#6B7280" />
                  <Text className="text-gray-600 text-xs ml-1 sm:text-sm md:text-base">
                    {hostel.rooms} rooms
                  </Text>
                </View>
                <View className="flex-row items-center mr-3 mb-1">
                  <FontAwesome5 name="users" size={10} color="#6B7280" />
                  <Text className="text-gray-600 text-xs ml-1 sm:text-sm md:text-base">
                    {hostel.gender}
                  </Text>
                </View>
                <View className="flex-row items-center mb-1">
                  <FontAwesome5 name="user-friends" size={10} color="#6B7280" />
                  <Text className="text-gray-600 text-xs ml-1 sm:text-sm md:text-base">
                    {hostel.roomCapacity}/room
                  </Text>
                </View>
              </View>
            </View>

            {/* Price and Distance */}
            <View className="flex-row items-center justify-between mt-2">
              <Text className="text-blue-600 font-bold text-sm sm:text-base md:text-lg">
                KSH: {hostel.price}/semester
              </Text>
              <View className="flex-row items-center">
                <FontAwesome5 name="walking" size={10} color="#6B7280" />
                <Text className="text-gray-600 text-xs ml-1 sm:text-sm md:text-base">
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

export default HostelCard;
