import { View, Text } from "react-native";
import Picker from "@/components/ui/picker";
import { FormPickerProps } from "@/lib/types/form";
import { Ionicons } from "@expo/vector-icons";

const FormPicker: React.FC<FormPickerProps> = ({
  label,
  selectedValue,
  items,
  options,
  onValueChange,
  error,
  icon,
}) => (
  <View className="mb-4">
    <Text className="text-sm font-medium text-indigo-800 mb-1">{label}</Text>
    <View className="bg-white border border-indigo-200 rounded-md shadow-sm flex-row items-center">
      {icon && (
        <View className="px-3">
          <Ionicons name={icon as any} size={20} color="#4338ca" />
        </View>
      )}
      <View className="flex-1">
        <Picker
          selectedValue={selectedValue}
          modalTitle={`Select ${label}`}
          items={options || items || []}
          onValueChange={onValueChange}
        />
      </View>
    </View>
    {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
  </View>
);

export default FormPicker;
