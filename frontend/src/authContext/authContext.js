// authContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { app } from "../firebase"; // Import your Firebase app instance

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app); // Get Firebase auth instance

  useEffect(() => {
    // Set persistence to local storage so the user remains logged in across refreshes
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false); // Stop loading once the user state is determined
        });

        return unsubscribe; // Cleanup listener when component unmounts
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
        setLoading(false); // In case there's an error, stop loading
      });
  }, [auth]);

  const logout = async () => {
    await signOut(auth); // Use signOut from Firebase v9
    setUser(null); // Clear user after sign out
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
