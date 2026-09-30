import jwt from "jsonwebtoken";

export const generateToken = (id, res) => {
  const token = jwt.sign({ _id: id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: process.env.COOKIE_SAME_SITE || (isProd ? "none" : "lax"),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};