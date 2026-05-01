# 🚀 Profanity Filter Microservice – Implementation Guide

## 📌 Overview

This project is a **Node.js-based microservice** designed to detect, clean, and manage abusive or profane text. It uses a combination of:

* Predefined profanity detection (`leo-profanity`)
* Custom word lists (Hindi/Hinglish abusive words)
* Runtime dynamic word management (add/remove words)

The service is built using **Express.js** and follows a modular, scalable API-first approach.

---

## 🧱 Tech Stack

* Node.js
* Express.js
* leo-profanity (for profanity detection)
* Helmet (security headers)
* CORS (cross-origin support)
* Morgan (logging)
* express-rate-limit (rate limiting)
* dotenv (environment config)

---

## ⚙️ Project Setup

### 1. Initialize project

```bash
npm init -y
```

### 2. Install dependencies

```bash
npm install express leo-profanity cors helmet express-rate-limit morgan dotenv
```

### 3. Install dev dependency

```bash
npm install -D nodemon
```

### 4. Run the server

```bash
npm start
```

### Development mode

```bash
npm run dev
```

---

## 📁 Project Structure

```
abusive-filter-project/
│
├── index.js          # Main application entry point
├── package.json      # Project configuration
├── .env              # Environment variables (optional)
└── IMPLEMENTATION.md # Documentation
```

---

## 🔐 Middleware Configuration

The following middleware is configured in the app:

### Security

* `helmet()` → protects HTTP headers

### CORS

* `cors()` → allows cross-origin requests

### Logging

* `morgan("dev")` → logs incoming requests

### Rate Limiting

* Limits each IP to **100 requests per 15 minutes**

```js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

---

## 🧠 Profanity Engine

### Base Engine

Uses:

```js
leo-profanity
```

### Custom Words

Includes Hindi/Hinglish abusive terms:

```js
["chutiya", "gandu", "bhenchod", ...]
```

### Dynamic Words

* Stored in memory (`dynamicBadWords`)
* Can be updated via API

---

## 🌐 API Endpoints

---

### ✅ Health Check

**GET** `/health`

Returns service status.

---

### 🔍 Check Profanity

**POST** `/api/check`

```json
{
  "text": "you are stupid"
}
```

Response:

* Detects if text contains abusive words

---

### 🧹 Clean Text

**POST** `/api/clean`

* Replaces abusive words with `****`

---

### 🚫 Validate Content

**POST** `/api/validate`

* Blocks abusive content
* Returns HTTP `422` if invalid

---

### ➕ Add Words

**POST** `/api/words/add`

```json
{
  "words": ["newbadword"]
}
```

* Adds new words dynamically

---

### ❌ Remove Words

**DELETE** `/api/words/remove`

```json
{
  "words": ["badword"]
}
```

* Removes words from filter

---

### 📋 Get All Words

**GET** `/api/words`

* Returns all active bad words

---

## ⚠️ Validation Rules

* `text` must be a string
* `words` must be a non-empty array
* Case-insensitive handling applied

---

## 🧠 Internal Flow

```
Incoming Request
      ↓
Middleware (helmet, cors, logger, limiter)
      ↓
Validation
      ↓
Profanity Engine (leo-profanity + custom words)
      ↓
Response (clean / flagged / blocked)
```

---

## ⚡ Performance Considerations

* In-memory word list → fast lookup
* No DB calls → low latency
* Rate limiting prevents abuse

---

## ⚠️ Limitations

* Easily bypassed using:

  * spacing (`g a n d u`)
  * symbols (`g@ndu`)
* No context understanding (rule-based only)
* No multi-language detection beyond added words

---

## 🚀 Future Improvements

### 1. Text Normalization

Handle obfuscation:

```js
f@ck → fuck
g a n d u → gandu
```

---

### 2. Database Integration

* Store words in DB (PostgreSQL/MongoDB)
* Persist dynamic changes

---

### 3. Redis Caching

* Cache word lists for high performance

---

### 4. AI Moderation Layer

* Detect toxicity beyond keywords
* Integrate ML APIs

---

### 5. Multi-language Support

* Hindi, Hinglish, regional languages

---

### 6. Role-based filtering

* Different rules for:

  * chat
  * comments
  * public posts

---

## 🧪 Testing

Example using curl:

```bash
curl -X POST http://localhost:3000/api/check \
-H "Content-Type: application/json" \
-d '{"text":"tu chutiya hai"}'
```

---

## 📌 Conclusion

This microservice provides a **fast, extensible foundation** for content moderation in social platforms. It is designed to scale with additional features like AI moderation, database persistence, and multilingual support.

---
