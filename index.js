const express = require("express");
const profanity = require("leo-profanity");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests. Try after 15 mins." },
});
app.use(limiter);

const customBadWords = [
  "chutiya", "gandu", "bhenchod", "madarchod",
  "bc", "mc", "bkl", "lodu", "randi", "harami",
  "sala", "saala", "bakait", "gaand", "lavde",
  "bhosdike", "chodu", "kutte", "kamine",
];

profanity.add(customBadWords);
let dynamicBadWords = [...customBadWords];

// GET /health
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "Profanity Filter Microservice",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// POST /api/check
app.post("/api/check", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ success: false, message: "text field is required and must be a string." });
  }
  const isProfane = profanity.check(text);
  return res.json({
    success: true, input: text, isProfane,
    message: isProfane ? "⚠️ Abusive content detected!" : "✅ Text is clean.",
  });
});

// POST /api/clean
app.post("/api/clean", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ success: false, message: "text field is required and must be a string." });
  }
  const isProfane = profanity.check(text);
  const cleanedText = isProfane ? profanity.clean(text) : text;
  return res.json({
    success: true, input: text, output: cleanedText, isProfane,
    message: isProfane ? "⚠️ Profanity found and cleaned." : "✅ Text was already clean.",
  });
});

// POST /api/validate
app.post("/api/validate", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ success: false, message: "text field is required." });
  }
  if (profanity.check(text)) {
    return res.status(422).json({
      success: false, allowed: false,
      message: "🚫 Your message contains abusive words. Please be respectful.",
    });
  }
  return res.json({ success: true, allowed: true, message: "✅ Message is allowed." });
});

// POST /api/words/add
app.post("/api/words/add", (req, res) => {
  const { words } = req.body;
  if (!words || !Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ success: false, message: "words must be a non-empty array." });
  }
  const newWords = words.map((w) => w.toLowerCase().trim());
  const alreadyExist = newWords.filter((w) => dynamicBadWords.includes(w));
  const toAdd = newWords.filter((w) => !dynamicBadWords.includes(w));
  if (toAdd.length > 0) { profanity.add(toAdd); dynamicBadWords.push(...toAdd); }
  return res.json({
    success: true, added: toAdd, skipped: alreadyExist,
    totalWords: dynamicBadWords.length,
    message: `${toAdd.length} word(s) added successfully.`,
  });
});

// DELETE /api/words/remove
app.delete("/api/words/remove", (req, res) => {
  const { words } = req.body;
  if (!words || !Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ success: false, message: "words must be a non-empty array." });
  }
  const toRemove = words.map((w) => w.toLowerCase().trim());
  const removed = toRemove.filter((w) => dynamicBadWords.includes(w));
  if (removed.length > 0) { profanity.remove(removed); dynamicBadWords = dynamicBadWords.filter((w) => !removed.includes(w)); }
  return res.json({
    success: true, removed, totalWords: dynamicBadWords.length,
    message: `${removed.length} word(s) removed.`,
  });
});

// GET /api/words
app.get("/api/words", (req, res) => {
  return res.json({ success: true, totalWords: dynamicBadWords.length, words: dynamicBadWords });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Profanity Filter Microservice running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
