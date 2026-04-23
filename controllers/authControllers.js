const mongoose = require("mongoose");
const crypto = require("crypto");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { brevoSendVerifyEmail } = require("../helpers/brevoSendVerifyEmail");
const { resetPasswordLetter } = require("../helpers/resetPasswordLetter");
const cloudinary = require("../helpers/cloudinaryConfig");
const cloudinaryDownload = require("../helpers/cloudinaryDownload");
const { verifycationLetter } = require("../helpers/verifycationLetter");
const { controllerWrapper } = require("../decorators/controllerWrapper");

const { SECRET_KEY, DEFAULT_AVATAR } = process.env;

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    // Не створюєм поле fields, щоб фронт не знав, де саме помилка
    throw createError(409, "Email is already in use");
  }

  const userId = new mongoose.Types.ObjectId();

  let avatarURL = DEFAULT_AVATAR;
  if (req.file) {
    // Якщо Cloudinary впаде тут —  просто вийдем, юзер у базу ще не потрапив!
    avatarURL = await cloudinaryDownload(
      req.file,
      "avatar",
      [{ width: 350, height: 350, crop: "fill" }],
      `user_${userId}`, // Використовуємо наш згенерований ID
    );
  }

  // (використовуєм let, щоб мати доступ у catch)
  let newUser;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    newUser = await User.create({
      _id: userId,
      name,
      email,
      password: hashPassword,
      avatar: avatarURL,
      verificationToken,
    });

    const verifyEmail = verifycationLetter({ email, verificationToken });
    await brevoSendVerifyEmail(verifyEmail);

    res.status(201).json({
      status: "success",
      code: 201,
      message: "Registration successful! Please verify your email.",
      user: { email, name, avatar: avatarURL },
    });
  } catch (error) {
    //  Якщо завантажили файл, але реєстрація не завершилася успіхом - видаляємо його
    if (req.file) {
      await cloudinary.uploader.destroy(`denmark/avatar/user_${userId}`);
    }

    // Якщо юзер встиг створитися в БД (наприклад, впала пошта), видаляємо юзера
    if (newUser) {
      await User.findByIdAndDelete(userId);
    }

    // Якщо це валідація (400), яку обробляє handleSaveError — кидаємо далі
    if (error.name === "ValidationError") throw error;

    // Все інше (помилки Brevo, Cloudinary ...) — 500
    throw createError(500, "Registration failed. Please try again later.");
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  res.set("Cache-Control", "no-store");

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw createError(410, "Verification token is invalid or expired");
  }

  if (user.verify) {
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Email already verified",
    });
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw createError(404, "Email not found");
  if (user.verify)
    throw createError(400, "Verification has already been passed");

  const newToken = crypto.randomBytes(32).toString("hex");

  await User.findByIdAndUpdate(user._id, { verificationToken: newToken });

  const verifyEmail = verifycationLetter({
    email,
    verificationToken: newToken,
  });

  await brevoSendVerifyEmail(verifyEmail);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Verify resend email send success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw createError(401, "Email or password invalid");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw createError(401, "Email or password invalid");

  if (!user.verify) {
    throw createError(401, "Email not verified");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    status: "success",
    code: 200,
    token,
    user: {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    },
  });
};

const current = async (req, res) => {
  const { email, name, avatar } = req.user;

  res.status(200).json({
    status: "success",
    code: 200,
    user: {
      email,
      name,
      avatar,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Logout success",
  });
};

const fogotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "If the email exists, a reset link has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Термін дії (15 хв)
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await User.findByIdAndUpdate(user._id, {
    resetPasswordToken: resetTokenHash,
    resetPasswordExpires: expiresAt,
  });

  const letter = resetPasswordLetter({ email, resetToken });
  await brevoSendVerifyEmail(letter);

  return res.status(200).json({
    status: "success",
    code: 200,
    message: "If the email exists, a reset link has been sent.",
  });
};

const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw createError(400, "Reset token is invalid or expired");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(user._id, {
    password: hashPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null,
    token: null, // розлогінити з усіх пристроїв
  });

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Password has been reset successfully",
  });
};

module.exports = {
  register: controllerWrapper(register),
  verifyEmail: controllerWrapper(verifyEmail),
  resendVerifyEmail: controllerWrapper(resendVerifyEmail),
  login: controllerWrapper(login),
  current: controllerWrapper(current),
  logout: controllerWrapper(logout),
  fogotPassword: controllerWrapper(fogotPassword),
  resetPassword: controllerWrapper(resetPassword),
};
