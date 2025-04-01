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
  icon,
  rightIcon,
  onRightIconPress,
  autoCapitalize = "sentences",
}) => (
  <View className="mb-4">
    <Text className="text-sm font-medium text-indigo-800 mb-1">{label}</Text>
    <View className="flex-row relative bg-white border border-indigo-200 rounded-md items-center shadow-sm">
      {icon && (
        <View className="px-3">
          <Ionicons name={icon as any} size={20} color="#4338ca" />
        </View>
      )}
      <TextInput
        className="p-4 text-gray-800 flex-1"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
      />
      {isPassword && onTogglePassword && (
        <TouchableOpacity
          className="px-3"
          onPress={onTogglePassword}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#4338ca"
          />
        </TouchableOpacity>
      )}
      {rightIcon && onRightIconPress && (
        <TouchableOpacity
          className="px-3"
          onPress={onRightIconPress}
        >
          <Ionicons
            name={rightIcon as any}
            size={20}
            color="#4338ca"
          />
        </TouchableOpacity>
      )}
    </View>
    {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
  </View>
);

export default FormInput;