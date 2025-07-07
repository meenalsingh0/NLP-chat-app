# 🧠 NLP Chat App

A fun little real-time chat app I built using **Next.js**, **Socket.IO**, and a bit of sentiment analysis magic 🧪

Messages get a tone (like Joy, Sad, or Anger) based on their content, and a friendly bot replies with a fitting response.

## 🛠️ What it does
- 🗨️ Send real-time messages
- 🔍 Detects tone and sentiment (Joy, Anger, Sad, Neutral)
- 🤖 Bot responds based on how your message sounds
- 🖼️ Clean UI with message bubbles and scores

## 🧰 Built with
- Next.js (frontend)
- Express + Socket.IO (backend)
- Sentiment.js (local sentiment analysis, no API needed)

## ▶️ How to run

```bash
# Start backend
cd backend
npm install
node index.js

# Start frontend
cd frontend
npm install
npm run dev
