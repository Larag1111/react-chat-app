// src/pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../utils/Auth";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // 1) Skicka login
      const data = await loginUser({ username, password });

      // 2) Hämta token
      const token = data?.token;
      if (!token) {
        alert("Servern skickade ingen token. Kolla konsolen.");
        console.log("Login data utan token:", data);
        return;
      }

      // 3) Decoda token → spara användare
      let decoded = {};
      try { decoded = jwtDecode(token); } catch { decoded = {}; }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        id: decoded.id,
        username: decoded.username || username,
        avatar: decoded.avatar,
        email: decoded.email,
      }));

      alert("Inloggning lyckades! ✅");

      // 4) Stabil redirect: full sidladdning så App.jsx läser token
      window.location.href = "/chat";
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      const msg = err?.message || "Fel vid inloggning.";
      setError(msg);
      alert(msg);
    }
  }

  return (
    <div className="container">
      <h1>Logga in</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Användarnamn</label>
          <input
            placeholder="t.ex. lara123"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Lösenord</label>
          <input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Logga in</button>
      </form>

      {error && <p className="error" style={{marginTop:8}}>{error}</p>}

      <p style={{ marginTop: 12 }}>
        Saknar du konto? <Link to="/register">Registrera här</Link>
      </p>
    </div>
  );
}
