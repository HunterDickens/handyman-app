import React from "react";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <AuthProvider>
      <LoginPage />
      <Dashboard />
    </AuthProvider>
  );
};

export default App;
