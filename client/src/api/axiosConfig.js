import axios from "axios";

// Base URL for API: use env in production, or empty so Vite proxy is used in dev
const baseUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const api = axios.create({
  baseURL: baseUrl || undefined,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
