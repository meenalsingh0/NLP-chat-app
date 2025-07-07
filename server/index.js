const express  = require("express");
const http     = require("http");
const socketIO = require("socket.io");
const cors     = require("cors");
const Sentiment = require("sentiment");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const sentiment = new Sentiment();

/* ---------- helpers ---------- */
const getToneAndScore = (text) => {
  const { score } = sentiment.analyze(text);

  let tone = "Neutral";
  if (score > 2) tone = "Joy";
  else if (score < -3) tone = "Anger";
  else if (score < 0) tone = "Sad";

  return { tone, score };
};

const getBotReply = (tone) => {
  if (tone === "Joy")   return "Glad to hear that!";
  if (tone === "Anger") return "Learn to control your emotions.";
  if(tone == "Sad") return "Talking to someone will be great for you.";
  return "Hi ! Thanks for sharing!";
};
/* -------------------------------- */

let messages = [];               // in‑memory history

io.on("connection", (socket) => {
  console.log("User connected");
  socket.emit("all messages", messages);   // send history

  socket.on("send message", (messageObj) => {
    console.log("New message:", messageObj.body);

    // 1. analyse sentiment
    const { tone, score } = getToneAndScore(messageObj.body);
    messageObj.tone  = tone;
    messageObj.score = score;

    // 2. broadcast user message
    messages.push(messageObj);
    io.emit("new message", messageObj);

    // 3. bot reply (skip if the sender *is* the bot)
    const username = messageObj.username || "";   // handle undefined
    if (username !== "Bot") {
      setTimeout(() => {
        const botMessage = {
          body: getBotReply(tone),
          username: "Bot",
          id: "bot-id",
          tone: "Neutral",
          score: 0,
        };
        messages.push(botMessage);
        io.emit("new message", botMessage);
      }, 1000); // small delay
    }
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

//start server 
server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
