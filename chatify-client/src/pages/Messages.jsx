// src/pages/Messages.jsx
import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { getMessages, createMessage, deleteMessage } from "../utils/Messages.js";

// Hjälp: läs inlagd användare från localStorage (så vi kan avgöra “mina” meddelanden)
function useMe() {
  return useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);
}

export default function Messages() {
  const me = useMe();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // Ladda alla meddelanden
  async function load() {
    setError("");
    try {
      const data = await getMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Kunde inte hämta meddelanden.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Skicka nytt meddelande
  async function handleSend(e) {
    e.preventDefault();
    setError("");
    const trimmed = String(text || "").trim();
    if (!trimmed) return;

    try {
      await createMessage({ text: trimmed });
      setText("");
      await load();
    } catch (e) {
      setError(e?.message || "Kunde inte skicka meddelande.");
    }
  }

  // Radera eget meddelande
  async function handleDelete(msg) {
    const id = msg.id || msg._id || msg.msgId;
    if (!id) {
      alert("Hittade inget id för meddelandet.");
      return;
    }
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => (m.id || m._id || m.msgId) !== id));
    } catch (e) {
      alert(e?.message || "Kunde inte radera meddelande.");
    }
  }

  // Äger jag detta meddelande?
  function isMine(msg) {
    const msgUserId = msg.userId || msg.user?.id || msg.user?._id;
    const msgUsername = msg.username || msg.user?.username;
    return (
      (me?.id && msgUserId && String(msgUserId) === String(me.id)) ||
      (me?.username && msgUsername && msgUsername === me.username)
    );
  }

  return (
    <div className="container">
      <h1>Chat</h1>

      {error && <p className="error">{error}</p>}

      <div className="messages-list">
        {messages.length === 0 && <p>Inga meddelanden ännu.</p>}

        {messages.map((msg) => {
          const mine = isMine(msg);
          const key = msg.id || msg._id || msg.msgId || `${msg.username}-${Math.random()}`;

          // Säker visning av text med DOMPurify
          const safeHtml = DOMPurify.sanitize(String(msg.text || msg.content || ""), {
            ALLOWED_TAGS: [], // Inga HTML-taggar tillåtna (ren text)
            ALLOWED_ATTR: [],
          });

          return (
            <div key={key} className={`message ${mine ? "isMine" : "notMine"}`}>
              {/* Visa text säkert */}
              <div
                dangerouslySetInnerHTML={{ __html: safeHtml }}
                style={{ whiteSpace: "pre-wrap" }}
              />
              {/* Radera-knapp endast för mina meddelanden */}
              {mine && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(msg)}
                  title="Radera meddelande"
                >
                  🗑
                </button>
              )}
            </div>
          );
        })}
      </div>

      <form className="message-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Skriv ett meddelande…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Skicka</button>
      </form>
    </div>
  );
}
