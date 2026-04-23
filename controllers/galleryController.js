const { NotFound, BadRequest, Forbidden } = require("http-errors");
const Gallery = require("../models/Gallery");
const { controllerWrapper } = require("../decorators/controllerWrapper");
const cloudinaryDownload = require("../helpers/cloudinaryDownload");
const cloudinaryDelete = require("../helpers/cloudinaryDelete");

const getAllPhotos = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;

  if (isNaN(page) || isNaN(limit)) {
    throw new BadRequest("Page and limit must be numbers");
  }

  //  Визначаєм фільтр: якщо є юзер — його фото, якщо немає — фото з owner: null
  const filter = req.user ? { owner: req.user._id } : { isTemplate: true };

  const skip = (Number(page) - 1) * Number(limit);

  const images = await Gallery.find(filter)
    .select("-updatedAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Gallery.countDocuments(filter);

  res.status(200).json({
    status: "success",
    code: 200,
    images,
    total,
  });
};

const addPhotosToGallery = async (req, res) => {
  const { _id: owner } = req.user;
  const { description = "" } = req.body;

  const files = req.files?.galleryPhotos;

  if (!files || files.length === 0) {
    return res.status(400).json({
      message: "Validation error",
      fields: { galleryPhotos: "Please, select at least one photo" },
    });
  }

  const uploadPromises = files.map((file) =>
    cloudinaryDownload(file, "gallery"),
  );
  const urls = await Promise.all(uploadPromises);

  // Створюєм масив об'єктів для бази даних
  const galleryPhotosData = urls.map((url) => ({
    url,
    description,
    owner,
    isTemplate: false,
  }));

  const result = await Gallery.insertMany(galleryPhotosData);

  res.status(201).json({
    status: "success",
    code: 201,
    images: result,
  });
};

const deletePhotoFromGallery = async (req, res) => {
  const { photoGalleryId } = req.params;
  const { _id: owner } = req.user;

  const photo = await Gallery.findOne({ _id: photoGalleryId });

  if (!photo) {
    throw new NotFound("Photo not found or already deleted");
  }

  if (photo.owner.toString() !== owner.toString()) {
    throw new Forbidden("You don't have permission to delete this photo");
  }

  if (photo.url) {
    await cloudinaryDelete(photo.url);
  }

  // Видаляєм тільки якщо ID збігається І власник — поточний юзер
  const result = await Gallery.findOneAndDelete({ _id: photoGalleryId, owner });

  if (!result) {
    throw new NotFound(
      "Photo not found or you do not have permission to delete it",
    );
  }

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Photo deleted",
    id: photoGalleryId,
  });
};

module.exports = {
  getAllPhotos: controllerWrapper(getAllPhotos),
  addPhotosToGallery: controllerWrapper(addPhotosToGallery),
  deletePhotoFromGallery: controllerWrapper(deletePhotoFromGallery),
};
