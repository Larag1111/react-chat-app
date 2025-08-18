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
      // 1) Hämta CSRF-token från servern
      const { data } = await api.patch("/csrf");
      const csrf = data?.csrfToken; // engångsnyckeln
    


      // 2) Skicka registreringen + CSRF i headers
      const res = await api.post(
        "/auth/register",
        { username, email, password, avatar },
        {
          headers: {
            "X-CSRF-Token": csrf,
            "X-XSRF-TOKEN": csrf,
          },
        }
      );

      alert("Registrering lyckades! 🎉");
      console.log("REGISTER OK:", res.data);
      navigate("/login"); // gå till Login efter lyckad registrering
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      console.error("REGISTER ERROR status:", status);
      console.error("REGISTER ERROR data:", data);

      const msg =
        (data && (data.message || data.error || JSON.stringify(data))) ||
        "Något gick fel vid registrering.";

      alert(`Registrering misslyckades.\nStatus: ${status ?? "okänd"}\nMeddelande: ${msg}`);
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
