const { Schema, model } = require("mongoose");
const { handleSaveError } = require("../middlewares/handleSaveError");
const { setUpdateOptions } = require("../helpers/setUpdateOptions");
const { resultStudy } = require("../constants/constant");

const studyProgressSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    wordId: {
      type: Schema.Types.ObjectId,
      ref: "studyWord",
      required: true,
      index: true,
    },

    lastResult: {
      type: String,
      enum: resultStudy,
      default: null,
    },

    lastSeenAt: { type: Date, default: null },

    inRepeat: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true },
);

studyProgressSchema.index({ owner: 1, wordId: 1 }, { unique: true });
studyProgressSchema.index({ owner: 1, inRepeat: 1, lastSeenAt: 1 });

studyProgressSchema.post("save", handleSaveError);
studyProgressSchema.pre("findOneAndUpdate", setUpdateOptions);
studyProgressSchema.post("findOneAndUpdate", handleSaveError);

const StudyProgress = model(
  "studyProgress",
  studyProgressSchema,
  "denmarkStudyProgress",
);
module.exports = StudyProgress;
