const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pdf_uploads",
    resource_type: "raw",
    access_mode: "public",
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Chỉ cho phép upload file PDF"), false);
    }

    cb(null, true);
  },
});

module.exports = upload;