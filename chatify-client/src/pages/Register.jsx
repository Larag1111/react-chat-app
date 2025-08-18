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
  
    // 🔔 TEST: ser du den här? Då körs klicket.
    alert("Startar registrering…");
  
    try {
      console.log("[REGISTER] baseURL =", api.defaults.baseURL);
      console.log("[REGISTER] withCredentials =", api.defaults.withCredentials);
  
      // 1) CSRF (sätter cookie)
      console.log("[REGISTER] PATCH /csrf");
      await api.patch("/csrf");
  
      // 2) POST /auth/register (utan egna headers)
      console.log("[REGISTER] POST /auth/register", { username, email, password, avatar });
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
        avatar,
      });
  
      console.log("[REGISTER] RESPONSE", res.status, res.data);
      alert("Registrering lyckades! 🎉");
      navigate("/login");
    } catch (err) {
      // Visa MAX info för att vi ska se exakt vad som händer
      const status   = err?.response?.status;
      const data     = err?.response?.data;
      const message  = err?.message;
      const toString = String(err);
  
      console.error("[REGISTER] ERROR raw:", err);
      console.log("[REGISTER] ERROR status:", status);
      console.log("[REGISTER] ERROR data:", data);
      console.log("[REGISTER] ERROR message:", message);
      console.log("[REGISTER] ERROR string:", toString);
  
      alert(
        `Registrering misslyckades.\n` +
        `status: ${status ?? "—"}\n` +
        `message: ${message ?? "—"}\n` +
        `data: ${data ? JSON.stringify(data) : "—"}`
      );
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
