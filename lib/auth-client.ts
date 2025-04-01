import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
// import { adminClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL:
    process.env.EXPO_BASE_URL,
  plugins: [
    expoClient({
      disableCache: false,
      scheme: "kafuhostels",
      storagePrefix: "kafuhostels_auth",
      storage: SecureStore,
    }),
    // adminClient(),
  ],
});
export const {
  changeEmail,
  signIn,
  signUp,
  signOut,
  updateUser,
  useSession,
  $fetch,
  getSession,
  $ERROR_CODES,
} = authClient;