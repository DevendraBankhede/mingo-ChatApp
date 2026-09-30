import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGoogleAuth } from "../config/GoogleAuth";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useAuth();
  const { isLoading, error, isInitialized, signInWithGoogle } = useGoogleAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({ email: "", password: "" });
  };

  const handleGoogleSuccess = async (userData) => {
    console.log("Google Login Data", userData);
    setLoading(true);
    try {
      const res = await api.post("/auth/googleLogin", userData);
      toast.success(res.data.message);
      sessionStorage.setItem("AppUser", JSON.stringify(res.data.data));
      setUser(res.data.data);
      setIsLogin(true);
      navigate("/chat");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  const handleGoogleLogin = () => {
    signInWithGoogle(handleGoogleSuccess, handleGoogleFailure);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      toast.success(res.data.message);
      sessionStorage.setItem("AppUser", JSON.stringify(res.data.data));
      setUser(res.data.data);
      setIsLogin(true);
      handleClearForm();
      navigate("/chat");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-base-200/50 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Branding Header */}
        <div className="text-center mb-6">
          <div className="inline-flex size-14 rounded-2xl bg-gradient-to-tr from-primary to-accent items-center justify-center text-2xl text-primary-content shadow-lg shadow-primary/20 mb-3 animate-float">
            💬
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-base-content">Welcome back</h2>
          <p className="text-base-content/60 text-sm mt-1">Sign in to your Mingo account to start chatting</p>
        </div>

        <div className="card bg-base-100/90 backdrop-blur-md shadow-xl border border-base-300/60 rounded-3xl">
          <div className="card-body gap-5 p-6 sm:p-8">
            <form onSubmit={handleSubmit} onReset={handleClearForm} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="reset" disabled={loading} className="btn btn-ghost flex-1 rounded-xl text-xs font-semibold">
                  Clear
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary flex-1 rounded-xl font-bold shadow-md shadow-primary/20">
                  {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
                </button>
              </div>
            </form>

            <div className="divider text-base-content/30 text-xs my-0 font-medium">OR</div>

            {/* Google Login */}
            {error ? (
              <button
                className="btn btn-outline btn-error w-full gap-2 rounded-xl text-xs font-semibold"
                disabled
              >
                <FcGoogle className="text-lg" />
                {error}
              </button>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="btn btn-outline w-full gap-2 rounded-xl border-base-300 hover:bg-base-200 text-xs font-semibold"
                disabled={!isInitialized || isLoading || loading}
              >
                <FcGoogle className="text-lg" />
                {isLoading
                  ? <span className="loading loading-spinner loading-sm" />
                  : isInitialized
                    ? "Continue with Google"
                    : "Google Auth Error"}
              </button>
            )}

            <p className="text-center text-xs text-base-content/60 font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-base-content/40 mt-6 font-medium">
          🔒 Encrypted &amp; Protected by JWT Authentication
        </p>
      </div>
    </div>
  );
};

export default Login;