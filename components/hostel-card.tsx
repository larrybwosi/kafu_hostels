import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AvailabilityTag from "./availability-tag";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

interface HostelCardProps {
  hostel: Hostel;
  onPress: (hostel: Hostel) => void;
}

// Regular Hostel Card Component
const HostelCard = ({ hostel, onPress }: HostelCardProps) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(Number(hostel.id) * 100).duration(400)}
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
                KSH: {hostel.price}/semester
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

export default HostelCard;