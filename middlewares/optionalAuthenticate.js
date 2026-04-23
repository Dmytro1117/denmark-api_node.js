const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SECRET_KEY } = process.env;

const optionalAuthenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) return next();

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (user && user.token === token) {
      req.user = user;
    }
    next();
  } catch {
    next();
  }
};

module.exports = optionalAuthenticate;
