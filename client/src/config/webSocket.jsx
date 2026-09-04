import { io } from "socket.io-client";

const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4500";
const socketOrigin = rawBaseUrl.replace(/\/api\/?$/, "");

const socketAPI = io(socketOrigin, {
  withCredentials: true,
});

export default socketAPI;