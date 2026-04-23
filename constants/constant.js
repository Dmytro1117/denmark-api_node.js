const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const countrySelection = ["ua", "dk"];

const levelOptions = ["A1", "A2", "B1", "B2"];

const resultStudy = ["known", "unknown"];

const modeStudy = ["topic", "repeat"];

const hotspotCategories = [
  "city",
  "camp",
  "border",
  "bridge",
  "attraction",
  "hotel",
  "other",
];

const documentCategories = [
  "IDENTITY",
  "LEGAL",
  "FAMILY",
  "HEALTH",
  "CAR",
  "FINANCE",
  "ECOLOGICAL",
  "SOCIAL",
  "DIGITAL",
  "BANKING",
  "DOCUMENT",
  "OTHER",
];

module.exports = {
  documentCategories,
  levelOptions,
  hotspotCategories,
  resultStudy,
  emailRegexp,
  countrySelection,
  modeStudy,
};
