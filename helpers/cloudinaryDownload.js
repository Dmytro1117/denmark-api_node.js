const fs = require("fs/promises");
const cloudinary = require("./cloudinaryConfig");

const BASE_FOLDER = "denmark";

const cloudinaryDownload = async (
  file,
  subfolder,
  transformation = [],
  publicId,
) => {
  const filePath = file.path;

  const options = {
    folder: `${BASE_FOLDER}/${subfolder}`,
    transformation,
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  };

  if (publicId) {
    options.public_id = publicId;
    options.overwrite = true;
    options.invalidate = true;
  }

  const result = await cloudinary.uploader.upload(filePath, options);
  await fs.unlink(filePath);

  return result.secure_url;
};

module.exports = cloudinaryDownload;
