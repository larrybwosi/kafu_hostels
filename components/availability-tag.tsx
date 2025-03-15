import { Text, View } from "react-native";

const AvailabilityTag = ({ availability }: { availability: string }) => {
  let bgColor = "";
  let textColor = "text-white";

  switch (availability) {
    case "High":
      bgColor = "bg-green-500";
      break;
    case "Medium":
      bgColor = "bg-yellow-500";
      break;
    case "Low":
      bgColor = "bg-red-500";
      break;
    default:
      bgColor = "bg-gray-500";
  }

  return (
    <View
      className={`${bgColor} rounded-full px-2 py-1 absolute top-2 right-2`}
    >
      <Text className={`${textColor} text-xs font-medium`}>{availability}</Text>
    </View>
  );
};

export default AvailabilityTag;