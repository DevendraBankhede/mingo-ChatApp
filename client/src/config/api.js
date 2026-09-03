import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4500";
const baseURL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl.replace(/\/+$/, "")}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;