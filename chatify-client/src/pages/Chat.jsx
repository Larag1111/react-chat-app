// src/pages/Chat.jsx
import { useEffect, useMemo, useState } from "react";
import { getMessages, createMessage, deleteMessage } from "../utils/Messages";

export default function Chat(){
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState("");
  const [error, setError]       = useState("");

  const me = useMemo(()=>{
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  }, []);
  const token = localStorage.getItem("token");

  async function load(){
    if(!token) return;
    try{
      const data = await getMessages();
      setMessages(Array.isArray(data) ? data : []);
    }catch(e){
      setError(e?.message || "Kunde inte hämta meddelanden.");
    }
  }

  async function handleSend(e){
    e.preventDefault();
    setError("");
    try{
      await createMessage({ text });
      setText("");
      await load();
    }catch(e){
      setError(e?.message || "Kunde inte skicka.");
    }
  }

  function isMine(msg){
    // täck vanliga varianter från API:t
    const msgUserId   = msg.userId || msg.user?.id || msg.user?._id;
    const msgUsername = msg.username || msg.user?.username;

    return (
      (me?.id && msgUserId && String(msgUserId) === String(me.id)) ||
      (me?.username && msgUsername && msgUsername === me.username)
    );
  }

  async function handleDelete(msg){
    const msgId = msg.id || msg._id || msg.msgId; // robust id-fält
    console.log("DELETE try", { msgId, me, msg });

    if(!msgId){
      alert("Hittade inget id för meddelandet.");
      return;
    }
    if(!isMine(msg)){
      alert("Det där är inte ditt meddelande (enligt API).");
      return;
    }

    try{
      await deleteMessage(msgId);
      setMessages(prev => prev.filter(m => (m.id||m._id||m.msgId) !== msgId));
    }catch(e){
      console.error("DELETE error:", e);
      alert(e?.message || "Kunde inte radera.");
    }
  }

  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [token]);

  return (
    <div className="container">
      <h1>Chat</h1>
      {error && token && <p className="error">{error}</p>}

      <div className="chat-list">
        {messages.map(msg=>{
          const mine = isMine(msg);
          return (
            <div key={msg.id || msg._id || msg.msgId} className={`chat-item ${mine ? "me" : ""}`}>
              <div className="meta">
                {mine ? "Jag" : (msg.user?.username || msg.username || "Anonym")}
              </div>
              <div className="bubble">{String(msg.text || msg.content || "").slice(0,500)}</div>
              {mine && (
                <button className="link danger" onClick={()=>handleDelete(msg)}>
                  Radera
                </button>
              )}
            </div>
          );
        })}
      </div>

      <form className="chat-form" onSubmit={handleSend}>
        <input
          placeholder="Skriv ett meddelande…"
          value={text}
          onChange={e=>setText(e.target.value)}
        />
        <button type="submit">Skicka</button>
      </form>
    </div>
  );
}
