import { StepIndicatorProps } from "@/lib/types/form";
import React from "react";
import { View, Text } from "react-native";

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels = Array.from({ length: totalSteps }, (_, i) => `Step ${i + 1}`),
}) => (
  <View className="flex-row w-full justify-between mb-6 px-4">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <React.Fragment key={index}>
        <View className="items-center">
          <View
            className={`rounded-full h-10 w-10 items-center justify-center ${
              currentStep >= index + 1 ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <Text className="text-white font-bold">{index + 1}</Text>
          </View>
          <Text className="text-xs mt-1 text-gray-700">{labels[index]}</Text>
        </View>

        {index < totalSteps - 1 && (
          <View className="flex-1 h-1 bg-gray-200 self-center mx-2">
            <View
              className={`h-full ${
                currentStep > index + 1 ? "bg-indigo-600" : "bg-gray-200"
              }`}
              style={{ width: `${currentStep > index + 1 ? "100%" : "0%"}` }}
            />
          </View>
        )}
      </React.Fragment>
    ))}
  </View>
);

export default StepIndicator;
