import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  // getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";


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

export { auth, app };
