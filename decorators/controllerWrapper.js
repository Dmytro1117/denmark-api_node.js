const fs = require("fs/promises");

const controllerWrapper = (controller) => {
  const func = async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      if (req.file) {
        fs.access(req.file.path)
          .then(() => fs.unlink(req.file.path))
          .catch(() => {}); // ігноруєм, якщо файлу вже немає
      }

      next(error);
    }
  };

  return func;
};

module.exports = { controllerWrapper };
