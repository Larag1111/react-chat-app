import { Link, useNavigate } from "react-router-dom";

export default function SideNav() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  function handleLogout() {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      // full reload så inget försöker hämta /messages efter logout
      window.location.href = "/login";
    }
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
          {!token && (
            <>
              <li>
                <Link to="/login">Logga in</Link>
              </li>
              <li>
                <Link to="/register">Registrera</Link>
              </li>
            </>
          )}

          {token && (
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
