const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const config = require("../config");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () =>
  !!(config.cloudinary?.cloudName && config.cloudinary?.apiKey && config.cloudinary?.apiSecret);

// Configure Cloudinary (required!)
if (!isCloudinaryConfigured()) {
  // Cloudinary is not configured - will throw error when upload is attempted
} else {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

// Multer configuration for handling file uploads in memory
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${ALLOWED_MIMES.join(", ")}`), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

// Upload image to Cloudinary
async function handleImageUpload(file) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured. Please add credentials to your .env file.");
  }

  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

module.exports = { upload, handleImageUpload };

