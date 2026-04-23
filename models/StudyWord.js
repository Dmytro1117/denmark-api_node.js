const { Schema, model } = require("mongoose");
const { handleSaveError } = require("../middlewares/handleSaveError");
const { setUpdateOptions } = require("../helpers/setUpdateOptions");

const studyWordSchema = new Schema(
  {
    en: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    da: { type: String, required: true, trim: true, maxlength: 80 },
    uk: { type: String, required: true, trim: true, maxlength: 120 },

    topic: { type: String, default: "general", trim: true, maxlength: 40 },
    level: { type: String, default: "A1", trim: true, maxlength: 10 },
  },
  { versionKey: false, timestamps: true },
);

studyWordSchema.post("save", handleSaveError);
studyWordSchema.pre("findOneAndUpdate", setUpdateOptions);
studyWordSchema.post("findOneAndUpdate", handleSaveError);

const StudyWord = model("studyWord", studyWordSchema, "denmarkStudy");
module.exports = StudyWord;
