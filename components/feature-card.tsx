import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import AvailabilityTag from "./availability-tag";

interface HostelCardProps {
  hostel: Hostel;
  onPress: (hostel: Hostel) => void;
}

// Featured Hostel Card Component
const FeaturedHostelCard = ({ hostel, onPress }: HostelCardProps) => {
  return (
    <Animated.View
      entering={FadeInRight.delay(Number(hostel.id) * 100).duration(400)}
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

export default FeaturedHostelCard;