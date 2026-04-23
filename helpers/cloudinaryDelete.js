const cloudinary = require("./cloudinaryConfig");

const cloudinaryDelete = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // Витягуєм public_id з посилання Cloudinary
    // Приклад: .../denmark/gallery/name.jpg -> denmark/gallery/name
    const parts = imageUrl.split("/");
    const folderIndex = parts.indexOf("denmark");
    const publicIdWithExtension = parts.slice(folderIndex).join("/");
    const publicId = publicIdWithExtension.split(".")[0];

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

module.exports = cloudinaryDelete;
