import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import EditProfileModal from "@/components/edit-profile-modal";
import { handleProfileUpdate, useGetUserData } from "@/lib/actions";
import { formatCurrency } from "@/lib/currency";

type TabType = "current" | "past";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const { data: userData, loading, error } = useGetUserData();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handlePayNow = (bookingId: string) => {
    Alert.alert(
      "Process Payment",
      "Would you like to pay the remaining balance now?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          onPress: () => {
            // This should navigate to a payment screen or process the payment
            Alert.alert("Payment", "Payment processed successfully!");
          },
        },
      ]
    );
  };

  const handleUpdate = async (updatedData: any) => {
    Alert.alert(
      "Profile Updated",
      "Your profile information has been updated successfully!"
    );
    await handleProfileUpdate(updatedData);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const currentBookings = userData?.bookingsData.filter(
    (booking) => booking.status === "active"
  );
  const pastBookings = userData?.bookingsData.filter(
    (booking) => booking.status === "completed"
  );

  const renderProfileHeader = () => (
    <Animated.View
      entering={FadeInDown.duration(800)}
      className="bg-white rounded-2xl p-5 mb-6 shadow-sm"
    >
      <View className="flex-row items-center">
        <Image
          source={{ uri: userData.profileImage }}
          className="w-20 h-20 rounded-full"
        />
        <View className="ml-4 flex-1">
          <Text className="text-2xl font-bold text-gray-800">
            {userData.name}
          </Text>
          <Text className="text-gray-600">{userData.email}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-500 text-xs">
              Member since {formatDate(userData.createdAt)}
            </Text>
            <View className="h-2 w-2 rounded-full bg-gray-300 mx-2" />
            <Text className="text-gray-500 text-xs">
              ID: {userData.studentId}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row mt-6 justify-between">
        <TouchableOpacity className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
            <Ionicons name="call-outline" size={18} color="#3B82F6" />
          </View>
          <Text className="ml-2 text-blue-500 font-medium">Call</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
            <Ionicons name="mail-outline" size={18} color="#3B82F6" />
          </View>
          <Text className="ml-2 text-blue-500 font-medium">Message</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
            <Ionicons name="pencil-outline" size={18} color="#3B82F6" />
          </View>
          <Text className="ml-2 text-blue-500 font-medium">Edit</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderContactInfo = () => (
    <Animated.View
      entering={FadeInUp.delay(200).duration(800)}
      className="bg-white rounded-2xl p-5 mb-6 shadow-sm"
    >
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Contact Information
      </Text>

      <View className="mb-4">
        <Text className="text-gray-500 text-xs mb-1">Phone Number</Text>
        <Text className="text-gray-800 font-medium">{userData.phone}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-500 text-xs mb-1">Current Address</Text>
        <Text className="text-gray-800 font-medium">{userData.address}</Text>
      </View>

      <View className="pt-2 border-t border-gray-100">
        <Text className="text-gray-500 text-xs mb-2">Emergency Contact</Text>
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-2">
            <Ionicons name="person-outline" size={14} color="#4B5563" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-medium">
              {userData.emergencyContact.name} (
              {userData.emergencyContact.relation})
            </Text>
            <Text className="text-gray-600">
              {userData.emergencyContact.phone}
            </Text>
          </View>
          <TouchableOpacity className="bg-blue-50 p-2 rounded-full">
            <Ionicons name="call-outline" size={14} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderPaymentMethods = () => (
    <Animated.View
      entering={FadeInUp.delay(300).duration(800)}
      className="bg-white rounded-2xl p-5 mb-6 shadow-sm"
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">Payment Methods</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={22} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {userData?.paymentMethods?.map((method, index) => (
        <View
          key={index}
          className={`flex-row items-center p-3 rounded-xl mb-2 ${
            method.isDefault ? "bg-blue-50" : "bg-gray-50"
          }`}
        >
          <View
            className={`w-10 h-10 rounded-lg items-center justify-center ${
              method.type === "card" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            <Ionicons
              name={method.type === "card" ? "card-outline" : "wallet-outline"}
              size={18}
              color="white"
            />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-medium text-gray-800">
              {method.type === "card"
                ? `${method.brand} •••• ${method.last4}`
                : `${method.brand} •••• ${method.last4}`}
            </Text>
            {method.type === "card" && (
              <Text className="text-xs text-gray-500">
                Expires {method.expiryDate}
              </Text>
            )}
          </View>
          {method.isDefault && (
            <View className="bg-blue-100 px-2 py-1 rounded">
              <Text className="text-xs text-blue-600 font-medium">Default</Text>
            </View>
          )}
        </View>
      ))}
    </Animated.View>
  );

  const renderBookingTabs = () => (
    <Animated.View
      entering={FadeInUp.delay(400).duration(800)}
      className="mb-4"
    >
      <Text className="text-lg font-bold text-gray-800 mb-4">My Bookings</Text>
      <View className="flex-row bg-gray-100 p-1 rounded-xl">
        <TouchableOpacity
          onPress={() => setActiveTab("current")}
          className={`flex-1 py-3 rounded-lg`}
          style={{
            backgroundColor: activeTab === "current" ? "#fff" : "#CDCDE0",
          }}
        >
          <Text
            className={`text-center font-medium`}
            style={{ color: activeTab === "current" ? "#3B82F6" : "#4B5563" }}
          >
            Current
            <Text className="text-xs ml-1">({currentBookings.length})</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("past")}
          className={`flex-1 py-3 rounded-lg`}
          style={{ backgroundColor: activeTab === "past" ? "#fff" : "#CDCDE0" }}
        >
          <Text
            className={`text-center font-medium`}
            style={{ color: activeTab === "past" ? "#3B82F6" : "#4B5563" }}
          >
            Past
            <Text className="text-xs ml-1">({pastBookings.length})</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderCurrentBooking = (booking: any) => (
    <Animated.View
      key={booking.id}
      entering={FadeInUp.delay(500).duration(800)}
      className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm"
    >
      {booking.isFeatured && (
        <View className="absolute top-4 left-0 z-10 bg-blue-500 px-3 py-1 rounded-r-lg shadow-sm">
          <Text className="text-white text-xs font-medium">Current Stay</Text>
        </View>
      )}

      <Image source={{ uri: booking.image }} className="w-full h-48" />

      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800">
          {booking.hostelName}
        </Text>
        <Text className="text-gray-600 mb-2">
          {booking.roomType} • Room {booking.roomNumber}
        </Text>

        <View className="flex-row flex-wrap mb-3">
          {booking?.amenities?.map((amenity: any, index: any) => (
            <View
              key={index}
              className="bg-gray-50 px-2 py-1 rounded mr-2 mb-2"
            >
              <Text className="text-xs text-gray-600">{amenity}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row justify-between items-center pb-4 border-b border-gray-100">
          <View>
            <Text className="text-gray-500 text-xs">Check-in</Text>
            <Text className="font-medium">{formatDate(booking.checkIn)}</Text>
          </View>
          <View className="items-center">
            <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
            <Text className="text-gray-500 text-xs mt-1">
              {booking.daysRemaining} days remaining
            </Text>
          </View>
          <View>
            <Text className="text-gray-500 text-xs">Check-out</Text>
            <Text className="font-medium">{formatDate(booking.checkOut)}</Text>
          </View>
        </View>

        <View className="py-4 border-b border-gray-100">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">Total Amount</Text>
            <Text className="font-medium">
              {formatCurrency(booking.totalAmount)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500">Amount Paid</Text>
            <Text className="font-medium">
              {formatCurrency(booking.amountPaid)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Balance Due</Text>
            <Text className="font-bold text-blue-500">
              {formatCurrency(booking.amountDue)}
            </Text>
          </View>

          <View className="mt-4">
            <Text className="text-gray-500 text-xs">Next Payment</Text>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="font-medium">
                {formatDate(booking.nextPaymentDate)}
              </Text>
              <TouchableOpacity
                onPress={() => handlePayNow(booking.id)}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Pay Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderPastBooking = (booking: any) => (
    <Animated.View
      key={booking.id}
      entering={FadeInUp.delay(500).duration(800)}
      className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm"
    >
      <Image source={{ uri: booking.image }} className="w-full h-40" />

      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800">
          {booking.hostelName}
        </Text>
        <Text className="text-gray-600 mb-2">
          {booking.roomType} • Room {booking.roomNumber}
        </Text>

        <View className="flex-row items-center mb-3">
          <Text className="text-gray-500 mr-2">
            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
          </Text>
          <View className="bg-gray-100 px-2 py-1 rounded">
            <Text className="text-xs text-gray-600">Completed</Text>
          </View>
        </View>

        {booking?.rating && (
          <View className="pb-4 border-b border-gray-100">
            <View className="flex-row items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={
                    i < Math.floor(booking.rating) ? "star" : "star-outline"
                  }
                  size={16}
                  color={i < Math.floor(booking.rating) ? "#F59E0B" : "#D1D5DB"}
                  style={{ marginRight: 2 }}
                />
              ))}
              <Text className="text-gray-600 ml-1">{booking.rating}</Text>
            </View>
            {booking.review && (
              <Text className="text-gray-700 italic">"{booking.review}"</Text>
            )}
          </View>
        )}

        {!booking.rating && (
          <View className="pb-4">
            <TouchableOpacity className="bg-blue-50 px-4 py-3 rounded-lg flex-row items-center justify-center">
              <Ionicons name="star-outline" size={16} color="#3B82F6" />
              <Text className="text-blue-500 font-medium ml-2">
                Leave a Review
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 mt-5">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View className="flex-row justify-between items-center px-4 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.navigate('/sign-in')}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">My Profile</Text>
        <TouchableOpacity>
          <Ionicons
            name="settings-outline"
            onPress={() => setIsEditModalVisible(true)}
            size={24}
            color="#374151"
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderContactInfo()}
        {renderPaymentMethods()}

        {renderBookingTabs()}

        {activeTab === "current" && currentBookings?.map(renderCurrentBooking)}
        {activeTab === "past" && pastBookings?.map(renderPastBooking)}

        <View className="h-24" />
      </ScrollView>
      <EditProfileModal
        onSave={handleUpdate}
        onClose={() => setIsEditModalVisible(false)}
        userData={userData}
        visible={isEditModalVisible}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
