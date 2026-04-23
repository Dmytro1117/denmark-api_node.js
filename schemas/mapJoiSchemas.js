const Joi = require("joi");
const {
  countrySelection,
  hotspotCategories,
} = require("../constants/constant");

const messages = {
  mapType: {
    "any.only": "Country must be one of: {#valids}",
    "any.required": "Field 'mapType' is required",
  },
  name: {
    "string.min": "The Name Point must be at least 3 characters long",
    "string.max": "The Name Point is too long (max. 80)",
    "any.required": "Name Point is required",
    "string.empty": "Name Point cannot be empty",
  },
  category: {
    "any.required": "Category is required",
    "any.only": "Invalid category selected",
  },
  position: {
    "any.required": "Coordinates are required",
  },
  imageUrl: {
    "string.uri": "Invalid photo URL format",
  },
  description: {
    "string.min": "The Description must be at least 3 characters long",
    "string.max": "The Description is too long (max. 5000)",
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty",
  },
  isTemplate: {
    "any.unknown": "You cannot change the template status",
  },
};

const hotspotCreateJoi = Joi.object({
  mapType: Joi.string()
    .valid(...countrySelection)
    .required()
    .messages(messages.mapType),

  name: Joi.string().min(3).max(80).required().messages(messages.name),

  category: Joi.string()
    .valid(...hotspotCategories)
    .required()
    .messages(messages.category),

  position: Joi.object({
    x: Joi.number().min(0).max(100).required(),
    y: Joi.number().min(0).max(100).required(),
  })
    .required()
    .messages(messages.position),

  imageUrl: Joi.string().uri().allow("").messages(messages.imageUrl),

  description: Joi.string()
    .min(3)
    .max(5000)
    .required()
    .messages(messages.description),

  weatherQuery: Joi.string().allow("").optional(),

  isTemplate: Joi.boolean().forbidden().messages(messages.isTemplate),
});

const hotspotUpdateJoi = Joi.object({
  mapType: Joi.string()
    .valid(...countrySelection)
    .messages(messages.mapType),
  name: Joi.string().min(3).max(80).messages(messages.name),
  category: Joi.string()
    .valid(...hotspotCategories)
    .messages(messages.category),
  position: Joi.object({
    x: Joi.number().min(0).max(100),
    y: Joi.number().min(0).max(100),
  }).messages(messages.position),
  imageUrl: Joi.string().uri().allow("").messages(messages.imageUrl),
  description: Joi.string().min(3).max(5000).messages(messages.description),
  weatherQuery: Joi.string().allow("").optional(),
  isTemplate: Joi.boolean().forbidden().messages(messages.isTemplate),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

module.exports = { hotspotCreateJoi, hotspotUpdateJoi };
