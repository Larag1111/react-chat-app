// src/pages/Login.jsx
import { useState } from "react";
import { loginUser } from "../services.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      console.log("Skickar följande data till servern:", {
        username: username.trim(),
        password: password.trim(),
      });

      await loginUser({ username, password });
      alert("Inloggning lyckades!");
      navigate("/chat");
    } catch (err) {
      console.error("Fel vid inloggning:", err);
      setError(err.message || "Inloggning misslyckades.");
    }
  }

  return (
    <div className="container">
      <h1 className="auth-title">Logga in</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Användarnamn</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="actions">
          <button
            type="button"
            className="btn btn-register"
            onClick={() => navigate("/register")}
          >
            Registrera dig
          </button>

          <button type="submit" className="btn btn-login">
            Logga in
          </button>
        </div>
      </form>
    </div>
  );
}
