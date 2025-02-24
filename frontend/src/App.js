import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  useLocation,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import styles from "./App.module.css";
import Welcome from "./pages/Welcome";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Dashboard from "./pages/Dashboard";

const Navigation = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <nav>
      {/* <NavLink to="/">go back</NavLink>{" "} */}
      {pathname === "/signup" && <NavLink to="/login">Login</NavLink>}
      {pathname === "/login" && <NavLink to="/signup">Signup</NavLink>}
    </nav>
  );
};

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
};

export default App;
