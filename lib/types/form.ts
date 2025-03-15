
// types.ts
export interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
  isPassword?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
}

export interface PickerItemProps {
  label: string;
  value: string;
}

export interface FormPickerProps {
  label: string;
  selectedValue: string;
  items: PickerItemProps[];
  onValueChange: (value: string) => void;
  error?: string;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}
