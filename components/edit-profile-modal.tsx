import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  userData: {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    address: string;
    studentId: string;
    emergencyContact: {
      name: string;
      relation: string;
      phone: string;
    };
  };
  onSave: (updatedData: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  userData,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
    },
  });

  const [activeSection, setActiveSection] = useState("personal");
  const [imageUpdated, setImageUpdated] = useState(false);

  useEffect(() => {
    if (visible) {
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        profileImage: userData.profileImage,
        emergencyContact: {
          name: userData.emergencyContact.name,
          relation: userData.emergencyContact.relation,
          phone: userData.emergencyContact.phone,
        },
      });
      setImageUpdated(false);
    }
  }, [visible, userData]);

  const handleChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [section, subField] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
      setImageUpdated(true);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormData((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
      setImageUpdated(true);
    }
  };

  const renderSectionButton = (
    title: string,
    sectionName: string,
    icon: string
  ) => (
    <TouchableOpacity
      onPress={() => setActiveSection(sectionName)}
      className={`flex-row items-center py-3 px-4 rounded-xl mb-2 ${
        activeSection === sectionName ? "bg-blue-50" : "bg-white"
      }`}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={activeSection === sectionName ? "#3B82F6" : "#6B7280"}
      />
      <Text
        className={`ml-3 font-medium ${
          activeSection === sectionName ? "text-blue-500" : "text-gray-600"
        }`}
      >
        {title}
      </Text>
      {activeSection === sectionName && (
        <View className="ml-auto">
          <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderPersonalInfoSection = () => (
    <Animated.View
      entering={FadeInUp.duration(300)}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm"
    >
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Personal Information
      </Text>

      <View className="items-center mb-6">
        <TouchableOpacity
          onPress={async() => {
            // Show image options
            // In a real app, you might use ActionSheet here
           await handlePickImage();
          }}
          className="relative"
        >
          <Image
            source={{ uri: formData.profileImage }}
            className="w-24 h-24 rounded-full"
          />
          <View className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-md">
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePickImage} className="mt-2">
          <Text className="text-blue-500 text-sm font-medium">
            Change Photo
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Text className="text-gray-500 text-xs mb-1">Full Name</Text>
        <TextInput
          value={formData.name}
          onChangeText={(value) => handleChange("name", value)}
          className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
          placeholder="Enter your full name"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-500 text-xs mb-1">Email Address</Text>
        <TextInput
          value={formData.email}
          onChangeText={(value) => handleChange("email", value)}
          className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-500 text-xs mb-1">Phone Number</Text>
        <TextInput
          value={formData.phone}
          onChangeText={(value) => handleChange("phone", value)}
          className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>

      <View>
        <Text className="text-gray-500 text-xs mb-1">Address</Text>
        <TextInput
          value={formData.address}
          onChangeText={(value) => handleChange("address", value)}
          className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
          placeholder="Enter your address"
          multiline
          numberOfLines={2}
        />
      </View>
    </Animated.View>
  );

  const renderEmergencyContactSection = () => (
    <Animated.View
      entering={FadeInUp.duration(300)}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm"
    >
      <Text className="text-lg font-bold text-gray-800 mb-4">
        Emergency Contact
      </Text>

      <View className="mb-4">
        <Text className="text-gray-500 text-xs mb-1">Contact Name</Text>
        <TextInput
          value={formData.emergencyContact.name}
          onChangeText={(value) => handleChange("emergencyContact.name", value)}
          className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
          placeholder="Enter contact name"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-500 text-xs mb-1">Relationship</Text>
        <TextInput
          value={formData.emergencyContact.relation}
          onChangeText={(value) =>
            handleChange("emergencyContact.relation", value)
          }
          className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
          placeholder="Enter relationship"
        />
      </View>

      <View>
        <Text className="text-gray-500 text-xs mb-1">Phone Number</Text>
        <TextInput
          value={formData.emergencyContact.phone}
          onChangeText={(value) =>
            handleChange("emergencyContact.phone", value)
          }
          className="bg-gray-50 rounded-lg px-4 py-3 text-gray-800"
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />
      </View>
    </Animated.View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/50 justify-end">
            <Animated.View
              entering={FadeInUp}
              exiting={FadeOutDown}
              className="bg-gray-50 rounded-t-3xl p-4 h-5/6"
            >
              {/* Header */}
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={onClose} className="p-2">
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">
                  Edit Profile
                </Text>
                <TouchableOpacity onPress={handleSave} className="p-2">
                  <Text className="text-blue-500 font-medium">Save</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row h-full">
                {/* Sidebar */}
                <View className="w-1/3 pr-2">
                  {renderSectionButton(
                    "Personal Info",
                    "personal",
                    "person-outline"
                  )}
                  {renderSectionButton(
                    "Emergency",
                    "emergency",
                    "alert-circle-outline"
                  )}
                </View>

                {/* Content */}
                <ScrollView className="flex-1 pl-2">
                  {activeSection === "personal" && renderPersonalInfoSection()}
                  {activeSection === "emergency" &&
                    renderEmergencyContactSection()}
                </ScrollView>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditProfileModal;
