const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
dotenv.config();
const swaggerDocument = require("./swagger.json");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRouter");
const documentsRouter = require("./routes/documentsRouter");
const galleryRouter = require("./routes/galleryRouter");
const mapRouter = require("./routes/mapRouter");
const studyRouter = require("./routes/studyRouter");

const { BASE_FRONTEND_URL } = process.env;

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));

app.use(
  cors({
    origin: ["http://localhost:5173", BASE_FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/map", mapRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/study", studyRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "Error",
    code: 404,
    message: "Route not found. Check /api-docs",
    fields: null,
  });
});

app.use((err, req, res, next) => {
  //  Обробка специфічної помилки Multer (Розмір файлу)
  if (err.code === "LIMIT_FILE_SIZE") {
    const fieldName = err.field || "file";
    return res.status(400).json({
      status: "Error",
      code: 400,
      message: "Validation error",
      fields: { [fieldName]: "File too large (max 5MB)" },
    });
  }

  //  Стандартна обробка всіх інших помилок
  const { status = 500, message = "Server error", fields } = err;
  res.status(status).json({
    status: "Error",
    code: status,
    message,
    fields,
  });
});

module.exports = app;
