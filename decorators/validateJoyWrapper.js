const validateJoyWrapper = (joiSchema) => {
  return (req, res, next) => {
    const { error } = joiSchema.validate(req.body, { abortEarly: false });

    if (error) {
      // Створюємо об'єкт: { email: "message", password: "message" }
      const fields = {};
      error.details.forEach((err) => {
        const key = err.context.key;
        fields[key] = err.message;
      });

      // Передаємо цей об'єкт далі.
      return res.status(400).json({
        message: "Validation error",
        fields: fields,
      });
    }
    next();
  };
};

module.exports = validateJoyWrapper;
