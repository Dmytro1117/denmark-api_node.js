const Joi = require("joi");
const { resultStudy, modeStudy } = require("../constants/constant");

const studyAnswerJoi = Joi.object({
  result: Joi.string()
    .trim()
    .lowercase()
    .valid(...resultStudy)
    .required()
    .messages({
      "any.only": "Result must be one of: {#valids}",
      "any.required": "Field 'result' is required",
    }),
  mode: Joi.string()
    .trim()
    .lowercase()
    .valid(...modeStudy)
    .messages({
      "any.only": "Mode must be one of: {#valids}",
      "any.required": "Field 'mode' is required",
    }),
});

module.exports = {
  studyAnswerJoi,
};
