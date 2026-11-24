import "./env.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localUploadsDir = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

// Check if Cloudinary credentials are configured
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
  process.env.CLOUDINARY_API_KEY?.trim() &&
  process.env.CLOUDINARY_API_SECRET?.trim()
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim().toLowerCase(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
  });
}

// Multer memory storage (allows streaming to Cloudinary or saving to disk)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files (.jpg, .jpeg, .png, .webp) are allowed!"));
  },
});

/**
 * Saves an uploaded buffer locally on the server disk
 */
const saveFileLocally = (fileBuffer, originalname) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalname) || ".jpg";
  const filename = `${uniqueSuffix}${ext}`;
  const filePath = path.join(localUploadsDir, filename);

  fs.writeFileSync(filePath, fileBuffer);
  return `/uploads/${filename}`;
};

/**
 * Upload buffer to Cloudinary with automatic local fallback
 */
export const uploadImageToStorage = async (fileBuffer, originalname) => {
  if (isCloudinaryConfigured) {
    try {
      const url = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "dormmart/products",
            transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileBuffer);
      });
      return url;
    } catch (cloudinaryErr) {
      console.warn(`⚠️ Cloudinary upload failed (${cloudinaryErr.message}). Automatically saving image locally.`);
      return saveFileLocally(fileBuffer, originalname);
    }
  } else {
    // Local storage fallback
    return saveFileLocally(fileBuffer, originalname);
  }
};

export { isCloudinaryConfigured, localUploadsDir };
