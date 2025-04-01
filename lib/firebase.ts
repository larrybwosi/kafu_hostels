import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  // getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// const {
//   FIREBASE_API_KEY,
//   FIREBASE_AUTH_DOMAIN,
//   FIREBASE_PROJECT_ID,
//   FIREBASE_STORAGE_BUCKET,
//   FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID,
//   FIREBASE_DATABASE_URL,
// } = process.env;

// const firebaseConfig = {
//   apiKey: FIREBASE_API_KEY,
//   authDomain: FIREBASE_AUTH_DOMAIN,
//   projectId: FIREBASE_PROJECT_ID,
//   storageBucket: FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
//   appId: FIREBASE_APP_ID,
//   databaseURL: FIREBASE_DATABASE_URL,
// };

const firebaseConfig = {
  apiKey: "AIzaSyCjcCFqXclft63E5sB1xKb5FC6YA1IvILQ",
  authDomain: "kafu-hostels.firebaseapp.com",
  projectId: "kafu-hostels",
  storageBucket: "kafu-hostels.firebasestorage.app",
  messagingSenderId: "110780866127",
  appId: "1:110780866127:web:5e374e5ca06bce8783543a",
  measurementId: "G-85B95CLG8L",
};

const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  // persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  
});
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
