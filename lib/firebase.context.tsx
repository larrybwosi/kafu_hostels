import { createContext, useContext, useEffect, useState } from "react";
import { client } from "./sanity/client";
import { onAuthStateChanged, User } from "firebase/auth";
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
  user: User | null;
  sanityUser: SanityUser | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  const [user, setUser] = useState<User | null>(null);
  const [sanityUser, setSanityUser] = useState<SanityUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Sanity user data based on Firebase user ID
  const fetchSanityUser = async (firebaseId: string) => {
    console.log('Firebase ID:', firebaseId);
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


  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async(user) => {
      if (user) {
        setUser(user);
        const uid = user.uid;
        
        await fetchSanityUser(uid);
      } else {
      setSanityUser(null);
      setIsLoading(false);
      }
    });
    return subscriber;
  }, []);


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

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};