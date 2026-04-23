const { NotFound, BadRequest } = require("http-errors");
const StudyWord = require("../models/StudyWord");
const StudyProgress = require("../models/StudyProgress");
const { resultStudy, levelOptions } = require("../constants/constant");
const { controllerWrapper } = require("../decorators/controllerWrapper");

// GET /api/study/topics?level=A2
const getTopics = async (req, res) => {
  const owner = req.user._id;
  const { level } = req.query;

  if (!levelOptions.includes(level)) {
    throw new BadRequest(
      `Invalid level: "${level}". Valid: ${levelOptions.join(", ")}`,
    );
  }

  const filter = { level };

  const words = await StudyWord.find(filter).select("_id topic");

  if (words.length === 0) {
    return res.status(200).json({
      availableTopics: {
        repeat: { wordsInRepeat: 0 },
        learnedWords: 0,
        topics: [],
      },
    });
  }

  const progressList = await StudyProgress.find({ owner }).select(
    "wordId inRepeat -_id",
  );

  let repeatCount = 0;
  let learnedCount = 0;

  for (let word of words) {
    // Шукаєм, чи є запис у БД про це конкретне слово для цього юзера
    const progress = progressList.find(
      (p) => p.wordId.toString() === word._id.toString(),
    );

    // Якщо progress існує — значить юзер хоча б раз бачив це слово
    if (progress) {
      learnedCount += 1;

      // Якщо воно ще й у черзі на повторення — рахуємо в repeat
      if (progress.inRepeat) {
        repeatCount += 1;
      }
    }
  }

  const topics = [];
  for (let word of words) {
    const topicName = word.topic || "general";
    let topicItem = topics.find((t) => t.topic === topicName);
    if (!topicItem) {
      topicItem = { topic: topicName, totalWords: 0 };
      topics.push(topicItem);
    }
    topicItem.totalWords += 1;
  }

  topics.sort((a, b) => a.topic.localeCompare(b.topic));

  return res.status(200).json({
    availableTopics: {
      repeat: { wordsInRepeat: repeatCount },
      learnedWords: learnedCount,
      topics,
    },
  });
};

// GET /api/study/words?mode=topic|repeat&level=A2&topicName=general
const getWords = async (req, res) => {
  const owner = req.user._id;

  const { mode = "topic", level, topicName } = req.query;

  if (mode === "topic") {
    if (!level || !topicName) {
      throw new BadRequest(
        "Parameters 'level' and 'topicName' are required for topic mode",
      );
    }
    const words = await StudyWord.find({ level, topic: topicName }).select(
      "-createdAt -updatedAt",
    );

    return res.status(200).json({ status: "success", words });
  }

  // ===== REPEAT MODE =====

  const progressList = await StudyProgress.find({
    owner,
    inRepeat: true,
  }).select("wordId lastSeenAt -_id");

  if (progressList.length === 0) {
    return res.status(200).json({ words: [] });
  }

  const filter = {};
  if (level) filter.level = level;

  const allWords = await StudyWord.find(filter).select("-createdAt -updatedAt");

  if (allWords.length === 0) {
    return res.status(200).json({ words: [] });
  }

  const repeatPairs = [];

  for (let p of progressList) {
    const word = allWords.find((w) => w._id.toString() === p.wordId.toString());

    if (word) {
      repeatPairs.push({
        word,
        lastSeenAt: p.lastSeenAt ? new Date(p.lastSeenAt).getTime() : 0,
      });
    }
  }

  repeatPairs.sort((a, b) => a.lastSeenAt - b.lastSeenAt);

  const cleanWords = repeatPairs.map((item) => item.word);

  return res.status(200).json({ words: cleanWords });
};

// POST /api/study/:wordId/answer
const answerWord = async (req, res) => {
  const owner = req.user._id;
  const { wordId } = req.params;
  const { result, mode } = req.body;

  if (!resultStudy.includes(result)) {
    throw new BadRequest(`Result must be parameter: ${resultStudy.join(", ")}`);
  }

  const wordExists = await StudyWord.findById(wordId);
  if (!wordExists) {
    throw new NotFound("Word not found");
  }

  let progress = await StudyProgress.findOne({ owner, wordId });

  if (!progress) {
    progress = new StudyProgress({
      owner,
      wordId,
      lastResult: null,
      lastSeenAt: null,
      inRepeat: false,
    });
  }

  progress.lastResult = result;
  progress.lastSeenAt = new Date();

  if (result === "unknown") {
    progress.inRepeat = true;
  }

  if (result === "known" && mode === "repeat") {
    progress.inRepeat = false;
  }

  await progress.save();

  const cleanProgress = await StudyProgress.findById(progress._id).select(
    "-createdAt -updatedAt",
  );

  return res.status(200).json({
    status: "success",
    code: 200,
    progress: cleanProgress,
  });
};

module.exports = {
  getTopics: controllerWrapper(getTopics),
  getWords: controllerWrapper(getWords),
  answerWord: controllerWrapper(answerWord),
};
