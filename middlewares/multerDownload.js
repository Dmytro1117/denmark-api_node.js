const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

const destinationTemp = path.resolve("temp");

const multerConfig = multer.diskStorage({
  destination: destinationTemp,
  filename: (req, file, callback) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = createError(
      400,
      "Unsupported image format (use jpg,jpeg, png or gif)",
    );
    error.fields = { avatar: error.message };

    return callback(error, false);
  }
  callback(null, true);
};

const multerDownload = multer({
  storage: multerConfig,
  limits,
  fileFilter,
});

module.exports = multerDownload;
