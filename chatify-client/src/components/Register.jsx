import { useState } from "react";
import { registerUser } from "../services.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  const avatars = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
    "https://i.pravatar.cc/150?img=5",
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const userData = await registerUser({ username, email, password, avatar });
      sessionStorage.setItem("avatar", avatar); // Lagra avatarens URL i sessionStorage
      alert("Registrering lyckades! Du kan nu logga in.");
      navigate("/login");
    } catch (error) {
      console.error("Fel vid registrering:", error);
      alert(error.message || "Registrering misslyckades.");
    }
  }

  return (
    <div className="container">
      <h1>Registrera</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Användarnamn</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Lösenord</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="field">
          <label>Välj en avatar</label>
          <div className="avatar-grid">
            {avatars.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Avatar ${index + 1}`}
                className={avatar === url ? "selected" : ""}
                onClick={() => setAvatar(url)}
                style={{
                  cursor: "pointer",
                  border: avatar === url ? "2px solid #4f5bd5" : "2px solid transparent",
                  borderRadius: "50%",
                  width: "64px",
                  height: "64px",
                }}
              />
            ))}
          </div>
        </div>
        <button type="submit">Registrera</button>
      </form>
      <button className="link" onClick={() => navigate("/login")}>
        Har du redan ett konto? Logga in här.
      </button>
    </div>
  );
}
