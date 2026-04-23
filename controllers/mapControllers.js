const { NotFound, BadRequest, Conflict } = require("http-errors");
const Map = require("../models/Maps");
const { countrySelection } = require("../constants/constant");
const { controllerWrapper } = require("../decorators/controllerWrapper");

const { DEFAULT_ICON_MAP } = process.env;

const getHotspots = async (req, res) => {
  const { mapType } = req.query;
  const owner = req.user?._id;

  // Валідація mapType, щоб не робити пустих запитів
  if (mapType && !countrySelection.includes(mapType)) {
    throw new BadRequest(`Invalid map type: ${mapType}`);
  }

  const filter = owner ? { owner } : { isTemplate: true };
  if (mapType) filter.mapType = mapType;

  const hotspots = await Map.find(filter)
    .select("-createdAt -updatedAt")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    code: 200,
    hotspots,
  });
};

// GET /api/map/:hotspotId
const getHotspotById = async (req, res) => {
  const { hotspotId } = req.params;
  const owner = req.user?._id;

  const hotspot = await Map.findOne({
    _id: hotspotId,
    ...(owner ? { owner } : { isTemplate: true }),
  }).select("-createdAt -updatedAt");

  if (!hotspot) {
    throw new NotFound("Hotspot not found");
  }

  res.status(200).json({
    status: "success",
    code: 200,
    hotspot,
  });
};

// POST /api/hotspots;
const createHotspot = async (req, res) => {
  const owner = req.user._id;
  // Витягуємо imageUrl і name окремо для дефолту, а решту (... weatherQuery) лишаємо в payload
  const { imageUrl, name, ...payload } = req.body;

  const isExistHotspot = await Map.findOne({ name, owner });
  if (isExistHotspot) {
    const error = new Conflict(`Hotspot with name "${name}" already exists`);
    error.fields = { text: "Duplicate name detected" };
    throw error;
  }

  const hotspot = await Map.create({
    ...payload,
    owner,
    imageUrl: imageUrl || DEFAULT_ICON_MAP,
    name,
    isTemplate: false,

    // Якщо з фронта прийшов weatherQuery — беремо його, якщо ні — беремо payload.name
    weatherQuery: payload.weatherQuery || name,
  });

  res.status(201).json({
    status: "success",
    code: 201,
    hotspot,
  });
};

//  PATCH /api/hotspots/:hotspotId
const updateHotspot = async (req, res) => {
  const { hotspotId } = req.params;
  const owner = req.user._id;

  const existingMap = await Map.findOne({ _id: hotspotId, owner });
  if (!existingMap)
    throw new NotFound(`Hotspot cannot be updated because it does not exist`);

  //  перевірка на ідентичність
  const isIdentical =
    (req.body.name === undefined || req.body.name === existingMap.name) &&
    (req.body.category === undefined ||
      req.body.category === existingMap.category) &&
    (req.body.description === undefined ||
      req.body.description === existingMap.description) &&
    (req.body.imageUrl === undefined ||
      req.body.imageUrl === existingMap.imageUrl) &&
    (req.body.mapType === undefined ||
      req.body.mapType === existingMap.mapType);

  if (isIdentical) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "No changes detected to save",
    });
  }

  const { name, weatherQuery, ...payload } = req.body;

  const updateData = { ...payload };
  if (name) updateData.name = name;

  // Логіка погоди: якщо name змінився, оновлюємо weatherQuery автоматично,
  // якщо прийшов прямий weatherQuery - він у пріоритеті.
  if (name || weatherQuery) {
    updateData.weatherQuery = weatherQuery || name;
  }

  const hotspot = await Map.findOneAndUpdate(
    { _id: hotspotId, owner },
    updateData,
    { new: true },
  ).select("-createdAt -updatedAt");

  if (!hotspot) throw new NotFound(`Hotspot not found`);

  res.status(200).json({
    status: "success",
    code: 200,
    hotspot,
  });
};

//  DELETE /api/hotspots/:hotspotId
const deleteHotspot = async (req, res) => {
  const { hotspotId } = req.params;
  const owner = req.user._id;

  const hotspot = await Map.findOneAndDelete({
    _id: hotspotId,
    owner,
  }).select("-createdAt -updatedAt");

  if (!hotspot) throw new NotFound(`Hotspot does not exist  in this map`);

  res.status(200).json({
    status: "success",
    code: 200,
    message: "Delete success",
    hotspot,
  });
};

module.exports = {
  getHotspots: controllerWrapper(getHotspots),
  createHotspot: controllerWrapper(createHotspot),
  updateHotspot: controllerWrapper(updateHotspot),
  deleteHotspot: controllerWrapper(deleteHotspot),
  getHotspotById: controllerWrapper(getHotspotById),
};
