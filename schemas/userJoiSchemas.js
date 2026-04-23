const Joi = require("joi");

const messages = {
  oldPassword: {
    "string.min": "Old password must be at least 6 characters",
    "string.max": "Old password is too long (max 30)",
    "any.required": "Old password is required",
    "string.empty": "Old password cannot be empty",
  },

  newPassword: {
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password is too long (max 30)",
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  },

  newPasswordConfirm: {
    "any.only": "New Password do not match",
    "any.required": "Please confirm your New Password",
    "string.empty": "New Password cannot be empty",
    "string.min": " New Password must be at least 6 characters",
    "string.max": "New Password is too long (max 30)",
  },
};

const changePasswordJoiSchema = Joi.object({
  oldPassword: Joi.string()
    .min(6)
    .max(30)
    .required()
    .empty("")
    .messages(messages.oldPassword),
  newPassword: Joi.string()
    .min(6)
    .max(30)
    .required()
    .empty("")
    .messages(messages.newPassword),
  newPasswordConfirm: Joi.string()
    .required()
    .empty("")
    .min(6)
    .max(30)
    .valid(Joi.ref("newPassword"))
    .messages(messages.newPasswordConfirm),
});

module.exports = { changePasswordJoiSchema };
