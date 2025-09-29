import FormButton from "@/components/form-button";
import FormCard from "@/components/form-card";
import FormInput from "@/components/form-input";
import FormPicker from "@/components/form-picker";
import StepIndicator from "@/components/step-indication";
import { LoginFormData, loginFormSchema } from "@/lib/types/validation";
import useFirebase from "@/lib/useFirebase";
import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// Error logging utility
const logValidationError = (step: number, errors: any[]) => {
  console.group(`🔍 Validation Error - Step ${step}`);
  console.log("Timestamp:", new Date().toISOString());
  console.log("Step:", step);
  console.log("Error Details:", errors);
  errors.forEach((error, index) => {
    console.log(`Error ${index + 1}:`, {
      path: error.path.join("."),
      message: error.message,
      code: error.code,
    });
  });
  console.groupEnd();
};

const HostelLoginForm: React.FC = () => {
  // State management
  const [formData, setFormData] = useState<LoginFormData>({
    studentRegNo: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    idType: "national_id",
    idNumber: "",
    gender: "male",
    emergencyContact: {
      name: "",
      relation: "",
      phone: "",
    },
    roomPreference: "shared",
  });

  const { signUpWithEmail } = useFirebase();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation logic
  const validateStep = (step: number): boolean => {
    let result;
    let fieldsToValidate;

    if (step === 1) {
      fieldsToValidate = {
        studentRegNo: formData.studentRegNo,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        idType: formData.idType,
        idNumber: formData.idNumber,
        gender: formData.gender,
      };

      result = loginFormSchema
        .pick({
          studentRegNo: true,
          name: true,
          email: true,
          password: true,
          idType: true,
          idNumber: true,
          gender: true,
        })
        .safeParse(fieldsToValidate);
    } else {
      fieldsToValidate = {
        emergencyContact: formData.emergencyContact,
        roomPreference: formData.roomPreference,
        phone: formData.phone,
      };

      result = loginFormSchema
        .pick({
          emergencyContact: true,
          roomPreference: true,
          phone: true,
        })
        .safeParse(fieldsToValidate);
    }

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};

      // Log validation errors with detailed information
      logValidationError(step, result.error.errors);

      result.error.errors.forEach((err) => {
        const path = err.path.join(".");
        formattedErrors[path] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // Navigation handlers
  const nextStep = () => {
    if (currentStep === 1 && validateStep(1)) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      // Clear errors when going back
      setErrors({});
    }
  };

  // Form submission handler
  const handleSubmit = async () => {
    console.log("🔄 Starting form submission process...");

    if (!validateStep(2)) {
      console.log("❌ Step 2 validation failed");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("📤 Registering user with Firebase...");

      // Register user with Firebase and create Sanity document
      await signUpWithEmail({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        studentRegNo: formData.studentRegNo,
        idType: formData.idType,
        idNumber: formData.idNumber,
      });

      console.log("✅ Registration successful");

      // Reset form and navigate to home
      Alert.alert(
        "Registration Successful",
        "Your account has been created. You can now sign in.",
        [{ text: "OK", onPress: () => router.push("/") }]
      );
    } catch (error: any) {
      console.error("❌ Registration error:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });

      Alert.alert(
        "Registration Failed",
        error.message || "Failed to create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form data update handlers
  const updateEmergencyContact = (
    key: keyof typeof formData.emergencyContact,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [key]: value,
      },
    }));

    // Clear error for this field when user starts typing
    if (errors[`emergencyContact.${key}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`emergencyContact.${key}`];
        return newErrors;
      });
    }
  };

  const updateFormData = (
    key: keyof Omit<LoginFormData, "emergencyContact">,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Form step components for better organization
  const renderStepOne = () => (
    <FormCard>
      <FormInput
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.name}
        onChangeText={(value) => updateFormData("name", value)}
        error={errors.name}
        icon="person-outline"
      />
      <FormInput
        label="Student ID"
        placeholder="Enter your student ID"
        value={formData.studentRegNo}
        onChangeText={(value) => updateFormData("studentRegNo", value)}
        error={errors.studentRegNo}
        icon="school-outline"
      />
      <FormInput
        label="Email"
        placeholder="Enter your email address"
        value={formData.email}
        onChangeText={(value) => updateFormData("email", value)}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        icon="mail-outline"
      />
      <FormInput
        label="Password"
        placeholder="Choose a password"
        value={formData.password}
        onChangeText={(value) => updateFormData("password", value)}
        error={errors.password}
        secureTextEntry={!showPassword}
        icon="lock-closed-outline"
        rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setShowPassword(!showPassword)}
      />
      <FormPicker
        label="Gender"
        selectedValue={formData.gender}
        onValueChange={(value) => updateFormData("gender", value)}
        error={errors.gender}
        icon="people-outline"
        options={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ]}
      />
      <FormPicker
        label="ID Type"
        selectedValue={formData.idType}
        onValueChange={(value) => updateFormData("idType", value)}
        error={errors.idType}
        icon="card-outline"
        options={[
          { label: "National ID", value: "national_id" },
          { label: "Passport", value: "passport" },
          { label: "Driver's License", value: "drivers_license" },
        ]}
      />
      <FormInput
        label="ID Number"
        placeholder="Enter your ID number"
        value={formData.idNumber}
        onChangeText={(value) => updateFormData("idNumber", value)}
        error={errors.idNumber}
        icon="document-text-outline"
      />
      <FormButton title="Next" onPress={nextStep} />
    </FormCard>
  );

  const renderStepTwo = () => (
    <FormCard>
      <FormInput
        label="Phone Number"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChangeText={(value) => updateFormData("phone", value)}
        error={errors.phone}
        keyboardType="phone-pad"
        icon="call-outline"
      />
      <FormInput
        label="Emergency Contact Name"
        placeholder="Enter emergency contact name"
        value={formData.emergencyContact.name}
        onChangeText={(value) => updateEmergencyContact("name", value)}
        error={errors["emergencyContact.name"]}
        icon="person-outline"
      />
      <FormInput
        label="Emergency Contact Relation"
        placeholder="Enter relationship (e.g., Parent, Sibling)"
        value={formData.emergencyContact.relation}
        onChangeText={(value) => updateEmergencyContact("relation", value)}
        error={errors["emergencyContact.relation"]}
        icon="people-outline"
      />
      <FormInput
        label="Emergency Contact Phone"
        placeholder="Enter emergency contact phone"
        value={formData.emergencyContact.phone}
        onChangeText={(value) => updateEmergencyContact("phone", value)}
        error={errors["emergencyContact.phone"]}
        keyboardType="phone-pad"
        icon="call-outline"
      />
      <FormPicker
        label="Room Preference"
        selectedValue={formData.roomPreference}
        onValueChange={(value) => updateFormData("roomPreference", value)}
        error={errors.roomPreference}
        icon="bed-outline"
        options={[
          { label: "Shared Room", value: "shared" },
          { label: "Private Room", value: "private" },
          { label: "Any Room Type", value: "any" },
        ]}
      />
      <View className="flex-row justify-between gap-2">
        <FormButton
          title="Back"
          onPress={prevStep}
          style={{ flex: 1 }}
          color="gray"
        />
        <FormButton
          title={isSubmitting ? "Registering..." : "Register"}
          onPress={handleSubmit}
          style={{ flex: 1 }}
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <ActivityIndicator
              size="small"
              color="white"
              style={{ marginLeft: 5 }}
            />
          )}
        </FormButton>
      </View>
    </FormCard>
  );

  return (
    <SafeAreaView className="flex-1 bg-indigo-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="items-center mb-6">
            <Image
              source={{
                uri: "https://img.icons8.com/color/240/000000/dormitory.png",
              }}
              style={{ width: 80, height: 80 }}
              className="mb-3"
            />
            <Text className="text-2xl font-bold text-indigo-900">
              {currentStep === 1 ? "Create Account" : "Additional Information"}
            </Text>
            <Text className="text-gray-500 text-center mt-1">
              {currentStep === 1
                ? "Please fill in your basic information"
                : "Almost there! Just a few more details"}
            </Text>
          </View>

          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={2} />

          {/* Form Steps */}
          {currentStep === 1 ? renderStepOne() : renderStepTwo()}

          {/* Sign In Link */}
          <View className="mt-6 mb-10 flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text className="text-indigo-600 font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HostelLoginForm;
