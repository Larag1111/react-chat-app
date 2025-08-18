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
      // 1) Hämta CSRF
      await api.patch("/csrf");
  
      // 2) VISA alla cookies som finns just nu
      alert("Cookies just nu:\n" + document.cookie);
      console.log("COOKIES:", document.cookie);
  
      // 3) STOPPA HÄR (vi testar bara cookies nu)
      return;
    } catch (err) {
      console.error("CSRF ERROR:", err);
      alert("Kunde inte hämta CSRF. Kolla Console.");
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
