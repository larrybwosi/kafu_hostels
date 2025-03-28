import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
// import { adminClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  baseURL: "http://localhost:8081" /* base url of your Better Auth backend. */,
  plugins: [
    expoClient({
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
  getCookie,
  $ERROR_CODES,
} = authClient;