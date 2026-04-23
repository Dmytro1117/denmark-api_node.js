const express = require("express");
const {
  allDocuments,
  addOneDocument,
  updateDocumentById,
  updateDone,
  deleteDocumentById,
} = require("../controllers/documentsControllers");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const authenticate = require("../middlewares/authenticate");
const optionalAuthenticate = require("../middlewares/optionalAuthenticate");
const isValidId = require("../middlewares/isValidId");
const {
  documentAddJoi,
  documentUpdateJoi,
  documentDoneJoi,
} = require("../schemas/documentsJoiSchemas");

const documentsRouter = express.Router();

documentsRouter.get("/", optionalAuthenticate, allDocuments);

documentsRouter.post(
  "/",
  authenticate,
  validateJoyWrapper(documentAddJoi),
  addOneDocument,
);

documentsRouter.put(
  "/:documentId",
  authenticate,
  isValidId,
  validateJoyWrapper(documentUpdateJoi),
  updateDocumentById,
);

documentsRouter.patch(
  "/:documentId/done",
  authenticate,
  isValidId,
  validateJoyWrapper(documentDoneJoi),
  updateDone,
);

documentsRouter.delete(
  "/:documentId",
  authenticate,
  isValidId,
  deleteDocumentById,
);

module.exports = documentsRouter;
