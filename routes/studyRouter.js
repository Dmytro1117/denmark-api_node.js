const express = require("express");
const authenticate = require("../middlewares/authenticate");
const validateJoyWrapper = require("../decorators/validateJoyWrapper");
const isValidId = require("../middlewares/isValidId");

const {
  getTopics,
  getWords,
  answerWord,
} = require("../controllers/studyControllers");

const { studyAnswerJoi } = require("../schemas/studyJoiSchemas");

const studyRouter = express.Router();

studyRouter.use(authenticate);

// GET /api/study/topics?level=A2
studyRouter.get("/topics", getTopics);

// GET /api/study/words?mode=topic|repeat&level=A2&topic=general
studyRouter.get("/words", getWords);

// POST /api/study/:wordId/answer
studyRouter.post(
  "/:wordId/answer",
  isValidId,
  validateJoyWrapper(studyAnswerJoi),
  answerWord,
);

module.exports = studyRouter;
