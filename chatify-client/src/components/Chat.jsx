// src/pages/Chat.jsx
import { useState, useEffect } from "react";
import { getMessages, createMessage, deleteMessage } from "../services.js";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const botAvatar = (() => {
    let stored = sessionStorage.getItem("botAvatar");
    if (stored) return stored;
    const randomId = Math.floor(Math.random() * 70) + 1;
    const url = `https://i.pravatar.cc/40?img=${randomId}`;
    sessionStorage.setItem("botAvatar", url);
    return url;
  })();

  const userAvatar = sessionStorage.getItem("avatar") || "https://i.pravatar.cc/40";
  const jwt = sessionStorage.getItem("jwtToken");
  const jwtPayload = parseJwt(jwt);
  const realUsername = (jwtPayload?.username || "").trim().toLowerCase();

  async function loadMessages() {
    try {
      const data = await getMessages();
      const formattedMessages = data.map((msg) => {
        const msgUser = (msg.username || "").trim().toLowerCase();
        if (msgUser === realUsername) {
          return {
            ...msg,
            isUser: true,
            username: "You",
            avatar: userAvatar,
          };
        } else {
          return {
            ...msg,
            isUser: false,
            username: "SupportBot",
            avatar: msg.avatar || botAvatar,
          };
        }
      });
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Kunde inte hämta meddelanden:", error);
      setError("Kunde inte hämta meddelanden.");
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const tempId = Date.now().toString();
      const newMsg = {
        id: tempId,
        text: trimmed,
        createdAt: new Date().toISOString(),
        isUser: true,
        username: "You",
        avatar: userAvatar,
      };
      setMessages((prev) => [...prev, newMsg]);
      setText("");

      const response = await createMessage({ text: trimmed });
      const realId = response?.latestMessage?.id;
      if (realId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId ? { ...msg, id: realId } : msg
          )
        );
      }

      setTimeout(() => {
        const botMsg = {
          id: Date.now().toString(),
          text: "Auto-response: Tack för ditt meddelande!",
          createdAt: new Date().toISOString(),
          isUser: false,
          username: "SupportBot",
          avatar: botAvatar,
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 1000);
    } catch (error) {
      console.error("Kunde inte skicka meddelande:", error);
      setError("Kunde inte skicka meddelande.");
    }
  }

  async function handleDelete(msgId) {
    try {
      await deleteMessage(msgId);
      setMessages((prev) => prev.filter((msg) => msg.id !== msgId));
    } catch (error) {
      console.error("Kunde inte radera meddelande:", error);
      setError("Kunde inte radera meddelande.");
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  function sanitize(str) {
    return DOMPurify.sanitize(str);
  }

  return (
    <div className="container">
      <aside>
        <button
          onClick={() => {
            sessionStorage.removeItem("csrfToken");
            sessionStorage.removeItem("jwtToken");
            navigate("/login");
          }}
        >
          Logga ut
        </button>
      </aside>
      <h1>Chat</h1>
      <div className="chat-list">
        {messages.length === 0 && <p>Inga meddelanden ännu.</p>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-item ${msg.isUser ? "me" : ""}`}
            style={{ position: "relative" }}
          >
            <div className="meta">
              <img
                src={msg.avatar}
                alt={`${msg.username}'s avatar`}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
              <span>{msg.username}</span>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: sanitize(msg.text) }}
              style={{ whiteSpace: "pre-wrap" }}
            />
            {msg.isUser && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(msg.id)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={handleSend}>
        <input
          placeholder="Skriv ett meddelande…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Skicka</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
