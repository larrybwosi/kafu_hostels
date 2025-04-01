import { View, Text } from "react-native";
import { FormCardProps } from "@/lib/types/form";

const FormCard: React.FC<FormCardProps> = ({ title, children }) => (
  <View className="bg-white p-6 rounded-xl shadow-md mb-4">
    {title && <Text className="text-xl font-semibold text-indigo-800 mb-4">{title}</Text>}
    {children}
  </View>
);

export default FormCard;