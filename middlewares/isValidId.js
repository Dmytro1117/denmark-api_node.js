const { isValidObjectId } = require("mongoose");
const { BadRequest } = require("http-errors");

const isValidId = (req, res, next) => {
  // беремо перший ліпший параметр, що закінчується на Id
  const id = Object.values(req.params)[0];
  if (!isValidObjectId(id)) {
    return next(BadRequest(`${id} is not valid id.`));
  }
  next();
};

module.exports = isValidId;
