import { createContext, useEffect, useState } from "react";
import FirebaseAuth from "@react-native-firebase/auth";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { client } from "./sanity/client";
import { auth } from "./firebase";

interface SanityUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  gender?: string;
  isActive: boolean;
  createdAt: string;
  firebaseId: string;
  profileImage?: {
    _type: string;
    asset: {
      _ref: string;
    };
  };
  studentRegNo?: string;
  idType?: string;
  idNumber?: string;
}

interface FirebaseContextType {
  user: FirebaseAuthTypes.User | null;
  sanityUser: SanityUser | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
  refreshSanityUser: () => Promise<void>;
}

export const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  sanityUser: null,
  isLoading: true,
  setUser: () => {},
  refreshSanityUser: async () => {},
});

type Props = { children: React.ReactNode };

export const FirebaseProvider: React.FC<Props> = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [sanityUser, setSanityUser] = useState<SanityUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Sanity user data based on Firebase user ID
  const fetchSanityUser = async (firebaseId: string) => {
    try {
      const userData = await client.fetch<SanityUser | null>(
        `*[_type == "user" && firebaseId == $uid][0]`,
        { uid: firebaseId }
      );
      setSanityUser(userData);
    } catch (error) {
      console.error("Error fetching Sanity user data:", error);
      setSanityUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh Sanity user data
  const refreshSanityUser = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await fetchSanityUser(user.uid);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Firebase auth state changes
  const onAuthStateChanged = async (firebaseUser: FirebaseAuthTypes.User | null) => {
    setUser(firebaseUser);
    
    if (firebaseUser) {
      await fetchSanityUser(firebaseUser.uid);
    } else {
      setSanityUser(null);
      setIsLoading(false);
    }
    
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <FirebaseContext.Provider value={{ 
      user, 
      sanityUser, 
      isLoading, 
      setUser, 
      refreshSanityUser 
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};
