import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

const THEMES = [
  { id: "light", name: "Light", icon: "☀️", bg: "#ffffff", primary: "#4f46e5", label: "Clean & Bright" },
  { id: "dark", name: "Dark", icon: "🌙", bg: "#1f2937", primary: "#6366f1", label: "Modern Dark" },
  { id: "black", name: "OLED Black", icon: "🖤", bg: "#000000", primary: "#38bdf8", label: "Deep Black" },
  { id: "spotify", name: "Spotify", icon: "🎧", bg: "#121212", primary: "#1db954", label: "Vibrant Green" },
  { id: "claude", name: "Claude", icon: "🤖", bg: "#fbf7ee", primary: "#d97706", label: "Warm Editorial" },
  { id: "corporate", name: "Corporate", icon: "💼", bg: "#f4f6f8", primary: "#2563eb", label: "Professional Blue" },
  { id: "ghibli", name: "Ghibli", icon: "🌱", bg: "#f0f7f4", primary: "#059669", label: "Soft Pastel" },
  { id: "halloween", name: "Halloween", icon: "🎃", bg: "#1a1025", primary: "#f97316", label: "Neon Orange" },
];

const UserDashboard = () => {
  const { user, isLogin, setUser, setIsLogin } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("light");

  // Local preferences state
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("mingoPreferences");
      return saved
        ? JSON.parse(saved)
        : { soundEffects: true, desktopNotifications: true, showOnlineStatus: true, enterToSend: true };
    } catch {
      return { soundEffects: true, desktopNotifications: true, showOnlineStatus: true, enterToSend: true };
    }
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("mingoTheme") || "light";
    setSelectedTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    localStorage.setItem("mingoTheme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    setSuccess(`Theme changed to ${THEMES.find((t) => t.id === themeId)?.name || themeId}`);
    setTimeout(() => setSuccess(""), 2500);
  };

  const handlePreferenceToggle = (key) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("mingoPreferences", JSON.stringify(updated));
      return updated;
    });
  };

  if (!isLogin) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-base-200/60 p-4">
        <div className="card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-base-300/60 max-w-md w-full p-6 text-center space-y-4 rounded-2xl">
          <div className="size-16 bg-error/10 text-error rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
            🔒
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-base-content tracking-tight">Access Restricted</h1>
            <p className="text-xs text-base-content/60 mt-1 font-medium">
              Please sign in to access your account settings and profile controls.
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary btn-sm w-full shadow-md rounded-xl font-bold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleHeaderPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setUploadingPhoto(true);
      setError("");
      setSuccess("");

      try {
        const response = await api.put("/user/profile", {
          profilePic: base64Image,
        });

        if (response.data.data) {
          const updatedUser = { ...user, ...response.data.data };
          setUser(updatedUser);
          sessionStorage.setItem("AppUser", JSON.stringify(updatedUser));
          setSuccess("Profile photo updated successfully!");
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (err) {
        console.error("Error uploading photo:", err);
        setError(err.response?.data?.message || "Failed to update profile photo.");
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put("/user/profile", {
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
      });

      if (response.data.data) {
        const updatedUser = { ...user, ...response.data.data };
        setUser(updatedUser);
        sessionStorage.setItem("AppUser", JSON.stringify(updatedUser));
        setSuccess(response.data.message || "Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      sessionStorage.removeItem("AppUser");
      setIsLogin(false);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200/50 py-5 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative ambient background blur lights */}
      <div className="absolute top-10 right-1/4 size-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 size-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleHeaderPhotoUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="max-w-4xl mx-auto space-y-4 relative z-10">

        {/* Global Notifications */}
        {error && (
          <div className="alert alert-error shadow-md py-2.5 px-4 rounded-xl flex items-center justify-between text-xs font-semibold animate-fadeIn">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError("")} className="btn btn-ghost btn-circle btn-xs">✕</button>
          </div>
        )}
        {success && (
          <div className="alert alert-success shadow-md py-2.5 px-4 rounded-xl flex items-center justify-between text-xs font-semibold animate-fadeIn">
            <div className="flex items-center gap-2">
              <span>✨</span>
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess("")} className="btn btn-ghost btn-circle btn-xs">✕</button>
          </div>
        )}

        {/* Compact Profile Header Card */}
        <div className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-base-300/60 rounded-2xl overflow-hidden">
          <div className="h-20 sm:h-24 bg-gradient-to-r from-primary/25 via-accent/20 to-secondary/25 relative">
            <div className="absolute top-3 right-3">
              <span className={`badge ${
                user?.loginType === "google_user" ? "badge-info" :
                user?.loginType === "hybrid_user" ? "badge-warning" : "badge-primary"
              } font-bold px-2.5 py-1 rounded-full text-[11px]`}>
                {user?.loginType === "google_user" ? "Google" :
                 user?.loginType === "hybrid_user" ? "Hybrid" : "Standard"}
              </span>
            </div>
          </div>

          <div className="px-5 pb-4 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 -mt-9 sm:-mt-11">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 text-center sm:text-left">
              {/* Profile Avatar */}
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                title="Click to change profile photo"
              >
                <div className="size-20 sm:size-24 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5 shadow-md ring-3 ring-base-100">
                  <div className="size-full rounded-full bg-base-100 flex items-center justify-center overflow-hidden relative">
                    {uploadingPhoto ? (
                      <span className="loading loading-spinner loading-sm text-primary" />
                    ) : user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.fullName || "User Avatar"}
                        className="size-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <span className="text-2xl font-extrabold text-primary">
                        {(user?.fullName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-white text-lg">📷</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-base-content tracking-tight">
                  {user?.fullName || "Welcome User"}
                </h1>
                <p className="text-xs font-medium text-base-content/60 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                  <span>✉️</span> {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/chat")}
                className="btn btn-ghost btn-xs sm:btn-sm rounded-xl font-bold gap-1 hover:bg-base-200"
                title="Close Settings and return to chat"
              >
                <span>✕</span> Close
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error btn-xs sm:btn-sm rounded-xl font-bold gap-1 hover:shadow-sm"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Settings Navigation & Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">

          {/* Settings Sidebar Navigation */}
          <div className="lg:col-span-1 flex flex-col h-full">
            <div className="card bg-base-100/80 backdrop-blur-xl shadow-md border border-base-300/60 rounded-2xl p-3.5 h-full flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-extrabold uppercase text-base-content/40 px-2.5 py-1 tracking-wider mb-2">
                  Settings Menu
                </div>
                <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                      activeTab === "profile"
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content"
                    }`}
                  >
                    <span className="text-base">👤</span>
                    <span>Profile & Details</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("appearance")}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                      activeTab === "appearance"
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content"
                    }`}
                  >
                    <span className="text-base">🎨</span>
                    <span>Appearance & Themes</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                      activeTab === "security"
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content"
                    }`}
                  >
                    <span className="text-base">🔒</span>
                    <span>Security & Account</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("preferences")}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                      activeTab === "preferences"
                        ? "bg-primary text-primary-content shadow-sm"
                        : "text-base-content/70 hover:bg-base-200/80 hover:text-base-content"
                    }`}
                  >
                    <span className="text-base">⚙️</span>
                    <span>App Preferences</span>
                  </button>
                </nav>
              </div>

              <div className="hidden lg:flex items-center justify-between pt-3 mt-4 border-t border-base-200/80 px-2.5 text-xs text-base-content/50 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-success animate-pulse" />
                  <span>System Active</span>
                </span>
                <span className="text-[10px] font-bold opacity-60">v1.0</span>
              </div>
            </div>
          </div>

          {/* Compact Content Panels */}
          <div className="lg:col-span-3 flex flex-col h-full">

            {/* TAB 1: Profile & Details */}
            {activeTab === "profile" && (
              <div className="card bg-base-100/90 backdrop-blur-xl shadow-md border border-base-300/60 rounded-2xl h-full flex flex-col justify-between">
                <div className="card-body p-5 space-y-4">

                  <div className="flex items-center justify-between border-b border-base-200/80 pb-3">
                    <div>
                      <h2 className="text-lg font-extrabold text-base-content tracking-tight">Personal Profile</h2>
                      <p className="text-[11px] text-base-content/60 mt-0.5">
                        Manage your profile info and account credentials.
                      </p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={handleEdit}
                        className="btn btn-primary btn-xs sm:btn-sm rounded-xl font-bold gap-1"
                      >
                        <span>✏️</span> Edit Profile
                      </button>
                    )}
                  </div>

                  {!isEditing ? (
                    /* View Mode Cards */
                    <div className="space-y-3.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-base-200/50 rounded-xl p-3 border border-base-300/40">
                          <p className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider mb-0.5 flex items-center gap-1">
                            <span>👤</span> Full Name
                          </p>
                          <p className="text-sm font-bold text-base-content">{user?.fullName || "—"}</p>
                        </div>

                        <div className="bg-base-200/50 rounded-xl p-3 border border-base-300/40">
                          <p className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider mb-0.5 flex items-center gap-1">
                            <span>✉️</span> Email Address
                          </p>
                          <p className="text-sm font-bold text-base-content truncate">{user?.email || "—"}</p>
                        </div>

                        <div className="bg-base-200/50 rounded-xl p-3 border border-base-300/40">
                          <p className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider mb-0.5 flex items-center gap-1">
                            <span>📱</span> Mobile Phone
                          </p>
                          <p className="text-sm font-bold text-base-content">{user?.mobileNumber || "Not provided"}</p>
                        </div>

                        <div className="bg-base-200/50 rounded-xl p-3 border border-base-300/40">
                          <p className="text-[10px] font-bold uppercase text-base-content/40 tracking-wider mb-0.5 flex items-center gap-1">
                            <span>📅</span> Member Since
                          </p>
                          <p className="text-sm font-bold text-base-content">
                            {user?.createdAt
                              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Recently joined"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-primary/5 rounded-xl p-3 border border-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">🖼️</span>
                          <div>
                            <p className="text-xs font-bold text-base-content">Profile Photo</p>
                            <p className="text-[11px] text-base-content/60">Upload avatar image (JPG, PNG, GIF under 5MB).</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn btn-ghost btn-xs text-primary font-bold hover:bg-primary/10"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Edit Form Mode */
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase text-base-content/70 tracking-wider">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-primary text-xs font-medium"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase text-base-content/70 tracking-wider">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-primary text-xs font-medium"
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase text-base-content/70 tracking-wider">Mobile Number</label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          className="input input-sm input-bordered w-full rounded-lg focus:outline-none focus:border-primary text-xs font-medium"
                          placeholder="Enter your mobile number"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-base-200">
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={loading}
                          className="btn btn-ghost btn-xs sm:btn-sm rounded-lg font-bold flex-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-success btn-xs sm:btn-sm rounded-lg font-bold flex-1 text-white shadow-xs"
                        >
                          {loading ? <span className="loading loading-spinner loading-xs" /> : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  )}

                </div>
              </div>
            )}

            {/* TAB 2: Appearance & Themes */}
            {activeTab === "appearance" && (
              <div className="card bg-base-100/90 backdrop-blur-xl shadow-md border border-base-300/60 rounded-2xl">
                <div className="card-body p-5 space-y-4">
                  <div className="border-b border-base-200/80 pb-3">
                    <h2 className="text-lg font-extrabold text-base-content tracking-tight">Theme & Styling</h2>
                    <p className="text-[11px] text-base-content/60 mt-0.5">
                      Select your favorite workspace color palette.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {THEMES.map((theme) => {
                      const isSelected = selectedTheme === theme.id;
                      return (
                        <div
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          className={`cursor-pointer rounded-xl p-3 border transition-all duration-200 flex items-center justify-between group ${
                            isSelected
                              ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                              : "border-base-300/60 hover:border-base-300 bg-base-200/40 hover:bg-base-200/70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="size-9 rounded-lg flex items-center justify-center text-lg shadow-xs transition-transform group-hover:scale-105"
                              style={{ backgroundColor: theme.bg }}
                            >
                              {theme.icon}
                            </div>
                            <div>
                              <h3 className="font-bold text-xs text-base-content flex items-center gap-1.5">
                                {theme.name}
                                {isSelected && <span className="badge badge-primary badge-xs text-[9px] px-1.5">Active</span>}
                              </h3>
                              <p className="text-[10px] text-base-content/60 mt-0.5">{theme.label}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <div className="size-3 rounded-full border border-black/10" style={{ backgroundColor: theme.bg }} />
                            <div className="size-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Security & Account */}
            {activeTab === "security" && (
              <div className="card bg-base-100/90 backdrop-blur-xl shadow-md border border-base-300/60 rounded-2xl">
                <div className="card-body p-5 space-y-4">
                  <div className="border-b border-base-200/80 pb-3">
                    <h2 className="text-lg font-extrabold text-base-content tracking-tight">Security & Account</h2>
                    <p className="text-[11px] text-base-content/60 mt-0.5">
                      Review login safety and active session details.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-base-200/50 rounded-xl p-3.5 border border-base-300/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-info/10 text-info flex items-center justify-center text-xl">
                          🔑
                        </div>
                        <div>
                          <h3 className="font-bold text-xs text-base-content">Authentication Provider</h3>
                          <p className="text-[11px] text-base-content/60 mt-0.5">
                            {user?.loginType === "google_user"
                              ? "Google OAuth 2.0 Single Sign-On"
                              : user?.loginType === "hybrid_user"
                              ? "Google OAuth + Standard Password"
                              : "Standard Password Authentication"}
                          </p>
                        </div>
                      </div>
                      <span className="badge badge-success font-bold text-[10px] px-2.5 py-1 rounded-full">
                        Connected
                      </span>
                    </div>

                    <div className="bg-base-200/50 rounded-xl p-3.5 border border-base-300/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-success/10 text-success flex items-center justify-center text-xl">
                          🛡️
                        </div>
                        <div>
                          <h3 className="font-bold text-xs text-base-content">Active Session Status</h3>
                          <p className="text-[11px] text-base-content/60 mt-0.5">
                            Device authenticated securely with encrypted tokens.
                          </p>
                        </div>
                      </div>
                      <span className="badge badge-outline badge-success font-bold text-[10px] px-2.5 py-1 rounded-full">
                        Secure
                      </span>
                    </div>

                    <div className="pt-3 border-t border-base-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-xs text-base-content">Sign Out of Session</h4>
                        <p className="text-[11px] text-base-content/60">Safely log out from Mingo Chat application.</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="btn btn-error btn-xs sm:btn-sm rounded-xl font-bold w-full sm:w-auto"
                      >
                        Sign Out Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Preferences */}
            {activeTab === "preferences" && (
              <div className="card bg-base-100/90 backdrop-blur-xl shadow-md border border-base-300/60 rounded-2xl">
                <div className="card-body p-5 space-y-4">
                  <div className="border-b border-base-200/80 pb-3">
                    <h2 className="text-lg font-extrabold text-base-content tracking-tight">App Preferences</h2>
                    <p className="text-[11px] text-base-content/60 mt-0.5">
                      Configure your notifications, sounds, and messaging options.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-base-200/50 border border-base-300/40">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🔔</span>
                        <div>
                          <p className="font-bold text-xs text-base-content">Desktop Notifications</p>
                          <p className="text-[11px] text-base-content/60">Receive alerts when new messages arrive.</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={preferences.desktopNotifications}
                        onChange={() => handlePreferenceToggle("desktopNotifications")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-base-200/50 border border-base-300/40">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🔊</span>
                        <div>
                          <p className="font-bold text-xs text-base-content">Sound Effects</p>
                          <p className="text-[11px] text-base-content/60">Play chime sound for incoming messages.</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={preferences.soundEffects}
                        onChange={() => handlePreferenceToggle("soundEffects")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-base-200/50 border border-base-300/40">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">🟢</span>
                        <div>
                          <p className="font-bold text-xs text-base-content">Show Online Status</p>
                          <p className="text-[11px] text-base-content/60">Allow contacts to see when you are active.</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={preferences.showOnlineStatus}
                        onChange={() => handlePreferenceToggle("showOnlineStatus")}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-base-200/50 border border-base-300/40">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">⌨️</span>
                        <div>
                          <p className="font-bold text-xs text-base-content">Press Enter to Send</p>
                          <p className="text-[11px] text-base-content/60">Send messages immediately by pressing Enter.</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary toggle-sm"
                        checked={preferences.enterToSend}
                        onChange={() => handlePreferenceToggle("enterToSend")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;