import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import {
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import BottomSheet from "@/components/ui/bottom-sheets";
import { useSession } from "@/lib/auth-client";

// Field validation types
type ValidationError = {
  [key: string]: string;
};

interface Region {
  latitude: number;
  longitude: number;
}

// Main AddHostel Component
const AddHostel = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "Standard",
    description: "",
    price: "",
    rooms: "",
    roomCapacity: "",
    gender: "Mixed",
    distance: "",
    address: "",
    contactPhone: "",
    contactEmail: "",
    contactWebsite: "",
    wardenName: "",
    wardenPhone: "",
    amenities: [
      { name: "WiFi", icon: "wifi", selected: true },
      { name: "Gym", icon: "dumbbell", selected: false },
      { name: "Laundry", icon: "tshirt", selected: true },
      { name: "Study Room", icon: "book", selected: true },
      { name: "Kitchen", icon: "utensils", selected: false },
      { name: "Security", icon: "shield-alt", selected: true },
      { name: "Cleaning", icon: "broom", selected: false },
      { name: "TV Lounge", icon: "tv", selected: false },
      { name: "Parking", icon: "parking", selected: false },
      { name: "Bicycle Storage", icon: "bicycle", selected: false },
    ],
    rules: ["Quiet hours: 10 PM - 7 AM", "No smoking inside the building"],
    images: [] as string[],
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  });

  // UI state
  const [errors, setErrors] = useState<ValidationError>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newRule, setNewRule] = useState("");
  const [activeField, setActiveField] = useState("");
  const [wardenImage, setWardenImage] = useState<string | null>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const { isPending, data } = useSession()


// Redirect to the home page if the user is not an admin
  // if( ! isPending &&data?.user.role === "admin"){
  //   router.replace("/")
  // }

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const mapRef = useRef(null);
  const ruleInputRef = useRef<TextInput>(null);

  // Form sections for progress tracking
  const formSections = [
    { title: "Basic Info", icon: "information-circle" },
    { title: "Details", icon: "list" },
    { title: "Amenities", icon: "wifi" },
    { title: "Images", icon: "image" },
    { title: "Rules", icon: "clipboard" },
    { title: "Location", icon: "location" },
    { title: "Contact", icon: "call" },
  ];

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number | any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle image picking
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'We need access to your photo library to upload hostel images.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFormData(prevData => ({
          ...prevData,
          images: [...prevData.images, result.assets[0].uri]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Pick warden image
  const pickWardenImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'We need access to your photo library to upload warden image.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setWardenImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  // Add a new rule
  const addRule = () => {
    if (newRule.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        rules: [...prevData.rules, newRule.trim()],
      }));
      setNewRule("");
      if (ruleInputRef.current) {
        ruleInputRef.current.focus();
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Remove a rule
  const removeRule = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFormData((prevData) => ({
      ...prevData,
      rules: prevData.rules.filter((_, i) => i !== index),
    }));
  };

  // Toggle amenity selection
  const toggleAmenity = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormData((prevData) => {
      const updatedAmenities = [...prevData.amenities];
      updatedAmenities[index] = {
        ...updatedAmenities[index],
        selected: !updatedAmenities[index].selected,
      };
      return {
        ...prevData,
        amenities: updatedAmenities,
      };
    });
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: ValidationError = {};

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = "Hostel name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.rooms.trim()) newErrors.rooms = "Number of rooms is required";
    if (!formData.roomCapacity.trim())
      newErrors.roomCapacity = "Room capacity is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.contactPhone.trim())
      newErrors.contactPhone = "Contact phone is required";
    if (!formData.contactEmail.trim())
      newErrors.contactEmail = "Contact email is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";

    // Format validations
    if (formData.contactEmail && !formData.contactEmail.includes("@")) {
      newErrors.contactEmail = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Create the final hostel object
        const hostelData = {
          ...formData,
          amenities: formData.amenities.filter((a) => a.selected),
          wardenImage: wardenImage,
          price: parseFloat(formData.price),
          rooms: parseInt(formData.rooms, 10),
          roomCapacity: parseInt(formData.roomCapacity, 10),
          capacity:
            parseInt(formData.rooms, 10) * parseInt(formData.roomCapacity, 10),
          distance: parseFloat(formData.distance),
          rating: 0,
          reviews: 0,
          availability: "High",
          availableRooms: parseInt(formData.rooms, 10),
          featured: false,
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In a real app, you would send hostelData to your backend
        console.log("Hostel data submitted:", hostelData);

        Alert.alert(
          "Success!",
          `${formData.name} has been added successfully.`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } catch (error) {
        Alert.alert("Error", "Failed to add hostel. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Find first error and scroll to it
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        // Logic to scroll to the first error field would go here
        Alert.alert(
          "Validation Error",
          "Please fix the highlighted fields and try again."
        );
      }
    }
  };

  // Navigate between form sections
  const navigateToSection = (index: number) => {
    setCurrentSection(index);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  // UI Components
  const renderSectionHeader = (title: string, icon: string) => (
    <Animated.View
      entering={FadeInDown.delay(100).duration(400)}
      className="flex-row items-center mb-6"
    >
      <LinearGradient
        colors={["#3B82F6", "#2563EB"]}
        style={{ borderRadius: 50 }}
        className="h-10 w-10 rounded-full items-center justify-center mr-3"
      >
        <Ionicons name={icon as any} size={20} color="white" />
      </LinearGradient>
      <Text className="text-xl font-bold text-gray-800">{title}</Text>
    </Animated.View>
  );

  const renderProgressBar = () => (
    <View className="flex-row bg-gray-100 h-1 rounded-full overflow-hidden mt-2 mb-6">
      {formSections.map((_, index) => (
        <View
          key={index}
          className={`flex-1 ${
            index <= currentSection ? "bg-blue-500" : "bg-gray-200"
          } mx-0.5`}
        />
      ))}
    </View>
  );

  const renderFormField = (
    label: string,
    field: string,
    placeholder: string,
    keyboardType: any = "default",
    maxLength: number = 100,
    multiline: boolean = false
  ) => (
    <Animated.View
      entering={FadeInUp.delay(150).duration(400)}
      className="mb-5"
    >
      <Text className="text-gray-700 mb-2 font-medium">{label}</Text>
      <TextInput
      //@ts-ignore
        value={formData[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        onFocus={() => setActiveField(field)}
        onBlur={() => setActiveField("")}
        className={`bg-white border rounded-xl px-4 py-3 text-gray-800 ${
          multiline ? "h-32 textAlignVertical-top" : "h-12"
        } ${
          activeField === field
            ? "border-blue-500"
            : errors[field]
            ? "border-red-500"
            : "border-gray-200"
        }`}
      />
      {errors[field] && (
        <Text className="text-red-500 text-xs mt-1">{errors[field]}</Text>
      )}
    </Animated.View>
  );

  // Render different sections based on currentSection state
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: // Basic Info
        return (
          <>
            {renderSectionHeader("Basic Information", "information-circle")}
            {renderFormField("Hostel Name", "name", "Enter hostel name")}

            <Animated.View
              entering={FadeInUp.delay(200).duration(400)}
              className="mb-5"
            >
              <Text className="text-gray-700 mb-2 font-medium">
                Hostel Type
              </Text>
              <View className="flex-row">
                {["Standard", "Premium", "Budget"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleInputChange("type", type)}
                    className={`flex-1 h-12 rounded-xl mx-1 items-center justify-center ${
                      formData.type === type ? "bg-blue-500" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        formData.type === type ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            {renderFormField(
              "Description",
              "description",
              "Describe the hostel and its features...",
              "default",
              500,
              true
            )}
            {renderFormField(
              "Price per Semester",
              "price",
              "Enter price in",
              "numeric"
            )}
          </>
        );

      case 1: // Details
        return (
          <>
            {renderSectionHeader("Hostel Details", "list")}
            {renderFormField(
              "Number of Rooms",
              "rooms",
              "Total number of rooms",
              "numeric"
            )}
            {renderFormField(
              "Room Capacity",
              "roomCapacity",
              "Max people per room",
              "numeric"
            )}
            {renderFormField(
              "Distance from Campus",
              "distance",
              "Distance in km",
              "numeric"
            )}

            <Animated.View
              entering={FadeInUp.delay(200).duration(400)}
              className="mb-5"
            >
              <Text className="text-gray-700 mb-2 font-medium">
                Gender Policy
              </Text>
              <View className="flex-row">
                {["Mixed", "Male Only", "Female Only"].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    onPress={() => handleInputChange("gender", gender)}
                    className={`flex-1 h-12 rounded-xl mx-1 items-center justify-center ${
                      formData.gender === gender ? "bg-blue-500" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        formData.gender === gender
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </>
        );

      case 2: // Amenities
        return (
          <>
            {renderSectionHeader("Amenities", "wifi")}
            <Animated.View
              entering={FadeInUp.delay(150).duration(400)}
              className="mb-3"
            >
              <Text className="text-gray-700 mb-4 font-medium">
                Select available amenities
              </Text>
              <View className="flex-row flex-wrap">
                {formData.amenities.map((amenity, index) => (
                  <TouchableOpacity
                    key={amenity.name}
                    onPress={() => toggleAmenity(index)}
                    className={`mr-3 mb-3 px-4 py-3 rounded-xl flex-row items-center ${
                      amenity.selected ? "bg-blue-500" : "bg-gray-100"
                    }`}
                  >
                    <FontAwesome5
                      name={amenity.icon}
                      size={16}
                      color={amenity.selected ? "white" : "#4B5563"}
                    />
                    <Text
                      className={`ml-2 font-medium ${
                        amenity.selected ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {amenity.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </>
        );

      case 3: // Images
        return (
          <>
            {renderSectionHeader("Hostel Images", "image")}
            <Animated.View
              entering={FadeInUp.delay(150).duration(400)}
              className="mb-3"
            >
              <Text className="text-gray-700 mb-2 font-medium">
                Upload at least one image of your hostel
              </Text>

              <View className="flex-row flex-wrap">
                {formData.images.map((image, index) => (
                  <View key={index} className="mr-3 mb-3 relative">
                    <Image
                      source={{ uri: image }}
                      className="w-24 h-24 rounded-xl"
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                    >
                      <Ionicons name="close" size={14} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={pickImage}
                  className="w-24 h-24 rounded-xl bg-gray-100 items-center justify-center mb-3 mr-3"
                >
                  <Ionicons name="add" size={32} color="#3B82F6" />
                </TouchableOpacity>
              </View>

              {errors.images && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.images}
                </Text>
              )}
            </Animated.View>
          </>
        );

      case 4: // Rules
        return (
          <>
            {renderSectionHeader("Hostel Rules", "clipboard")}
            <Animated.View
              entering={FadeInUp.delay(150).duration(400)}
              className="mb-5"
            >
              <Text className="text-gray-700 mb-2 font-medium">
                Add rules that guests need to follow
              </Text>

              <View className="mb-4">
                {formData.rules.map((rule, index) => (
                  <View
                    key={index}
                    className="flex-row items-center bg-gray-50 rounded-xl p-3 mb-2"
                  >
                    <View className="flex-1">
                      <Text className="text-gray-800">{rule}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeRule(index)}
                      className="bg-gray-200 rounded-full p-2"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View className="flex-row items-center">
                <TextInput
                  ref={ruleInputRef}
                  value={newRule}
                  onChangeText={setNewRule}
                  placeholder="Add a new rule"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 h-12 mr-2"
                />
                <TouchableOpacity
                  onPress={addRule}
                  disabled={!newRule.trim()}
                  className={`h-12 rounded-xl items-center justify-center px-4 ${
                    newRule.trim() ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <Text className="text-white font-medium">Add</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </>
        );

      case 5: // Location
        return (
          <>
            {renderSectionHeader("Hostel Location", "location")}
            {renderFormField("Address", "address", "Enter hostel address eg. 123, 2nd floor")}

            <Animated.View
              entering={FadeInUp.delay(200).duration(400)}
              className="mb-5"
            >
              <Text className="text-gray-700 mb-2 font-medium">
                The exact url location on map
              </Text>
              <View className="h-60 rounded-xl overflow-hidden">
                {renderFormField("Location", "location", "", "url", 0, true)}
              </View>
            </Animated.View>
          </>
        );

      case 6: // Contact
        return (
          <>
            {renderSectionHeader("Contact Information", "call")}
            {renderFormField(
              "Contact Phone",
              "contactPhone",
              "Enter contact phone",
              "phone-pad"
            )}
            {renderFormField(
              "Contact Email",
              "contactEmail",
              "Enter contact email",
              "email-address"
            )}
            {renderFormField(
              "Website (Optional)",
              "contactWebsite",
              "Enter website URL"
            )}

            <Animated.View
              entering={FadeInUp.delay(300).duration(400)}
              className="mb-5"
            >
              <Text className="text-gray-700 mb-4 font-medium">
                Warden Information (Optional)
              </Text>

              <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={pickWardenImage} className="mr-4">
                  {wardenImage ? (
                    <Image
                      source={{ uri: wardenImage }}
                      className="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <View className="w-16 h-16 rounded-full bg-gray-200 items-center justify-center">
                      <Ionicons name="person" size={24} color="#9CA3AF" />
                    </View>
                  )}
                </TouchableOpacity>

                <View className="flex-1">
                  <TextInput
                    value={formData.wardenName}
                    onChangeText={(text) =>
                      handleInputChange("wardenName", text)
                    }
                    placeholder="Warden Name"
                    placeholderTextColor="#9CA3AF"
                    className="bg-white border border-gray-200 rounded-xl px-4 h-12 mb-2"
                  />
                  <TextInput
                    value={formData.wardenPhone}
                    onChangeText={(text) =>
                      handleInputChange("wardenPhone", text)
                    }
                    placeholder="Warden Contact"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    className="bg-white border border-gray-200 rounded-xl px-4 h-12"
                  />
                </View>
              </View>
            </Animated.View>
          </>
        );

      default:
        return null;
    }
  };

  const renderNavigationButtons = () => (
    <View className="flex-row mt-6 mb-8">
      <TouchableOpacity
        onPress={() => navigateToSection(Math.max(0, currentSection - 1))}
        disabled={currentSection === 0}
        className={`flex-1 h-14 rounded-xl mr-2 items-center justify-center ${
          currentSection === 0 ? "bg-gray-200" : "bg-gray-100"
        }`}
      >
        <Text
          className={`font-medium ${
            currentSection === 0 ? "text-gray-400" : "text-gray-700"
          }`}
        >
          Previous
        </Text>
      </TouchableOpacity>

      {currentSection < formSections.length - 1 ? (
        <TouchableOpacity
          onPress={() => navigateToSection(currentSection + 1)}
          className="flex-1 h-14 rounded-xl ml-2 bg-blue-500 items-center justify-center"
        >
          <Text className="text-white font-medium">Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="flex-1 h-14 rounded-xl ml-2 bg-blue-600 items-center justify-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium">Submit Hostel</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFormProgress = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-6"
      contentContainerStyle={{ paddingHorizontal: 4 }}
    >
      {formSections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigateToSection(index)}
          className={`mr-2 py-2 px-4 rounded-full flex-row items-center ${
            currentSection === index ? "bg-blue-500" : "bg-gray-100"
          }`}
        >
          <Ionicons
            name={section.icon as any}
            size={16}
            color={currentSection === index ? "white" : "#4B5563"}
          />
          <Text
            className={`ml-1 font-medium ${
              currentSection === index ? "text-white" : "text-gray-700"
            }`}
          >
            {section.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const headerComponent = (
    <View className="w-full">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-bold">Bottom Sheet Title</Text>
        </View>
        <TouchableOpacity
          onPress={() => setBottomSheetVisible(false)}
          className="p-2"
        >
          <Text className="text-blue-500">Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const footerComponent = (
    <View className="w-full">
      <TouchableOpacity
        onPress={() => setBottomSheetVisible(false)}
        className="w-full bg-blue-500 py-3 rounded-lg items-center"
      >
        <Text className="text-white font-bold">Confirm</Text>
      </TouchableOpacity>
    </View>
  );

  // Main component return
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1">
        <View className="bg-white pt-12 px-5 pb-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800">
              Add New Hostel
            </Text>
            <View style={{ width: 28 }} />
          </View>
          {renderProgressBar()}
          {renderFormProgress()}
        </View>

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="py-6">
            {renderCurrentSection()}
            {renderNavigationButtons()}
          </View>
        </ScrollView>
      </View>

      <BottomSheet
        isVisible={bottomSheetVisible}
        onClose={() => {}}
        snapPoints={[300, 500, 700]}
        headerComponent={headerComponent}
        footerComponent={footerComponent}
        enablePanDownToClose={true}
      >
        <View className="p-5">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Location Settings
          </Text>
          <TouchableOpacity
            className="flex-row items-center bg-blue-50 p-4 rounded-xl mb-3"
            onPress={() => {
              // Use current location logic would go here
              () => setBottomSheetVisible(false);
            }}
          >
            <View className="bg-blue-100 p-2 rounded-full mr-3">
              <Ionicons name="locate" size={20} color="#3B82F6" />
            </View>
            <Text className="text-blue-600 font-medium">
              Use Current Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-3"
            onPress={() => {
              // Search location logic would go here
              () => setBottomSheetVisible(false);
            }}
          >
            <View className="bg-gray-200 p-2 rounded-full mr-3">
              <Ionicons name="search" size={20} color="#4B5563" />
            </View>
            <Text className="text-gray-700 font-medium">
              Search for Location
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-3 p-4 rounded-xl bg-gray-100"
            onPress={() => setBottomSheetVisible(false)}
          >
            <Text className="text-gray-700 font-medium text-center">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
};

export default AddHostel;
