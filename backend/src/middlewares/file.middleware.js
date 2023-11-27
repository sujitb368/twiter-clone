// controllers/userController.js
import multer from "multer";
import path from "path";
import { __dirname } from "../config.js";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded images
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const fileExtension = path.extname(file.originalname);
    // Set the filename for the uploaded image
    cb(null, "profile-pic-" + uniqueSuffix + fileExtension);
  },
});

// Create a Multer instance with the storage and size limits settings

const upload = multer({
  storage: storage,
  limit: {
    fileSize: 3 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types (image/png, image/jpg, image/jpeg)
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        JSON.stringify({
          message:
            "only file type allowed are image/png, image/jpg, image/jpeg",
          success: false,
          error: "file type not allowed",
        })
      );
    }
  },
});

// Function to download a file
const downloadFile = (req, res) => {
  console.log("download for post", req.params.filename);
  const { filename } = req.params;
  const path = __dirname + "/images/";

  // Download the file
  res.download(path + filename, (error) => {
    if (error) {
      res.status(500).send({
        success: false,
        message: "File cannot be downloaded " + error,
      });
    }
  });
};

export { upload, downloadFile };
