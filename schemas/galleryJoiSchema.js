const Joi = require("joi");

const addPhotoJoiSchema = Joi.object({
  description: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "The name must be at least 2 characters long",
    "string.max": "The name is too long (max. 100)",
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty",
  }),
});

module.exports = {
  addPhotoJoiSchema,
};
