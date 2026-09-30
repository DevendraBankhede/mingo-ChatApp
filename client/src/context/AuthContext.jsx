import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../config/api";
import socketAPI from "../config/webSocket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("AppUser")) || null
  );
  const [isLogin, setIsLogin] = useState(!!user);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    setIsLogin(!!user);
  }, [user]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.data) {
          setUser(res.data.data);
          sessionStorage.setItem("AppUser", JSON.stringify(res.data.data));
        }
      } catch (err) {
        setUser(null);
        sessionStorage.removeItem("AppUser");
        sessionStorage.removeItem("AppToken");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);


  // Socket online presence management
  useEffect(() => {
    const currentUserId = user?._id || user?.id;

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users || {});
    };

    const handleConnect = () => {
      if (currentUserId) {
        socketAPI.emit("OmBhramyaNamah", String(currentUserId));
      }
      socketAPI.emit("getOnlineUsers");
    };

    socketAPI.on("onlineUsers", handleOnlineUsers);
    socketAPI.on("connect", handleConnect);

    if (currentUserId) {
      if (socketAPI.connected) {
        socketAPI.emit("OmBhramyaNamah", String(currentUserId));
      } else {
        socketAPI.connect();
      }
    }

    return () => {
      socketAPI.off("onlineUsers", handleOnlineUsers);
      socketAPI.off("connect", handleConnect);
    };
  }, [user]);

  const value = { user, isLogin, setUser, setIsLogin, loading, onlineUsers };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);