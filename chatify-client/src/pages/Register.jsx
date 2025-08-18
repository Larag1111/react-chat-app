import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  // Minneslappar för varje fält
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar]     = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      // 1) hämta CSRF (servern sätter cookie). viktigt: credentials: "include"
      const csrfRes = await fetch("https://chatify-api.up.railway.app/csrf", {
        method: "PATCH",
        credentials: "include",
      });
      if (!csrfRes.ok) {
        alert("Kunde inte hämta CSRF (" + csrfRes.status + ")");
        return;
      }
  
      // 2) skicka registrering (ingen egen CSRF-header; låt cookien göra jobbet)
      const regRes = await fetch("https://chatify-api.up.railway.app/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, avatar }),
      });
  
      // 3) hantera svar
      if (!regRes.ok) {
        const errBody = await regRes.json().catch(() => ({}));
        const msg = errBody.message || errBody.error || "Något gick fel vid registrering.";
        alert(`Registrering misslyckades.\nStatus: ${regRes.status}\nMeddelande: ${msg}`);
        return;
      }
  
      alert("Registrering lyckades! 🎉");
      navigate("/login");
    } catch (err) {
      console.error("REGISTER fetch error:", err);
      alert("Nätverksfel vid registrering. Kolla Console.");
    }
  }
  
  
  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "0 auto" }}>
      <h1>Registrera</h1>

      {/* Själva formuläret */}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Användarnamn
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="t.ex. lara123"
            required
          />
        </label>

        <label>
          E-post
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="t.ex. lara@example.com"
            required
          />
        </label>

        <label>
          Lösenord
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="minst 6 tecken"
            required
          />
        </label>

        <label>
          Avatar (valfri URL)
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="t.ex. https://i.pravatar.cc/200"
          />
        </label>

        <button type="submit">Registrera</button>
      </form>

      <p style={{ marginTop: 12 }}>
        Har du redan konto? <Link to="/login">Gå till Login</Link>
      </p>
    </div>
  );
}
