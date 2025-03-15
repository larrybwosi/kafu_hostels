

// components/FormPicker.tsx
import React from "react";
import { View, Text } from "react-native";
import Picker from "@/components/ui/picker";
import { FormPickerProps } from "@/lib/types/form";

const FormPicker: React.FC<FormPickerProps> = ({
  label,
  selectedValue,
  items,
  onValueChange,
  error,
}) => (
  <View className="mb-4">
    <Text className="text-sm font-medium text-indigo-800 mb-1">{label}</Text>
    <View className="bg-white border border-indigo-200 rounded-md shadow-sm">
      <Picker
        selectedValue={selectedValue}
        modalTitle={`Select ${label}`}
        items={items}
        onValueChange={onValueChange}
      />
    </View>
    {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
  </View>
);

export default FormPicker;
