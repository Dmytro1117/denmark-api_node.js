const express = require("express");
const optionalAuthenticate = require("../middlewares/optionalAuthenticate");
const authenticate = require("../middlewares/authenticate");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const isValidId = require("../middlewares/isValidId");

const {
  getHotspots,
  getHotspotById,
  createHotspot,
  updateHotspot,
  deleteHotspot,
} = require("../controllers/mapControllers");

const {
  hotspotCreateJoi,
  hotspotUpdateJoi,
} = require("../schemas/mapJoiSchemas");

const mapRouter = express.Router();

mapRouter.get("/", optionalAuthenticate, getHotspots);

mapRouter.get("/:hotspotId", optionalAuthenticate, isValidId, getHotspotById);

mapRouter.post(
  "/",
  authenticate,
  validateJoyWrapper(hotspotCreateJoi),
  createHotspot,
);

mapRouter.patch(
  "/:hotspotId",
  authenticate,
  isValidId,
  validateJoyWrapper(hotspotUpdateJoi),
  updateHotspot,
);

mapRouter.delete("/:hotspotId", authenticate, isValidId, deleteHotspot);

module.exports = mapRouter;
