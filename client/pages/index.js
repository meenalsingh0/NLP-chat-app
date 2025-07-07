import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export default function Home() {
  const SOCKET_URL = "http://localhost:4000";

  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const socketRef = useRef();

  /* -------- establish socket connection once -------- */
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("all messages", (msgs) => setAllMessages(msgs));
    socketRef.current.on("new message", (msg) =>
      setAllMessages((prev) => [...prev, msg])
    );

    return () => socketRef.current.disconnect();
  }, []);

  /* ---------------- send a new chat message ---------------- */
  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socketRef.current.emit("send message", {
      body: message,
      username: "You",
    });
    setMessage("");
  };

  /* --------------------------- UI --------------------------- */
  return (
    <>
      <Head>
        <title>NLP‑chat‑app</title>
        <meta name="description" content="sentiment analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 24,
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h2 style={{ marginBottom: 16 }}> NLP Chat App</h2>

        {/* chat history */}
        <div
          style={{
            height: 350,
            width: "100%",
            maxWidth: 520,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: 12,
            marginBottom: 12,
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column", // so alignSelf works
          }}
        >
          {allMessages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf:
                  m.username === "Bot" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                margin: "6px 0",
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor:
                  m.username === "Bot" ? "#fff3cd" : "#e0f0ff",
                textAlign: m.username === "Bot" ? "right" : "left",
              }}
            >
              {/* username label (optional) */}
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {m.username || "Anon"}
              </div>

              {/* message text */}
              <div>{m.body}</div>

              {/* tone & score */}
              {m.tone && (
                <div
                  style={{
                    fontSize: "12px",
                    marginTop: 4,
                    fontStyle: "italic",
                    color: "#555",
                  }}
                >
                  Tone: {m.tone} |  Score: {m.score}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* message input */}
        <form
          onSubmit={sendMessage}
          style={{
            width: "100%",
            maxWidth: 520,
            display: "flex",
            gap: 8,
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 6,
              backgroundColor: "#fff",   // white box
              color: "#000",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </main>
    </>
  );
}
