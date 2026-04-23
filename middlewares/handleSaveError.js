const handleSaveError = (error, data, next) => {
  const { name, code } = error;

  if (name === "ValidationError") {
    const fields = {};
    Object.values(error.errors).forEach((err) => {
      // err.path — це назва поля в схемі (email, password)
      // err.message — текст помилки з моделі
      fields[err.path] = err.message;
    });

    error.status = 400;
    error.fields = fields;
    error.message = "Validation Error"; // Загальний текст
  } else if (name === "MongoServerError" && code === 11000) {
    error.status = 409;
    // Замість розкриття імейла пишемо нейтральний текст
    error.fields = { email: "This email is unavailable" };
    error.message = "Registration conflict";
  } else {
    error.status = 400;
  }

  next(error);
};

module.exports = { handleSaveError };
