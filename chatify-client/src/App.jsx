import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <Routes>
      {/* Går man till roten "/" → skicka vidare till "/register" */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* Våra två “rum” (sidor) */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
