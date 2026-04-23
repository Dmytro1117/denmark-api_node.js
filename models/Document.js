const { Schema, model } = require("mongoose");
const { handleSaveError } = require("../middlewares/handleSaveError");
const { setUpdateOptions } = require("../helpers/setUpdateOptions");
const {
  documentCategories,
  countrySelection,
} = require("../constants/constant");

const documentSchema = new Schema(
  {
    country: {
      type: String,
      enum: countrySelection,
      required: true,
    },

    category: {
      type: String,
      enum: documentCategories,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      default: "",
      maxlength: 300,
    },

    done: {
      type: Boolean,
      default: false,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
  },
  { versionKey: false, timestamps: true },
);

documentSchema.post("save", handleSaveError);
documentSchema.pre("findOneAndUpdate", setUpdateOptions);
documentSchema.post("findOneAndUpdate", handleSaveError);

module.exports = model("document", documentSchema, "denmarkDocuments");
