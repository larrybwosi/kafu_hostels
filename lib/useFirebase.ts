import { client } from "./sanity/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "./firebase";


// import { GoogleSignin } from "@react-native-google-signin/google-signin";

// GoogleSignin.configure({
//   // client ID that is on google-services.json / GoogleService-Info.plist
//   webClientId: "**********************.apps.googleusercontent.com",
// });

const useFirebase = () => {
  // const signinWithGoogle = async () => {
  //   const user = await GoogleSignin.signIn();
  //   const idToken = user.idToken;

  //   if (idToken === null) {
  //     return;
  //   }

  //   // sign in Firebase Auth with idToken
  //   const credential = FirebaseAuth.GoogleAuthProvider.credential(idToken);
  //   await auth.signInWithCredential(credential);
  // };

  /**
   * Creates a new user account with Firebase Authentication
   * and stores user data in Sanity
   */
  const signUpWithEmail = async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    gender?: string;
    studentRegNo?: string;
    idType?: string;
    idNumber?: string;
  }) => {
    try {
      // 1. Create user in Firebase Auth
      const { email, password, name, ...otherData } = userData;
      // console.log(userData);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Update display name in Firebase
      await updateProfile(user, {
        displayName: name,
      });

      // 3. Create user document in Sanity
      const sanityUser = await client.create({
        _type: "user",
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || "",
        email: email,
        phone: otherData.phone || "",
        gender: otherData.gender || "",
        role: "tenant",
        isActive: true,
        createdAt: new Date().toISOString(),
        firebaseId: user.uid,
      });

      return { user, sanityUser };
    } catch (error: any) {
      console.error("Error during signup:", error);
      const errorMessage = error.message || "Failed to create an account";
      Alert.alert("Registration Error", errorMessage);
      throw error;
    }
  };
  
  /**
   * Signs in a user with email and password using Firebase Auth
   */
  const signinWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential)
      return userCredential.user;
    } catch (error: any) {
      console.error("Error during sign in:", error);
      let errorMessage = "Failed to sign in";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      Alert.alert("Authentication Error", errorMessage);
      throw error;
    }
  };
  
  /**
   * Signs out the current user
   */
  const signout = async () => {
    try {
      await auth.signOut();
    } catch (error: any) {
      console.error("Error during sign out:", error);
      Alert.alert("Sign Out Error", "Failed to sign out. Please try again.");
      throw error;
    }
  };

  /**
   * Gets the current user data from Sanity
   */
  const getCurrentUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      console.log('current user', currentUser)
      if (!currentUser) return null;
      
      // Fetch user data from Sanity using the firebaseId
      const userData = await client.fetch(
        `*[_type == "user" && firebaseId == $uid][0]`,
        { uid: currentUser.uid }
      );
      
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  return { signUpWithEmail, signinWithEmail, signout, getCurrentUserData };
};

export default useFirebase;
