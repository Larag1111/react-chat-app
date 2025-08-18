import { useState } from "react";
import { api } from "../api";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  // små minneslappar för inmatning
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // stanna på sidan
  
    try {
      // 1) hämta säkerhetsnyckeln (CSRF)
      await api.patch("/csrf");
  
      // 2) skicka inloggningen till servern
      const res = await api.post("/auth/token", {
        username,
        password,
      });
  
      // 3) plocka ut token ur svaret
      const token = res?.data?.token;
      if (!token) {
        alert("Servern skickade ingen token. Kolla Console.");
        console.log("LOGIN response (utan token):", res.data);
        return;
      }
  
      // 4) läs token (öppna “brevet”) för att få ut id/username/avatar
      const decoded = jwtDecode(token); // kräver: import { jwtDecode } from "jwt-decode";
  
      // 5) spara token + användare i localStorage (så vi är inloggade efter reload)
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token,
          user: {
            id: decoded.id,
            username: decoded.username,
            avatar: decoded.avatar, // kan vara undefined om ingen avatar sattes
          },
        })
      );
  
      alert("Inloggning sparad! ✅ (token + användare i localStorage)");
    } catch (err) {
      const msg = err?.response?.data?.message || "Fel vid inloggning.";
      alert(msg); // t.ex. "Invalid credentials"
      console.error("LOGIN ERROR:", err);
    }
  }
  

  return (
    <form
      onSubmit={handleSubmit}
      style={{ padding: 16, maxWidth: 420, margin: "0 auto" }}
    >
      <h1>Login</h1>

      <label>
        Användarnamn
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>

      <label>
        Lösenord
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <button type="submit">Logga in</button>
    </form>
  );
}
