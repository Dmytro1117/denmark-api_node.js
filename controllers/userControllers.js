const createError = require("http-errors");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const cloudinaryDownload = require("../helpers/cloudinaryDownload");
const { controllerWrapper } = require("../decorators/controllerWrapper");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) throw createError(400, "Please, input file");

  const avatar = await cloudinaryDownload(
    req.file,
    "avatar",
    [{ width: 350, height: 350, crop: "fill" }],
    `user_${_id}`, // той самий public_id, перезаписує
  );

  await User.findByIdAndUpdate(_id, { avatar });

  res.status(200).json({
    status: "success",
    code: 200,
    avatar,
  });
};

const changePassword = async (req, res) => {
  const { _id, password: hashPasswordInDb } = req.user;
  const { oldPassword, newPassword } = req.body;

  const isMatch = await bcrypt.compare(oldPassword, hashPasswordInDb);
  if (!isMatch) {
    throw createError(400, "Old password is wrong");
  }

  const isSame = await bcrypt.compare(newPassword, hashPasswordInDb);
  if (isSame) {
    throw createError(400, "New password must be different");
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(_id, {
    password: newHash,
    token: null, // розлогінити після зміни пароля
  });

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Password changed successfully. Please login again.",
  });
};

const Gallery = require("../models/Gallery");
const Document = require("../models/Document");
const Map = require("../models/Maps");
const StudyProgress = require("../models/StudyProgress");
const cloudinaryDelete = require("../helpers/cloudinaryDelete");

const deleteAccount = async (req, res) => {
  const { _id } = req.user;

  const user = await User.findById(_id);
  if (!user) throw createError(404, "User not found");

  if (user.avatar) {
    await cloudinaryDelete(user.avatar);
  }

  const userPhotos = await Gallery.find({ owner: _id });

  for (let photo of userPhotos) {
    if (photo.url) {
      await cloudinaryDelete(photo.url);
    }
  }

  await Gallery.deleteMany({ owner: _id });

  await Document.deleteMany({ owner: _id });

  await Map.deleteMany({ owner: _id });

  await StudyProgress.deleteMany({ owner: _id });

  await User.findByIdAndDelete(_id);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Account deleted successfully",
  });
};

module.exports = {
  deleteAccount: controllerWrapper(deleteAccount),
  updateAvatar: controllerWrapper(updateAvatar),
  changePassword: controllerWrapper(changePassword),
};
