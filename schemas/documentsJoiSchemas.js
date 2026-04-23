const Joi = require("joi");
const {
  documentCategories,
  countrySelection,
} = require("../constants/constant");

const documentAddJoi = Joi.object({
  country: Joi.string()
    .valid(...countrySelection)
    .required()
    .messages({
      "any.required": "Country is required",
      "any.only": "Invalid country selection",
    }),

  category: Joi.string()
    .valid(...documentCategories)
    .required()
    .messages({
      "any.required": "Category is required",
      "any.only": "Invalid category selected",
    }),

  text: Joi.string().min(3).max(60).required().messages({
    "any.required": "Document name is required",
    "string.empty": "Document name cannot be empty",
    "string.min": "Document name must be at least 3 character long",
    "string.max": "Document name must be at most 50 characters",
  }),

  note: Joi.string().max(300).allow("").messages({
    "string.max": "Notes cannot exceed 300 characters",
  }),

  done: Joi.boolean(),
});

const documentUpdateJoi = Joi.object({
  country: Joi.string().valid(...countrySelection),
  category: Joi.string().valid(...documentCategories),
  text: Joi.string().min(3).max(60).messages({
    "string.empty": "Document name cannot be empty",
    "string.min": "Document name must be at least 3 character",
    "string.max": "Document name must be at most 50 characters",
  }),
  note: Joi.string().max(300).allow("").messages({
    "string.max": "Notes cannot exceed 300 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const documentDoneJoi = Joi.object({
  done: Joi.boolean().required().messages({
    "any.required": "Status 'done' is required",
  }),
});

module.exports = {
  documentAddJoi,
  documentUpdateJoi,
  documentDoneJoi,
};
