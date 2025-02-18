import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup, user } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert("Login Successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      await signup(email, password);
      alert("Signup Successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      {user ? (
        <h2>Welcome, {user.email}</h2>
      ) : (
        <div>
          <h2>Login / Signup</h2>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignup}>Signup</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
