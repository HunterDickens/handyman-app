import axios from "axios";
import { auth } from "../firebase";

export const api = axios.create({
  baseURL: "http://localhost:5000/",
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
  return config;
});
