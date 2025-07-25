import React, { createContext, useEffect, useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  updatePhoneNumber,
} from "firebase/auth";
import type {
  User,
  UserCredential,
  Auth,
  AuthProvider as FirebaseAuthProvider,
  PhoneAuthCredential,
} from "firebase/auth";
import app from "../firebase/firebase.config";

// Define the shape of the AuthContext
export interface AuthContextType {
  createUser: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  updateUser: (userInfo: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  updateUserPhoneNumber: (
    userPhoneNumber: PhoneAuthCredential
  ) => Promise<void>;
  user: User | null;
  loading: boolean;
  GoogleSignIn: () => Promise<UserCredential>;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
const auth: Auth = getAuth(app);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const googleProvider = new GoogleAuthProvider();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Create new user
  const createUser = (email: string, password: string) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Email/password sign in
  const signIn = (email: string, password: string) => {
    setLoading(false);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign in
  const GoogleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Update user profile
  const updateUser = (userInfo: {
    displayName?: string;
    photoURL?: string;
  }) => {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No user is currently signed in."));
    }
    return updateProfile(auth.currentUser, userInfo);
  };

  // Update user phone number
  const updateUserPhoneNumber = (userPhoneNumber: PhoneAuthCredential) => {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No user is currently signed in."));
    }
    return updatePhoneNumber(auth.currentUser, userPhoneNumber);
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Memoize context value for performance
  const authInfo = useMemo<AuthContextType>(
    () => ({
      createUser,
      signIn,
      logOut,
      updateUser,
      updateUserPhoneNumber,
      user,
      loading,
      GoogleSignIn,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
