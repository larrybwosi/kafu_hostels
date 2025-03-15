import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface PickerItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface PickerProps {
  items: PickerItem[];
  selectedValue?: string | number;
  onValueChange: (value: string | number, index: number) => void;
  placeholder?: string;
  disabled?: boolean;
  renderItem?: (item: PickerItem, isSelected: boolean) => React.ReactNode;
  modalTitle?: string;
  searchable?: boolean;
  confirmButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  pickerType?: "modal" | "dropdown";
  customStyle?: {
    container?: object;
    pickerButton?: object;
    selectedText?: object;
    modalContainer?: object;
    itemContainer?: object;
    itemText?: object;
    selectedItemContainer?: object;
    selectedItemText?: object;
  };
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Picker: React.FC<PickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  placeholder = "Select an item",
  disabled = false,
  renderItem,
  modalTitle = "Select an option",
  searchable = false,
  confirmButton = false,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  pickerType = "modal",
  customStyle = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempSelectedValue, setTempSelectedValue] = useState<
    string | number | undefined
  >(selectedValue);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const dropdownRef = useRef<View>(null);
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setTempSelectedValue(selectedValue);
  }, [selectedValue]);

  useEffect(() => {
    if (searchable) {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchText, items, searchable]);

  const getSelectedItemLabel = () => {
    const selectedItem = items.find((item) => item.value === selectedValue);
    return selectedItem ? selectedItem.label : placeholder;
  };

  const openPicker = () => {
    if (disabled) return;

    if (pickerType === "dropdown") {
      // Measure position for dropdown
      if (dropdownRef.current) {
        dropdownRef.current.measureInWindow((x, y, width, height) => {
          setDropdownLayout({ x, y, width, height });
          setIsVisible(true);

          // Animate dropdown opening
          Animated.parallel([
            Animated.timing(dropdownOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.spring(dropdownHeight, {
              toValue: Math.min(items.length * 50, 300),
              useNativeDriver: false,
              friction: 8,
            }),
          ]).start();
        });
      }
    } else {
      // Modal type animation
      setIsVisible(true);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const closePicker = () => {
    if (pickerType === "dropdown") {
      // Animate dropdown closing
      Animated.parallel([
        Animated.timing(dropdownOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dropdownHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsVisible(false);
      });
    } else {
      // Modal closing animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT,
          useNativeDriver: true,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsVisible(false);
      });
    }

    // Reset search if searchable
    if (searchable) {
      setSearchText("");
    }
  };

  const handleItemSelect = (value: string | number, index: number) => {
    if (confirmButton) {
      setTempSelectedValue(value);
    } else {
      setTempSelectedValue(value);
      onValueChange(value, index);
      closePicker();
    }
  };

  const handleConfirm = () => {
    if (tempSelectedValue !== undefined) {
      const index = items.findIndex((item) => item.value === tempSelectedValue);
      if (index !== -1) {
        onValueChange(tempSelectedValue, index);
      }
    }
    closePicker();
  };

  const renderDefaultItem = (item: PickerItem, isSelected: boolean) => (
    <View
      className={`py-3 px-4 flex-row items-center justify-between ${
        isSelected ? "bg-blue-50" : ""
      }`}
      style={
        isSelected
          ? customStyle.selectedItemContainer
          : customStyle.itemContainer
      }
    >
      <View className="flex-row items-center">
        {item.icon && <View className="mr-3">{item.icon}</View>}
        <Text
          className={`text-base ${
            isSelected ? "font-bold text-blue-600" : "text-gray-800"
          }`}
          style={
            isSelected ? customStyle.selectedItemText : customStyle.itemText
          }
        >
          {item.label}
        </Text>
      </View>
      {isSelected && (
        <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
          <Text className="text-white text-xs">✓</Text>
        </View>
      )}
    </View>
  );

  // Modal-style picker
  const renderModalPicker = () => (
    <Modal visible={isVisible} transparent animationType="none">
      <View className="flex-1">
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={closePicker}>
          <Animated.View
            className="absolute inset-0 bg-black"
            style={{ opacity: backdropOpacity }}
          />
        </TouchableWithoutFeedback>

        {/* Picker content */}
        <Animated.View
          className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-lg"
          style={[
            { transform: [{ translateY }], paddingBottom: insets.bottom },
            customStyle.modalContainer,
          ]}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center border-b border-gray-200 p-4">
            <TouchableOpacity onPress={closePicker}>
              <Text className="text-blue-500">{cancelButtonText}</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold">{modalTitle}</Text>
            {confirmButton && (
              <TouchableOpacity onPress={handleConfirm}>
                <Text className="text-blue-500 font-bold">
                  {confirmButtonText}
                </Text>
              </TouchableOpacity>
            )}
            {!confirmButton && <View style={{ width: 60 }} />}
          </View>

          {/* Search bar if searchable */}
          {searchable && (
            <View className="p-4 border-b border-gray-200">
              <TextInput
                className="bg-gray-100 rounded-lg p-2 px-4"
                placeholder="Search..."
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          )}

          {/* Items list */}
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleItemSelect(item.value, index)}
                activeOpacity={0.7}
              >
                {renderItem
                  ? renderItem(item, item.value === tempSelectedValue)
                  : renderDefaultItem(item, item.value === tempSelectedValue)}
              </TouchableOpacity>
            )}
            className="max-h-96"
          />
        </Animated.View>
      </View>
    </Modal>
  );

  // Dropdown-style picker
  const renderDropdownPicker = () =>
    isVisible && (
      <View
        className="absolute z-50"
        pointerEvents="box-none"
        style={StyleSheet.absoluteFill}
      >
        <TouchableWithoutFeedback onPress={closePicker}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>

        <Animated.View
          className="absolute bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
          style={{
            left: dropdownLayout.x,
            top: dropdownLayout.y + dropdownLayout.height + 5,
            width: dropdownLayout.width,
            height: dropdownHeight,
            opacity: dropdownOpacity,
          }}
        >
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleItemSelect(item.value, index)}
                activeOpacity={0.7}
              >
                {renderItem
                  ? renderItem(item, item.value === tempSelectedValue)
                  : renderDefaultItem(item, item.value === tempSelectedValue)}
              </TouchableOpacity>
            )}
            className="max-h-60"
          />
        </Animated.View>
      </View>
    );

  return (
    <View className="mb-4" style={customStyle.container}>
      <TouchableOpacity
        ref={dropdownRef}
        onPress={openPicker}
        disabled={disabled}
        className={`flex-row items-center justify-between p-3 border border-gray-300 rounded-lg ${
          disabled ? "bg-gray-100" : "bg-white"
        }`}
        style={customStyle.pickerButton}
      >
        <Text
          className={`text-base ${
            selectedValue ? "text-gray-800" : "text-gray-400"
          }`}
          style={customStyle.selectedText}
        >
          {getSelectedItemLabel()}
        </Text>
        <View
          className={`ml-2 ${
            isVisible && pickerType === "dropdown" ? "rotate-180" : ""
          }`}
        >
          <Text className="text-gray-500">▼</Text>
        </View>
      </TouchableOpacity>

      {pickerType === "modal" ? renderModalPicker() : renderDropdownPicker()}
    </View>
  );
};

// Example usage
// export const PickerExample = () => {
//   const [selectedValue, setSelectedValue] = useState<string | number>("");

//   const pickerItems: PickerItem[] = [
//     { label: "Apple", value: "apple" },
//     { label: "Banana", value: "banana" },
//     { label: "Cherry", value: "cherry" },
//     { label: "Durian", value: "durian" },
//     { label: "Elderberry", value: "elderberry" },
//     { label: "Fig", value: "fig" },
//     { label: "Grape", value: "grape" },
//   ];

//   return (
//     <View className="flex-1 justify-center p-4">
//       <Text className="text-lg font-bold mb-2">Select a fruit:</Text>
//       <Picker
//         items={pickerItems}
//         selectedValue={selectedValue}
//         onValueChange={(value) => setSelectedValue(value)}
//         placeholder="Select a fruit"
//         modalTitle="Choose your favorite fruit"
//         searchable={true}
//         confirmButton={true}
//       />

//       <Text className="mt-4">Selected value: {selectedValue || "None"}</Text>
//     </View>
//   );
// };

export default Picker;
