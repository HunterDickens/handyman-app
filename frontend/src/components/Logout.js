import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const handleLogout = () => {
  signOut(auth);
};

const Logout = () => {
  const [user, loading, error] = useAuthState(auth);

  return user ? <button onClick={handleLogout}>Logout</button> : null;
};

export default Logout;
