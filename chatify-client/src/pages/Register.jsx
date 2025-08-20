// src/pages/Register.jsx
import { useState } from "react";
import { registerUser } from "../utils/Auth";
import { Link } from "react-router-dom";

const avatars = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=John",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Jane",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Sam",
];

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar]     = useState(avatars[0]);
  const [error, setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await registerUser({ username, email, password, avatar });
      console.log("REGISTER OK:", data);
      alert("Registrering lyckades! Gå till Login.");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError(err.message || "Registrering misslyckades.");
    }
  }

  return (
    <div className="container">
      <h1>Registrera</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Användarnamn</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Lösenord</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>

        <div className="field">
          <label>Välj avatar</label>
          <div className="avatar-grid">
            {avatars.map((url)=>(
              <img
                key={url}
                src={url}
                alt="avatar"
                className={avatar===url ? "selected":""}
                onClick={()=>setAvatar(url)}
              />
            ))}
          </div>
        </div>

        <button type="submit">Registrera</button>
      </form>

      {error && <p className="error">{error}</p>}
      <p style={{marginTop:12}}>Har du konto? <Link to="/login">Logga in</Link></p>
    </div>
  );
}
