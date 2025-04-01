import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useFirebase from "@/lib/useFirebase";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const { signinWithEmail } = useFirebase();

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
      try {
        setIsLoading(true);
        await signinWithEmail(email, password);
        router.push("/");
      } catch (error) {
        // Error is already handled in the signinWithEmail function
        console.log("Login failed:", error);
      } finally {
        setIsLoading(false);
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
              </View>

              <TouchableOpacity
                className="items-end mb-5"
                onPress={() => {
                  // Handle forgot password
                  Alert.alert(
                    "Reset Password",
                    "Please enter your email address to reset your password.",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          // Send password reset email logic here
                        },
                      },
                    ]
                  );
                }}
              >
                <Text className="text-white/80 text-sm">Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`bg-white/90 rounded-lg p-3 items-center mb-5 ${
                  isLoading ? "opacity-70" : ""
                }`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text className="text-blue-800 font-bold text-base">
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <Text className="text-white/80 mr-1">Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/sign-up")}>
                  <Text className="text-white font-bold">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;
