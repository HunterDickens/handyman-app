import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import styles from "./App.module.css";

const App = () => {
  return (
    <Router>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Home
        </NavLink>
        |
        <NavLink
          to="/signup"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Signup
        </NavLink>{" "}
        |
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Login
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
