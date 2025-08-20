import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Chat from "./pages/Chat.jsx";       // om din sida heter annorlunda, ändra importen
import Profile from "./pages/Profile.jsx"; // om du har profile
import SideNav from "./components/SideNav.jsx";

function isAuthed() {
  return Boolean(localStorage.getItem("token"));
}

function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

function RequireGuest({ children }) {
  return !isAuthed() ? children : <Navigate to="/chat" replace />;
}

export default function App() {
  return (
    <div>
      {/* Sidenav visas, men den döljer länkar beroende på inloggad/utloggad */}
      <SideNav />

      <Routes>
        {/* Rot: skicka rätt beroende på inloggad/utloggad */}
        <Route
          path="/"
          element={isAuthed() ? <Navigate to="/chat" replace /> : <Navigate to="/login" replace />}
        />

        {/* Gäst-sidor (bara när du INTE är inloggad) */}
        <Route
          path="/register"
          element={
            <RequireGuest>
              <Register />
            </RequireGuest>
          }
        />
        <Route
          path="/login"
          element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          }
        />

        {/* Skyddade sidor (bara när du är inloggad) */}
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
