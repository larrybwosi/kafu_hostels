import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import './global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="id" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="booking" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="add" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
