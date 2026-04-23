const express = require("express");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const {
  updateAvatar,
  changePassword,
  deleteAccount,
} = require("../controllers/userControllers");
const { changePasswordJoiSchema } = require("../schemas/userJoiSchemas");
const authenticate = require("../middlewares/authenticate");
const multerDownload = require("../middlewares/multerDownload");

const userRouter = express.Router();

userRouter.use(authenticate);

userRouter.patch("/avatars", multerDownload.single("avatar"), updateAvatar);

userRouter.patch(
  "/changePassword",
  validateJoyWrapper(changePasswordJoiSchema),
  changePassword,
);

userRouter.delete("/deleteAccount", deleteAccount);

module.exports = userRouter;
