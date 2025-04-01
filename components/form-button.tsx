import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { FormButtonProps } from "@/lib/types/form";

const FormButton: React.FC<FormButtonProps> = ({
  onPress,
  title,
  variant = "primary",
  className = "",
  style,
  color,
  disabled = false,
  children,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return "#CBD5E1"; // gray-300
    if (color) return color === "gray" ? "#94A3B8" : `#${color}`;
    return variant === "primary" ? "#4F46E5" : "#E2E8F0"; // indigo-600 or gray-200
  };

  const getTextColor = () => {
    if (disabled) return "#64748B"; // gray-500
    if (color) return color === "gray" ? "#FFFFFF" : "#FFFFFF";
    return variant === "primary" ? "#FFFFFF" : "#334155"; // white or gray-700
  };

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: 6,
          paddingVertical: 12,
          paddingHorizontal: 16,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-center">
        <Text
          style={{
            color: getTextColor(),
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default FormButton;
