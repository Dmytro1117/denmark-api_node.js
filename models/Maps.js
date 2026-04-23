const { Schema, model } = require("mongoose");
const { handleSaveError } = require("../middlewares/handleSaveError");
const { setUpdateOptions } = require("../helpers/setUpdateOptions");
const { countrySelection, hotspotTypes } = require("../constants/constant");

const mapSchema = new Schema(
  {
    mapType: {
      type: String,
      enum: countrySelection,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    category: {
      type: String,
      enum: hotspotTypes,
      required: true,
    },

    position: {
      x: { type: Number, required: true, min: 0, max: 100 },
      y: { type: Number, required: true, min: 0, max: 100 },
    },

    imageUrl: { type: String, default: "" },

    description: { type: String, required: true, maxlength: 5000 },
    weatherQuery: { type: String, default: "" },

    isTemplate: { type: Boolean, default: false },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      default: null, // template = owner null
      index: true,
    },
  },
  { versionKey: false, timestamps: true },
);

mapSchema.post("save", handleSaveError);
mapSchema.pre("findOneAndUpdate", setUpdateOptions);
mapSchema.post("findOneAndUpdate", handleSaveError);

const Map = model("map", mapSchema, "denmarkMaps");
module.exports = Map;
