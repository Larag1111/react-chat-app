// src/pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../services.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await loginUser({ username, password });
      alert("Inloggning lyckades!");
      navigate("/chat");
    } catch (error) {
      console.error("Fel vid inloggning:", error);
      alert(error.message || "Inloggning misslyckades.");
    }
  }

  return (
    <div className="container">
      <h1>Logga in</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Användarnamn</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label>Lösenord</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Logga in</button>
      </form>
      <button className="link" onClick={() => navigate("/register")}>
        Har du inget konto? Registrera dig här.
      </button>
    </div>
  );
}
