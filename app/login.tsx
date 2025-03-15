import FormButton from "@/components/form-button";
import FormCard from "@/components/form-card";
import FormInput from "@/components/form-input";
import FormPicker from "@/components/form-picker";
import StepIndicator from "@/components/step-indication";
import { handleSignUp } from "@/lib/actions";
import { signIn, signUp } from "@/lib/auth-client";
import { LoginFormData, loginFormSchema } from "@/lib/types/validation";
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
} from "react-native";

const HostelLoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    studentRegNo: "",
    name: "",
    email: "",
    password: "",
    idType: "national_id",
    idNumber: "",
    gender: "male",
    emergencyContact: {
      name: "",
      relationship: "",
      contactNumber: "",
    },
    roomPreference: "shared",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const validateStep = (step: number): boolean => {
    let result;
    let fieldsToValidate;

    if (step === 1) {
      fieldsToValidate = {
        studentRegNo: formData.studentRegNo,
        email: formData.email,
        password: formData.password,
        idType: formData.idType,
        idNumber: formData.idNumber,
        gender: formData.gender,
      };

      result = loginFormSchema
        .pick({
          studentRegNo: true,
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
      };

      result = loginFormSchema
        .pick({
          emergencyContact: true,
          roomPreference: true,
        })
        .safeParse(fieldsToValidate);
    }

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
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

  const nextStep = () => {
    if (currentStep === 1 && validateStep(1)) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async() => {
    if (validateStep(2)) {
     const user = await signUp.email({email: formData.email, password: formData.password, name: formData.name});
     console.log(user.data?.user.id);
     if (!user.data?.user.id) {
      Alert.alert("Error", "Failed to sign up");
      return
     }
      await handleSignUp(formData);
    }
  };

  const updateEmergencyContact = (
    key: keyof typeof formData.emergencyContact,
    value: string
  ) => {
    setFormData({
      ...formData,
      emergencyContact: {
        ...formData.emergencyContact,
        [key]: value,
      },
    });
  };

  const updateFormData = (
    key: keyof Omit<LoginFormData, "emergencyContact">,
    value: any
  ) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-4">
          {/* Header */}
          <View className="items-center mb-6">
            <Image
              source={{
                uri: "https://img.icons8.com/color/240/000000/dormitory.png",
              }}
              style={{ width: 80, height: 80 }}
              className="mb-3"
            />
            <Text className="text-2xl font-bold text-indigo-800 mb-2 text-center">
              Hostel Booking
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              Complete your details to secure your accommodation
            </Text>

            {/* Step indicators */}
            <StepIndicator
              currentStep={currentStep}
              totalSteps={2}
              labels={["Personal", "Emergency"]}
            />
          </View>

          {currentStep === 1 && (
            <FormCard title="Personal Information">
              <FormInput
                label="Student Registration Number"
                value={formData.studentRegNo}
                onChangeText={(text) => updateFormData("studentRegNo", text)}
                placeholder="Enter your registration number"
                error={errors.studentRegNo}
              />

              <FormInput
                label="Name"
                value={formData.name}
                onChangeText={(text) => updateFormData("name", text)}
                placeholder="someone example"
                error={errors.name}
              />

              <FormInput
                label="Email Address"
                value={formData.email}
                onChangeText={(text) => updateFormData("email", text)}
                placeholder="someone@example.com"
                error={errors.email}
                keyboardType="email-address"
              />

              <FormPicker
                label="ID Type"
                selectedValue={formData.idType}
                items={[
                  { label: "National ID", value: "national_id" },
                  { label: "Birth Certificate", value: "birth_certificate" },
                ]}
                onValueChange={(value) => updateFormData("idType", value)}
                error={errors.idType}
              />

              <FormInput
                label="ID Number"
                value={formData.idNumber}
                onChangeText={(text) => updateFormData("idNumber", text)}
                placeholder="Enter your ID number"
                error={errors.idNumber}
              />

              <FormPicker
                label="Gender"
                selectedValue={formData.gender}
                items={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
                onValueChange={(value) => updateFormData("gender", value)}
                error={errors.gender}
              />

              <FormInput
                label="Password"
                value={formData.password}
                onChangeText={(text) => updateFormData("password", text)}
                placeholder="Create a secure password"
                error={errors.password}
                secureTextEntry={!showPassword}
                isPassword={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
              />

              <FormButton
                title="Next Step"
                onPress={nextStep}
                variant="primary"
                className="mt-4"
              />
            </FormCard>
          )}

          {currentStep === 2 && (
            <>
              <FormCard title="Emergency Contact">
                <FormInput
                  label="Contact Name"
                  value={formData.emergencyContact.name}
                  onChangeText={(text) => updateEmergencyContact("name", text)}
                  placeholder="eg. Larry Dean"
                  error={errors["emergencyContact.name"]}
                />

                <FormInput
                  label="Relationship"
                  value={formData.emergencyContact.relationship}
                  onChangeText={(text) =>
                    updateEmergencyContact("relationship", text)
                  }
                  placeholder="eg. Father"
                  error={errors["emergencyContact.relationship"]}
                />

                <FormInput
                  label="Contact Number"
                  value={formData.emergencyContact.contactNumber}
                  onChangeText={(text) =>
                    updateEmergencyContact("contactNumber", text)
                  }
                  placeholder="07 000 0000"
                  error={errors["emergencyContact.contactNumber"]}
                  keyboardType="phone-pad"
                />
              </FormCard>

              <FormCard title="Room Preference">
                <FormPicker
                  label="Room Type"
                  selectedValue={formData.roomPreference}
                  items={[
                    { label: "Single Room", value: "single" },
                    { label: "Shared Room", value: "shared" },
                  ]}
                  onValueChange={(value) =>
                    updateFormData("roomPreference", value)
                  }
                  error={errors.roomPreference}
                />
              </FormCard>

              <View className="flex-row justify-between mb-6 mt-2">
                <FormButton
                  title="Back"
                  onPress={prevStep}
                  variant="secondary"
                  className="flex-1 mr-2"
                />
                <FormButton
                  title="Submit Application"
                  onPress={handleSubmit}
                  variant="primary"
                  className="flex-1 ml-2"
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HostelLoginForm;
