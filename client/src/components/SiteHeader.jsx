import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SiteHeader = () => {
  const { user, isLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTheme, setSelectedTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("mingoTheme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setSelectedTheme(savedTheme);
  }, []);

  const handleThemeChange = (e) => {
    const theme = e.target.value;
    setSelectedTheme(theme);
    localStorage.setItem("mingoTheme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  const handleProfileClick = () => {
    if (location.pathname === "/settings" || location.pathname === "/dashboard") {
      navigate("/chat");
    } else {
      navigate("/settings");
    }
  };

  return (
    <header className="navbar backdrop-blur-md bg-base-100/85 text-base-content border-b border-base-200 sticky top-0 z-50 px-4 sm:px-6 shadow-2xs transition-all">
      <div className="navbar-start">
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src="/favicon.svg"
            alt="Mingo Logo"
            className="size-9 rounded-xl shadow-md group-hover:scale-105 transition-transform object-contain"
          />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mingo
            </span>
          </div>
        </div>
      </div>

      <div className="navbar-end gap-2.5">
        {isLogin ? (
          <>
            <button
              onClick={() => navigate("/chat")}
              className="btn btn-ghost btn-sm font-semibold gap-1.5 hidden sm:flex hover:bg-base-200"
            >
              <span>💬</span>
              <span>Chats</span>
            </button>
            <div
              className="flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-full bg-base-200/70 hover:bg-base-200 transition border border-base-300/50"
              onClick={handleProfileClick}
              title={location.pathname === "/settings" || location.pathname === "/dashboard" ? "Close Settings" : "Open Settings"}
            >
              <div className="avatar">
                <div className="size-7 rounded-full bg-primary text-primary-content font-bold text-xs flex items-center justify-center overflow-hidden ring-1 ring-primary/30">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt={user.fullName} className="size-full object-cover" />
                  ) : (
                    (user?.fullName?.[0] || user?.email?.[0] || "U").toUpperCase()
                  )}
                </div>
              </div>
              <span className="font-semibold text-xs text-base-content hidden sm:block max-w-[100px] truncate">
                {user?.fullName?.split(" ")[0] || user?.email?.split("@")[0]}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              className="btn btn-sm btn-ghost text-base-content hover:bg-base-200 font-medium"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-sm btn-primary shadow-sm font-semibold hover:shadow transition-shadow"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </div>
        )}

        <select
          className="select select-sm bg-base-200/80 border-base-300 text-base-content text-xs font-medium w-fit rounded-lg focus:outline-none"
          value={selectedTheme}
          onChange={handleThemeChange}
          aria-label="Select Theme"
        >
          <option value="light">☀️ White</option>
          <option value="dark">🌙 Dark</option>
          <option value="black">🖤 Black</option>
        </select>
      </div>
    </header>
  );
};

export default SiteHeader;