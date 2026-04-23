const express = require("express");
const {
  getAllPhotos,
  addPhotosToGallery,
  deletePhotoFromGallery,
} = require("../controllers/galleryController");
const optionalAuthenticate = require("../middlewares/optionalAuthenticate");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const authenticate = require("../middlewares/authenticate");
const isValidId = require("../middlewares/isValidId");
const { addPhotoJoiSchema } = require("../schemas/galleryJoiSchema");
const multerDownload = require("../middlewares/multerDownload");

const galleryRouter = express.Router();

galleryRouter.get("/", optionalAuthenticate, getAllPhotos);

galleryRouter.post(
  "/",
  authenticate,
  multerDownload.fields([{ name: "galleryPhotos", maxCount: 10 }]),
  validateJoyWrapper(addPhotoJoiSchema),
  addPhotosToGallery,
);

galleryRouter.delete(
  "/:photoGalleryId",
  authenticate,
  isValidId,
  deletePhotoFromGallery,
);

module.exports = galleryRouter;
