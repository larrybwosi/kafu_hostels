
// components/FormInput.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormInputProps } from "@/lib/types/form";

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
  secureTextEntry = false,
  isPassword = false,
  onTogglePassword,
  showPassword,
}) => (
  <View className="mb-4">
    <Text className="text-sm font-medium text-indigo-800 mb-1">{label}</Text>
    <View className="flex-row relative">
      <TextInput
        className="bg-white border border-indigo-200 rounded-md p-4 text-gray-800 flex-1 shadow-sm"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
      {isPassword && onTogglePassword && (
        <TouchableOpacity
          className="absolute right-3 top-3"
          onPress={onTogglePassword}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#4338ca"
          />
        </TouchableOpacity>
      )}
    </View>
    {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
  </View>
);

export default FormInput;