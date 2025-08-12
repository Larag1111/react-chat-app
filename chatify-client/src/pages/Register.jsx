import { useState } from "react";
import { api } from "../api";

export default function Register() {
  // Minneslappar för varje fält
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState(""); // <-- viktig rad vi saknade
  const [avatar, setAvatar]     = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      // 1) Hämta CSRF-nyckeln (måste göras före register)
      await api.patch("/csrf");
  
      // 2) Skicka registrering till backend
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
        avatar, // kan vara tom sträng, det går bra
      });
  
      // 3) Lyckades: visa bekräftelse (vi gör redirect i nästa steg)
      alert("Registrering lyckades! 🎉");
      console.log("REGISTER OK:", res.data);
    } catch (err) {
      // 4) Misslyckades: visa fel från API:t (t.ex. "Username or email already exists")
      const msg = err?.response?.data?.message || "Något gick fel vid registrering.";
      alert(msg);
      console.error("REGISTER ERROR:", err);
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
    </div>
  );
}
