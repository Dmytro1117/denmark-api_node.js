const { NotFound, BadRequest, Conflict } = require("http-errors");
const Document = require("../models/Document");
const { controllerWrapper } = require("../decorators/controllerWrapper");
const { countrySelection } = require("../constants/constant");

//  GET /api/documents
const allDocuments = async (req, res) => {
  const { done = undefined, country } = req.query;
  const owner = req.user?._id;

  if (country && !countrySelection.includes(country)) {
    throw new BadRequest(`Invalid country parameter: ${country}`);
  }

  const filter = owner ? { owner } : { isTemplate: true };

  if (country) filter.country = country;

  if (done !== undefined) {
    filter.done = done === "true";
  }

  const documents = await Document.find(filter)
    .select("-createdAt -updatedAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    code: 200,
    documents,
  });
};

//  POST /api/documents
const addOneDocument = async (req, res) => {
  const owner = req.user._id;
  const { text } = req.body;

  const isExistDoc = await Document.findOne({ text, owner });
  if (isExistDoc) {
    const error = new Conflict(`Document with name "${text}" already exists`);
    error.fields = { text: "Duplicate name detected" };
    throw error;
  }

  const document = await Document.create({ ...req.body, owner });

  res.status(201).json({
    status: "success",
    code: 201,
    document,
  });
};

//  PUT /api/documents/:documentId
const updateDocumentById = async (req, res) => {
  const { documentId } = req.params;
  const owner = req.user._id;

  const existingDoc = await Document.findOne({ _id: documentId, owner });
  if (!existingDoc)
    throw new NotFound(`Document cannot be updated because it was not found`);

  const isIdentical =
    (req.body.category === undefined ||
      req.body.category === existingDoc.category) &&
    (req.body.text === undefined || req.body.text === existingDoc.text) &&
    (req.body.note === undefined || req.body.note === (existingDoc.note || ""));

  if (isIdentical) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "No changes detected to save",
    });
  }

  const document = await Document.findOneAndUpdate(
    { _id: documentId, owner },
    { ...req.body },
    { new: true },
  ).select("-createdAt -updatedAt");

  res.status(200).json({
    status: "success",
    code: 200,
    document,
  });
};

//  PATCH /api/documents/:documentId/done
const updateDone = async (req, res) => {
  const { documentId } = req.params;
  const { done } = req.body;
  const owner = req.user._id;

  if (done === undefined) {
    throw new BadRequest("Field 'done' is required");
  }

  const document = await Document.findOneAndUpdate(
    { _id: documentId, owner },
    { done },
    { new: true },
  ).select("-createdAt -updatedAt");

  if (!document) throw new NotFound(`Unable to update the field`);

  res.json({
    status: "success",
    code: 200,
    document,
  });
};

//  DELETE /api/documents/:documentId
const deleteDocumentById = async (req, res) => {
  const { documentId } = req.params;
  const owner = req.user._id;

  const document = await Document.findOneAndDelete({
    _id: documentId,
    owner,
  }).select("-createdAt -updatedAt");

  if (!document) throw new NotFound(`Document does not exist`);

  res.json({
    status: "success",
    code: 200,
    message: "Delete success",
    document,
  });
};

module.exports = {
  allDocuments: controllerWrapper(allDocuments),
  addOneDocument: controllerWrapper(addOneDocument),
  updateDocumentById: controllerWrapper(updateDocumentById),
  updateDone: controllerWrapper(updateDone),
  deleteDocumentById: controllerWrapper(deleteDocumentById),
};
