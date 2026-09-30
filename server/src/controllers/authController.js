import { generateToken } from "../config/authToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// ================= REGISTER =================
export const UserRegister = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password } = req.body;

    if (!fullName || !email || !mobileNumber || !password) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      mobileNumber: mobileNumber.trim(),
      password: hashedPassword,
      loginType: "normal_user",
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
};

// ================= LOGIN =================
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statusCode = 400;
      return next(error);
    }

    if (existingUser.loginType === "google_user") {
      const error = new Error("Please log in with Google");
      error.statusCode = 400;
      return next(error);
    }

    if (!existingUser.password) {
      const error = new Error("Account has no password set. Please log in with Google");
      error.statusCode = 400;
      return next(error);
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      const error = new Error("Password did not match");
      error.statusCode = 400;
      return next(error);
    }

    const token = generateToken(existingUser._id, res);

    const userData = existingUser.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      data: userData,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ================= GOOGLE LOGIN =================
export const GoogleUserLogin = async (req, res, next) => {
  try {
    const { name, email, id, imageUrl } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    let existingUser = await User.findOne({ email: normalizedEmail });
    const salt = await bcrypt.genSalt(10);

    if (existingUser && existingUser.loginType) {
      if (existingUser.loginType === "normal_user") {
        existingUser.loginType = "hybrid_user";
        existingUser.google_id = await bcrypt.hash(id, salt);
        if (imageUrl && !existingUser.profilePic) existingUser.profilePic = imageUrl;
        await existingUser.save();
      } else {
        if (existingUser.google_id) {
          const isVerified = await bcrypt.compare(id, existingUser.google_id);
          if (!isVerified) {
            const error = new Error("User Not Verified");
            error.statusCode = 400;
            return next(error);
          }
        } else {
          existingUser.google_id = await bcrypt.hash(id, salt);
        }
        if (imageUrl && !existingUser.profilePic) {
          existingUser.profilePic = imageUrl;
        }
        await existingUser.save();
      }
    } else {
      const hashGoogleID = await bcrypt.hash(id, salt);
      const newUser = await User.create({
        fullName: name,
        email: normalizedEmail,
        google_id: hashGoogleID,
        profilePic: imageUrl || "",
        loginType: "google_user",
      });
      existingUser = newUser;
    }

    const token = generateToken(existingUser._id, res);

    const userData = existingUser.toObject();
    delete userData.password;
    delete userData.google_id;

    res.status(200).json({
      message: "Login successful",
      data: userData,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// ================= LOGOUT =================
export const UserLogout = async (req, res, next) => {
  try {
    const isProd = process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// ================= GET ME =================
export const GetMe = async (req, res, next) => {
  try {
    res.status(200).json({ data: req.user });
  } catch (error) {
    next(error);
  }
};