# 🚀 Profanity Filter Microservice

A lightweight and extensible **Node.js microservice** to detect, clean, and manage abusive or profane text.
Built for use in social media platforms, chat systems, and content moderation pipelines.

---

## 📌 Features

* ✅ Detect abusive words in text
* 🧹 Clean/replace profanity automatically
* 🚫 Validate & block inappropriate content
* ➕ Add custom abusive words dynamically
* ❌ Remove words dynamically
* 📋 Fetch all active filtered words
* ⚡ Rate limiting for API protection
* 🔐 Security middleware (Helmet, CORS)

---

## 🧱 Tech Stack

* Node.js
* Express.js
* leo-profanity
* Helmet
* CORS
* Morgan
* express-rate-limit

---

## 📁 Project Structure

```
.
├── index.js
├── package.json
├── package-lock.json
├── implementation.md
├── README.md
├── .env
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/RockingChauhan/Post-Moderation-Microservcie.git
cd Post-Moderation-Microservcie
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server

#### Production

```bash
npm start
```

#### Development (auto-restart)

```bash
npm run dev
```

---

## 🌐 Base URL

```
http://localhost:3000
```

---

## 🔌 API Endpoints

---

### 🟢 Health Check

**GET** `/health`

```json
{
  "success": true,
  "status": "running"
}
```

---

### 🔍 Check Profanity

**POST** `/api/check`

```json
{
  "text": "tu chutiya hai"
}
```

---

### 🧹 Clean Text

**POST** `/api/clean`

```json
{
  "text": "tu chutiya hai"
}
```

---

### 🚫 Validate Content

**POST** `/api/validate`

```json
{
  "text": "abusive text"
}
```

Returns `422` if content is not allowed.

---

### ➕ Add Words

**POST** `/api/words/add`

```json
{
  "words": ["newbadword"]
}
```

---

### ❌ Remove Words

**DELETE** `/api/words/remove`

```json
{
  "words": ["badword"]
}
```

---

### 📋 Get All Words

**GET** `/api/words`

---

## 🧠 How It Works

```
User Input → Middleware → Validation → Profanity Engine → Response
```

* Uses `leo-profanity` for base filtering
* Adds custom Hindi/Hinglish abusive words
* Supports dynamic runtime updates

---

## ⚠️ Limitations

* ❌ Can be bypassed using:

  * spacing (`g a n d u`)
  * symbols (`g@ndu`)
* ❌ No context-aware filtering
* ❌ No AI moderation

---

## 🚀 Future Improvements

* 🔤 Text normalization (handle obfuscation)
* 🌍 Multi-language support
* 🧠 AI-based toxicity detection
* 🗄️ Database + Redis caching
* 📊 Admin dashboard for moderation

---

## 🧪 Testing (cURL Example)

```bash
curl -X POST http://localhost:3000/api/check \
-H "Content-Type: application/json" \
-d '{"text":"tu chutiya hai"}'
```

---

## 📦 Postman Collection

Included in repo:

```
Profanity-Filter.postman_collection.json
```

---

## 👨‍💻 Author

Sudhanshu Chauhan

---

## 📄 License

ISC License
