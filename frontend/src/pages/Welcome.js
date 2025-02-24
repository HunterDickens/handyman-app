import React from "react";
import { Link } from "react-router-dom";
import styles from "./Welcome.module.css";

const Welcome = () => {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeBox}>
        <h1>
          Welcome to <span className={styles.brand}>HandyMan</span>
        </h1>
        <p>Reliable handyman services, right at your fingertips.</p>

        <div className={styles.btnContainer}>
          <Link to="/signup" className={`${styles.btn} ${styles.btnPrimary}`}>
            Get Started
          </Link>
          <Link to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
