const API_URL = (import.meta.env.VITE_API_URL || "https://chatify-api.up.railway.app").replace(/\/+$/, "");


export async function fetchCsrfToken() {
  const res = await fetch(`${API_URL}/csrf`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  
  console.log("CSRF-respons:", res.status, data);
  if (!res.ok) {
    const msg = data?.message || data?.error || `Kunde inte hämta CSRF-token (status ${res.status})`;
    throw new Error(msg);
  }
  const csrf = data?.csrfToken;
  if (!csrf) throw new Error("Servern skickade ingen csrfToken");
  
 
  sessionStorage.setItem("csrfToken", csrf);
  return csrf;
}


export async function registerUser({ username, email, password, avatar }) {
  const token = await fetchCsrfToken();
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, avatar, _csrf: token, csrfToken: token }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Registrering misslyckades (status ${res.status})`);
  }
  
  
  sessionStorage.setItem("csrfToken", token);
  if (data?.token) {
    sessionStorage.setItem("jwtToken", data.token);
  }
  return data;
}


export async function loginUser({ username, password }) {
  const token = await fetchCsrfToken();
  const res = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, _csrf: token, csrfToken: token }),
  });
  const data = await res.json().catch(() => ({}));

  console.log("LOGIN-respons:", res.status, data); // ← viktigt för felsökning

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Inloggning misslyckades (status ${res.status})`);
  }

  // Lagra CSRF-token och JWT i sessionStorage
  sessionStorage.setItem("csrfToken", token);
  if (data?.token) {
    sessionStorage.setItem("jwtToken", data.token);
  }
  return data; 
}


export function logoutUser() {

  sessionStorage.removeItem("csrfToken");
  sessionStorage.removeItem("jwtToken");


  localStorage.removeItem("csrfToken");
  localStorage.removeItem("jwtToken");

  console.log("Användaren har loggats ut och alla tokens har tagits bort.");
}
