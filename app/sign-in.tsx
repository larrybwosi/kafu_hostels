import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  Keyboard,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { signIn } from "@/lib/auth-client";
import { router } from "expo-router";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

const LoginScreen: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      const { data, error } = await signIn.email({
        email,
        password,
        rememberMe: true,
        fetchOptions: { onSuccess: () => router.push("/") },
      });
      console.log(error);
      if (error?.code === "USER_NOT_FOUND") {
        Alert.alert(
          "User not found",
          "The email or password you entered is incorrect. Please try again."
        );
      }
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      }}
      className="flex-1 w-full h-full"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <Animated.View
            className="w-[85%] max-w-[400px] rounded-2xl overflow-hidden shadow-lg"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <LinearGradient
              colors={["#4c669f", "#3b5998", "#192f6a"]}
              className="p-5 pt-7 pb-7"
            >
              <View className="items-center mb-8">
                <Text className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </Text>
                <Text className="text-base text-gray-300">
                  Sign in to continue
                </Text>
              </View>

              <View className="mb-5">
                <View className="flex-row items-center border border-white/30 rounded-lg mb-2 px-3 bg-white/10">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#fff"
                    className="mr-2"
                  />
                  <TextInput
                    className="flex-1 h-12 text-white text-base"
                    placeholder="Email"
                    placeholderTextColor="#cccccc"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) validateEmail(text);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {emailError && (
                  <Text className="text-red-500 text-xs mb-2 ml-1">
                    {emailError}
                  </Text>
                )}

                <View className="flex-row items-center border border-white/30 rounded-lg mb-2 px-3 bg-white/10">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#fff"
                    className="mr-2"
                  />
                  <TextInput
                    className="flex-1 h-12 text-white text-base"
                    placeholder="Password"
                    placeholderTextColor="#cccccc"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) validatePassword(text);
                    }}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError && (
                  <Text className="text-red-500 text-xs mb-2 ml-1">
                    {passwordError}
                  </Text>
                )}

                <TouchableOpacity className="self-end mt-1">
                  <Text className="text-orange-400 text-sm">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className="mt-5 rounded-lg overflow-hidden"
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FF9966", "#FF5E62"]}
                  className="h-12 justify-center items-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text className="text-white text-base font-bold tracking-wide">
                    LOGIN
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {!isKeyboardVisible && (
                <View className="flex-row justify-center mt-7">
                  <Text className="text-gray-300 text-sm mr-1">
                    Don't have an account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/sign-up")}>
                    <Text className="text-orange-400 text-sm font-bold">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </LinearGradient>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;
