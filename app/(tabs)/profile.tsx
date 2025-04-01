import { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import EditProfileModal from "@/components/edit-profile-modal";
import { handleProfileUpdate, useGetUserData } from "@/lib/actions";
import { formatCurrency } from "@/lib/currency";
import { FirebaseContext } from "@/lib/firebase.context";
import useFirebase from "@/lib/useFirebase";

type TabType = "current" | "past";

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  // Get Firebase and Sanity user data
  const { user, sanityUser, isLoading: authLoading, refreshSanityUser } = useContext(FirebaseContext);
  const { signout } = useFirebase();
  
  // Get booking data from API
  const { data: userData, loading: apiLoading, error, refetch } = useGetUserData();

  const isLoading = authLoading || apiLoading;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleSignOut = async () => {
    try {
      Alert.alert(
        "Sign Out",
        "Are you sure you want to sign out?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Sign Out", 
            style: "destructive",
            onPress: async () => {
              await signout();
              router.replace("/sign-in");
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
    try {
      await handleProfileUpdate(updatedData);
      
      // Refresh Sanity user data
      await refreshSanityUser();
      
      Alert.alert(
        "Profile Updated",
        "Your profile information has been updated successfully!"
      );
    } catch (error) {
      Alert.alert(
        "Update Failed",
        "There was a problem updating your profile. Please try again."
      );
      console.error("Profile update error:", error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-gray-600 mt-4">Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <View className="items-center px-6">
          <Ionicons name="person-circle-outline" size={80} color="#D1D5DB" />
          <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">Not Signed In</Text>
          <Text className="text-gray-500 text-center mb-8">
            Please sign in to view your profile and manage your bookings.
          </Text>
          <TouchableOpacity
            className="bg-indigo-600 px-8 py-3 rounded-lg w-full items-center"
            onPress={() => router.push("/sign-in")}
          >
            <Text className="text-white font-semibold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Combine Firebase auth user, Sanity user, and API data
  const displayName = user.displayName || sanityUser?.firstName || 'User';
  const displayEmail = user.email || sanityUser?.email || '';
  const profileImage = sanityUser?.profileImage?.asset?._ref 
    ? `https://cdn.sanity.io/images/${process.env.EXPO_SANITY_PROJECT_ID}/${process.env.EXPO_SANITY_DATASET}/${sanityUser.profileImage.asset._ref.replace('image-', '').replace('-jpg', '.jpg')}`
    : "https://randomuser.me/api/portraits/lego/1.jpg";
  
  const createdDate = sanityUser?.createdAt || user.metadata.creationTime || new Date().toISOString();
  const phone = sanityUser?.phone || userData?.phone || 'Not provided';
  const gender = sanityUser?.gender || userData?.gender || 'Not specified';
  const emergencyContact = userData?.emergencyContact || null;
  const studentId = sanityUser?.studentRegNo || userData?.studentId || 'Not provided';
  
  // Get current and past bookings
  const bookings = userData?.bookingsData || [];
  const currentBookings = bookings.filter(booking => booking.status === "active");
  const pastBookings = bookings.filter(booking => booking.status === "completed");

  const renderProfileHeader = () => (
    <Animated.View
      entering={FadeInDown.duration(800)}
      className="bg-white rounded-2xl p-5 mb-6 shadow-sm"
    >
      <View className="flex-row items-center">
        <Image
          source={{ uri: profileImage }}
          className="w-20 h-20 rounded-full bg-gray-200"
        />
        <View className="ml-4 flex-1">
          <Text className="text-2xl font-bold text-gray-800">
            {displayName}
          </Text>
          <Text className="text-gray-600">{displayEmail}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-500 text-xs">
              Member since {formatDate(createdDate)}
            </Text>
            {studentId !== 'Not provided' && (
              <>
                <View className="h-2 w-2 rounded-full bg-gray-300 mx-2" />
                <Text className="text-gray-500 text-xs">
                  ID: {studentId}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row mt-6 justify-between">
        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => Alert.alert("Contact", `Call ${displayName} at ${phone}`)}
        >
          <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
            <Ionicons name="call-outline" size={18} color="#4F46E5" />
          </View>
          <Text className="ml-2 text-indigo-600 font-medium">Call</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => Alert.alert("Message", `Send a message to ${displayEmail}`)}
        >
          <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
            <Ionicons name="mail-outline" size={18} color="#4F46E5" />
          </View>
          <Text className="ml-2 text-indigo-600 font-medium">Message</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => setIsEditModalVisible(true)}
        >
          <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
            <Ionicons name="pencil-outline" size={18} color="#4F46E5" />
          </View>
          <Text className="ml-2 text-indigo-600 font-medium">Edit</Text>
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
        Personal Information
      </Text>

      <View className="mb-4">
        <Text className="text-gray-500 text-xs mb-1">Phone Number</Text>
        <Text className="text-gray-800 font-medium">{phone}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-gray-500 text-xs mb-1">Gender</Text>
        <Text className="text-gray-800 font-medium">{gender}</Text>
      </View>

      {emergencyContact && (
        <View className="pt-2 border-t border-gray-100">
          <Text className="text-gray-500 text-xs mb-2">Emergency Contact</Text>
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-2">
              <Ionicons name="person-outline" size={14} color="#4B5563" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-medium">
                {emergencyContact.name}
              </Text>
              <Text className="text-gray-600 text-xs">
                {emergencyContact.relation}
              </Text>
              <Text className="text-gray-600">
                {emergencyContact.phone}
              </Text>
            </View>
            <TouchableOpacity 
              className="bg-indigo-50 p-2 rounded-full"
              onPress={() => Alert.alert("Call", `Call ${emergencyContact.name} at ${emergencyContact.phone}`)}
            >
              <Ionicons name="call-outline" size={14} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );

  const renderBookingTabs = () => (
    <Animated.View
      entering={FadeInUp.delay(400).duration(800)}
      className="bg-white rounded-2xl p-5 mb-6 shadow-sm"
    >
      <Text className="text-lg font-bold text-gray-800 mb-4">My Bookings</Text>

      <View className="flex-row bg-gray-100 rounded-lg p-1 mb-4">
        <TouchableOpacity
          className={`flex-1 py-2 rounded-md ${
            activeTab === "current" ? "bg-white shadow" : ""
          }`}
          onPress={() => setActiveTab("current")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "current" ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 rounded-md ${
            activeTab === "past" ? "bg-white shadow" : ""
          }`}
          onPress={() => setActiveTab("past")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "past" ? "text-indigo-600" : "text-gray-500"
            }`}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "current" && (
        currentBookings.length > 0 ? (
          currentBookings.map((booking) => renderCurrentBooking(booking))
        ) : (
          <View className="py-6 items-center">
            <Ionicons name="bed-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2 text-center">
              You don't have any current bookings
            </Text>
          </View>
        )
      )}

      {activeTab === "past" && (
        pastBookings.length > 0 ? (
          pastBookings.map((booking) => renderPastBooking(booking))
        ) : (
          <View className="py-6 items-center">
            <Ionicons name="time-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2 text-center">
              No past booking history
            </Text>
          </View>
        )
      )}
    </Animated.View>
  );

  const renderCurrentBooking = (booking: any) => (
    <View key={booking.id} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      {/* Booking Header */}
      <View className="bg-indigo-50 p-3 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View
            className={`w-3 h-3 rounded-full mr-2 ${
              booking.status === "active" ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <Text className="font-medium text-gray-800">
            {booking.status === "active" ? "Active" : "Pending"}
          </Text>
        </View>
        <Text className="text-gray-600 text-xs">Booking #{booking.id}</Text>
      </View>

      {/* Booking Content */}
      <View className="p-4">
        <View className="flex-row">
          <Image
            source={{ uri: booking.image }}
            className="w-20 h-20 rounded-md bg-gray-200"
          />
          <View className="ml-3 flex-1">
            <Text className="font-bold text-gray-800">{booking.hostelName}</Text>
            <Text className="text-gray-600 text-xs">{booking.address}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded-full">
                {booking.roomType}
              </Text>
              <Text className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded-full ml-2">
                Room {booking.roomNumber}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between mt-4 pb-3 border-b border-gray-100">
          <View>
            <Text className="text-gray-500 text-xs">Check-in</Text>
            <Text className="font-medium">{formatDate(booking.checkIn)}</Text>
          </View>
          <View>
            <Text className="text-gray-500 text-xs">Check-out</Text>
            <Text className="font-medium">{formatDate(booking.checkOut)}</Text>
          </View>
          <View>
            <Text className="text-gray-500 text-xs">Days Remaining</Text>
            <Text className="font-medium">{booking.daysRemaining} days</Text>
          </View>
        </View>

        <View className="mt-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-500">Total Amount</Text>
            <Text className="font-bold text-gray-800">
              {formatCurrency(booking.totalAmount)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-500">Amount Paid</Text>
            <Text className="text-green-600">
              {formatCurrency(booking.amountPaid)}
            </Text>
          </View>
          {booking.amountDue > 0 && (
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Amount Due</Text>
              <Text className="text-red-500">
                {formatCurrency(booking.amountDue)}
              </Text>
            </View>
          )}
        </View>

        {booking.amountDue > 0 && (
          <View className="mt-4 mb-2">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600 text-xs">
                Next payment: {formatDate(booking.nextPaymentDate)}
              </Text>
              <TouchableOpacity
                className="bg-indigo-600 py-1 px-4 rounded-full"
                onPress={() => handlePayNow(booking.id)}
              >
                <Text className="text-white font-medium">Pay Now</Text>
              </TouchableOpacity>
            </View>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-indigo-500"
                style={{
                  width: `${(booking.amountPaid / booking.totalAmount) * 100}%`,
                }}
              />
            </View>
          </View>
        )}

        {/* Amenities */}
        {booking.amenities && booking.amenities.length > 0 && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-gray-500 text-xs mb-2">Amenities</Text>
            <View className="flex-row flex-wrap">
              {booking.amenities.map((amenity: string, index: number) => (
                <View
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  <Text className="text-gray-600 text-xs">{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderPastBooking = (booking: any) => (
    <View key={booking.id} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      {/* Past Booking Header */}
      <View className="bg-gray-50 p-3 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-2 bg-gray-400" />
          <Text className="font-medium text-gray-700">Completed</Text>
        </View>
        <Text className="text-gray-600 text-xs">Booking #{booking.id}</Text>
      </View>

      {/* Past Booking Content */}
      <View className="p-4">
        <View className="flex-row">
          <Image
            source={{ uri: booking.image }}
            className="w-16 h-16 rounded-md bg-gray-200"
          />
          <View className="ml-3 flex-1">
            <Text className="font-bold text-gray-800">{booking.hostelName}</Text>
            <Text className="text-gray-600 text-xs">{booking.address}</Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-600 text-xs">
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between mt-3">
          <Text className="text-gray-500">Total Paid</Text>
          <Text className="font-bold text-gray-800">
            {formatCurrency(booking.totalAmount)}
          </Text>
        </View>

        <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => {
              // Handle booking details
              router.push({
                pathname: "/id",
                params: { id: booking.id },
              });
            }}
          >
            <Text className="text-indigo-600 font-medium text-sm">Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => {
              // Handle booking review
              Alert.alert("Review", "Write a review for your stay");
            }}
          >
            <Text className="text-indigo-600 font-medium text-sm">
              Write a Review
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAccountActions = () => (
    <Animated.View
      entering={FadeInUp.delay(600).duration(800)}
      className="bg-white rounded-2xl p-5 mb-20 shadow-sm"
    >
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Account Settings
      </Text>

      <TouchableOpacity 
        className="flex-row items-center py-3 border-b border-gray-100"
        onPress={() => Alert.alert("Notifications", "Manage your notification preferences")}
      >
        <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
          <Ionicons name="notifications-outline" size={16} color="#4F46E5" />
        </View>
        <Text className="text-gray-800 flex-1">Notifications</Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center py-3 border-b border-gray-100"
        onPress={() => Alert.alert("Privacy", "Manage your privacy settings")}
      >
        <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
          <Ionicons name="lock-closed-outline" size={16} color="#4F46E5" />
        </View>
        <Text className="text-gray-800 flex-1">Privacy & Security</Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center py-3 border-b border-gray-100"
        onPress={() => router.push("/help")}
      >
        <View className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center mr-3">
          <Ionicons name="help-circle-outline" size={16} color="#4F46E5" />
        </View>
        <Text className="text-gray-800 flex-1">Help & Support</Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center py-3"
        onPress={handleSignOut}
      >
        <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
          <Ionicons name="log-out-outline" size={16} color="#EF4444" />
        </View>
        <Text className="text-red-500 flex-1">Sign Out</Text>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        {renderContactInfo()}
        {renderBookingTabs()}
        {renderAccountActions()}
      </ScrollView>

      {isEditModalVisible && (
        <EditProfileModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onUpdate={handleUpdate}
          initialData={{
            name: displayName,
            email: displayEmail,
            phone: phone,
            gender: gender,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
