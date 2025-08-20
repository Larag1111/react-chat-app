const API_URL = (import.meta.env.VITE_API_URL || "https://chatify-api.up.railway.app").replace(/\/+$/, "");

// JWT header
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Hämta CSRF (PATCH /csrf)
async function fetchCsrf() {
  const res = await fetch(`${API_URL}/csrf`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || data?.error || `Kunde inte hämta CSRF (status ${res.status})`;
    throw new Error(msg);
  }
  if (!data?.csrfToken) throw new Error("Servern skickade ingen csrfToken");
  return data.csrfToken;
}

// READ
export async function getMessages() {
  const res = await fetch(`${API_URL}/messages`, {
    method: "GET",
    credentials: "include",
    headers: { ...getAuthHeaders() },
  });
  const data = await res.json().catch(() => ([]));
  if (!res.ok) {
    const msg = data?.message || data?.error || `Kunde inte hämta meddelanden (status ${res.status})`;
    throw new Error(msg);
  }
  return data;
}

// CREATE
export async function createMessage({ text }) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Inte inloggad.");
  const clean = String(text || "").trim();
  if (!clean) throw new Error('Invalid or missing "text" field');

  const csrf = await fetchCsrf();

  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ text: clean, _csrf: csrf, csrfToken: csrf }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || data?.error || `Kunde inte skapa meddelande (status ${res.status})`;
    throw new Error(msg);
  }
  return data;
}

// DELETE
export async function deleteMessage(id) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Inte inloggad.");

  const csrf = await fetchCsrf();

  const res = await fetch(`${API_URL}/messages/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ _csrf: csrf, csrfToken: csrf }),
  });

  // vissa DELETE-svar har ingen body
  if (!res.ok) {
    let data = {};
    try { data = await res.json(); } catch {}
    const msg = data?.message || data?.error || `Kunde inte radera (status ${res.status})`;
    throw new Error(msg);
  }
}
