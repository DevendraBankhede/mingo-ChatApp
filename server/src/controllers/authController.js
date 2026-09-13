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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      fullName,
      email,
      mobileNumber,
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

    const existingUser = await User.findOne({ email });
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

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      const error = new Error("Password did not match");
      error.statusCode = 400;
      return next(error);
    }

    generateToken(existingUser._id, res);

    const userData = existingUser.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

// ================= GOOGLE LOGIN =================
export const GoogleUserLogin = async (req, res, next) => {
  try {
    const { name, email, id, imageUrl } = req.body;

    let existingUser = await User.findOne({ email });
    const salt = await bcrypt.genSalt(10);

    if (existingUser && existingUser.loginType) {
      if (existingUser.loginType === "normal_user") {
        existingUser.loginType = "hybrid_user";
        existingUser.google_id = await bcrypt.hash(id, salt);
        if (imageUrl && !existingUser.profilePic) existingUser.profilePic = imageUrl;
        await existingUser.save();
      } else {
        const isVerified = await bcrypt.compare(id, existingUser.google_id);
        if (!isVerified) {
          const error = new Error("User Not Verified");
          error.statusCode = 400;
          return next(error);
        }
        if (imageUrl && !existingUser.profilePic) {
          existingUser.profilePic = imageUrl;
          await existingUser.save();
        }
      }
    } else {
      const hashGoogleID = await bcrypt.hash(id, salt);
      const newUser = await User.create({
        fullName: name,
        email,
        google_id: hashGoogleID,
        profilePic: imageUrl || "",
        loginType: "google_user",
      });
      existingUser = newUser;
    }

    generateToken(existingUser._id, res);
    res.status(200).json({
      message: "Login successful",
      data: existingUser,
    });
  } catch (error) {
    next(error);
  }
};