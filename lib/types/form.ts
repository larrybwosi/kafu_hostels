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
  icon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export interface PickerItemProps {
  label: string;
  value: string;
}

export interface FormPickerProps {
  label: string;
  selectedValue: string;
  items?: PickerItemProps[];
  options?: PickerItemProps[];
  onValueChange: (value: string) => void;
  error?: string;
  icon?: string;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export interface FormCardProps {
  children: React.ReactNode;
  title?: string;
}

export interface FormButtonProps {
  title: string;
  onPress: () => void;
  variant?: string;
  className?: string;
  disabled?: boolean;
  style?: any;
  color?: string;
  children?: React.ReactNode;
}
