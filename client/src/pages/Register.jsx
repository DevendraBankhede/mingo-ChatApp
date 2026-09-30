import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/api";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    });
    setValidationError({});
  };

  const validate = () => {
    let Error = {};

    if (formData.fullName.length < 3) {
      Error.fullName = "Name should be more than 3 characters";
    } else if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
      Error.fullName = "Only alphabets and spaces allowed";
    }

    if (
      !/^[\w.]+@(gmail|outlook|yahoo|ricr)\.(com|in|co\.in)$/.test(
        formData.email
      )
    ) {
      Error.email = "Use proper email format";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      Error.mobileNumber = "Only Indian mobile numbers allowed";
    }

    if (formData.password !== formData.confirmPassword) {
      Error.confirmPassword = "Passwords do not match";
    }

    setValidationError(Error);
    return Object.keys(Error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      toast.error("Fill the form correctly");
      return;
    }

    try {
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message);
      handleClearForm();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-base-200/50 px-4 py-10 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/3 size-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Branding Header */}
        <div className="text-center mb-6">
          <div className="inline-flex size-14 rounded-2xl bg-gradient-to-tr from-accent to-primary items-center justify-center text-2xl text-primary-content shadow-lg shadow-primary/20 mb-3 animate-float">
            ✨
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-base-content">Create Account</h2>
          <p className="text-base-content/60 text-sm mt-1">Join Mingo to start chatting with your friends</p>
        </div>

        <div className="card bg-base-100/90 backdrop-blur-md shadow-xl border border-base-300/60 rounded-3xl">
          <div className="card-body gap-4 p-6 sm:p-8">
            <form onSubmit={handleSubmit} onReset={handleClearForm} className="space-y-3.5">

              <div className="space-y-1">
                <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary ${validationError.fullName ? "input-error" : ""}`}
                />
                {validationError.fullName && (
                  <p className="text-error text-[11px] font-medium mt-1">{validationError.fullName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary ${validationError.email ? "input-error" : ""}`}
                />
                {validationError.email && (
                  <p className="text-error text-[11px] font-medium mt-1">{validationError.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="9876543210"
                  maxLength="10"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary ${validationError.mobileNumber ? "input-error" : ""}`}
                />
                {validationError.mobileNumber && (
                  <p className="text-error text-[11px] font-medium mt-1">{validationError.mobileNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`input input-bordered w-full text-sm rounded-xl focus:outline-none focus:border-primary ${validationError.confirmPassword ? "input-error" : ""}`}
                  />
                  {validationError.confirmPassword && (
                    <p className="text-error text-[11px] font-medium mt-1">{validationError.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="reset" disabled={isLoading} className="btn btn-ghost flex-1 rounded-xl text-xs font-semibold">
                  Clear
                </button>
                <button type="submit" disabled={isLoading} className="btn btn-primary flex-1 rounded-xl font-bold shadow-md shadow-primary/20">
                  {isLoading ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-base-content/60 font-medium pt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-base-content/40 mt-5 font-medium">
          🔒 We respect your privacy and protect your credentials
        </p>
      </div>
    </div>
  );
};

export default Register;