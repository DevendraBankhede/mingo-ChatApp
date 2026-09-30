import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize original file name
    const sanitizedOriginalName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(sanitizedOriginalName);
    const baseName = path.basename(sanitizedOriginalName, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

// File filter to allow documents, images, audio, zip, code, etc.
const fileFilter = (req, file, cb) => {
  // Allow all typical documents and media
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit
  },
  fileFilter,
});
