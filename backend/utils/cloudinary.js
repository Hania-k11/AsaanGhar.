const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "asaanghar_properties", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    resource_type: "auto", // handles images & pdfs automatically
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
