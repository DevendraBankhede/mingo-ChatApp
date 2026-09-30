import express from "express";
import { getAllUsers, updateProfile } from "../controllers/userController.js";
import {
  SendMessage,
  GetMessages,
  UploadDocument,
} from "../controllers/messageController.js";
import { Protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/allUsers", Protect, getAllUsers);
router.get("/allusers", Protect, getAllUsers);
router.put("/profile", Protect, updateProfile);

router.post("/upload-document", Protect, upload.single("file"), UploadDocument);
router.post("/send-message", Protect, SendMessage);
router.get("/get-messages/:friendId", Protect, GetMessages);

export default router;