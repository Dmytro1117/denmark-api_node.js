const Joi = require("joi");
const { emailRegexp } = require("../constants/constant");

const messages = {
  email: {
    "string.pattern.base": "Enter a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  },
  password: {
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password is too long (max 30)",
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  },
  name: {
    "string.min": "Name must be at least 2 characters",
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  },
  passwordConfirm: {
    "any.only": "Passwords do not match",
    "any.required": "Please confirm your password",
    "string.empty": "Confirmation passwords cannot be empty",
  },
};

const registerJoiSchema = Joi.object({
  name: Joi.string().min(2).required().messages(messages.name),
  email: Joi.string().pattern(emailRegexp).required().messages(messages.email),
  password: Joi.string().min(6).max(30).required().messages(messages.password),
});

const loginJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages(messages.email),
  password: Joi.string().min(6).required().messages(messages.password),
});

const verifyJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages(messages.email),
});

const forgotPasswordJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages(messages.email),
});

const resetPasswordJoiSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .empty("")
    .messages(messages.password),
  passwordConfirm: Joi.string()
    .required()
    .empty("")
    .valid(Joi.ref("password"))
    .messages(messages.passwordConfirm),
});

module.exports = {
  registerJoiSchema,
  verifyJoiSchema,
  loginJoiSchema,
  forgotPasswordJoiSchema,
  resetPasswordJoiSchema,
};
