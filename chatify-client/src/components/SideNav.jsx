import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services.js";

export default function SideNav() {
  const navigate = useNavigate();

  // Kontrollera om användaren är inloggad
  const isLoggedIn = !!sessionStorage.getItem("jwtToken");
  const user = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  function handleLogout() {
    logoutUser(); // Rensa tokens
    navigate("/login"); // Navigera till login-sidan
  }

  return (
    <aside
      style={{
        position: "fixed",
        left: 16,
        top: 16,
        background: "#fff",
        border: "1px solid rgba(0,0,0,.06)",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 10px 25px rgba(31,41,55,.08)",
        zIndex: 50,
      }}
    >
      <nav>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
          {!isLoggedIn && (
            <>
              <li>
                <Link to="/login">Logga in</Link>
              </li>
              <li>
                <Link to="/register">Registrera</Link>
              </li>
            </>
          )}

          {isLoggedIn && (
            <>
              <li>
                <Link to="/chat">Chat</Link>
              </li>
              <li>
                <Link to="/profile">Profil</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logga ut</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
}
