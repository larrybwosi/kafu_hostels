import { TouchableOpacity, Text } from "react-native";

interface FormButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary";
  className?: string;
}

const FormButton: React.FC<FormButtonProps> = ({
  onPress,
  title,
  variant = "primary",
  className = "",
}) => (
  <TouchableOpacity
    className={`rounded-md py-4 ${
      variant === "primary" ? "bg-indigo-600" : "bg-gray-200"
    } ${className}`}
    onPress={onPress}
  >
    <Text
      className={`text-center font-semibold text-lg ${
        variant === "primary" ? "text-white" : "text-gray-700"
      }`}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export default FormButton;
