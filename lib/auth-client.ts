import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const authClient = createAuthClient({
  baseURL: "http://localhost:8081" /* base url of your Better Auth backend. */,
  plugins: [
    expoClient({
      scheme: "myapp",
      storagePrefix: "myapp",
      storage: SecureStore,
    }),
  ],
});
export const { changeEmail, signIn, signUp, signOut, updateUser, useSession } = authClient;