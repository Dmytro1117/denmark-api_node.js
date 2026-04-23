const { Schema, model } = require("mongoose");
const { handleSaveError } = require("../middlewares/handleSaveError");

const gallerySchema = new Schema(
  {
    url: { type: String, required: true },
    description: { type: String, required: [true, "Description is required"] },
    isTemplate: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Owner is required"],
      index: true,
    },
  },
  { versionKey: false, timestamps: true },
);

gallerySchema.post("save", handleSaveError);

const Gallery = model("gallery", gallerySchema, "denmarkGallery");
module.exports = Gallery;
