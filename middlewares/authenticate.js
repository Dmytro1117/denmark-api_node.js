const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(createError(401, "Authorization header not found"));
  }
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(createError(401, "Bearer not found"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      return next(
        createError(401, "User already logged out or not authorized"),
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(createError(401, `Not authorized: ${error.message}`));
  }
};

module.exports = authenticate;
