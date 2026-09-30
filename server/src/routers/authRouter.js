import express from "express";
import { UserRegister, UserLogin, GoogleUserLogin, UserLogout, GetMe } from "../controllers/authController.js";
import { GoogleProtect } from "../middleware/googleMiddleware.js";
import { Protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/googleLogin", GoogleProtect, GoogleUserLogin);
router.post("/logout", UserLogout);
router.get("/me", Protect, GetMe);

export default router;