import { io } from "socket.io-client";

const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const socketOrigin = rawBaseUrl.replace(/\/api\/?$/, "");

const socketAPI = io(socketOrigin, {
  withCredentials: true,
});

export default socketAPI;