const API_URL = import.meta.env.VITE_API_URL || "https://chatify-api.up.railway.app";

// HANTERAR FEL VID FETCH OCH LOGGAR FELMEDDELANDE I CONSOLE
async function handleError(res, defaultMessage) {
  let errMessage = `${defaultMessage} (Status ${res.status})`;
  try {
    const errData = await res.json();
    if (errData?.message) {
      errMessage += ` Server says: ${errData.message}`;
    }
  } catch {
    errMessage = defaultMessage;
  }
  console.error(`${errMessage}`, res.statusText);
  throw new Error(errMessage);
}

// HANTERAR LYCKAD FETCH OCH LOGGAR MEDDELANDE I CONSOLE
async function handleSuccess(res, successMessage) {
  console.log(`${successMessage} (Status ${res.status} ${res.statusText})`);
  return await res.json();
}

// GENERAR CSRF-TOKEN OCH LAGRAR I sessionStorage
export async function generateCsrf() {
  const res = await fetch(`${API_URL}/csrf`, {
    method: "PATCH",
    credentials: "include",
  });
  if (res.ok) {
    const data = await handleSuccess(res, "CSRF token fetched successfully");
    if (data?.csrfToken) {
      sessionStorage.setItem("csrfToken", data.csrfToken);
      return data.csrfToken;
    } else {
      console.log("No CSRF token received in response.");
      return null;
    }
  }
  await handleError(res, "Security check failed. Please try again or refresh the page.");
}

// REGISTRERAR ANVÄNDARE
export async function registerUser({ username, password, email, avatar }) {
  const csrfToken = sessionStorage.getItem("csrfToken") || (await generateCsrf());
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, email, avatar, csrfToken }),
  });
  if (res.ok) {
    const data = await handleSuccess(res, "Registration successful, redirecting to login...");
    return data;
  }
  await handleError(res, "Registration failed. Please check your input.");
}

// LOGGAR IN ANVÄNDARE
export async function loginUser({ username, password }) {
  const csrfToken = sessionStorage.getItem("csrfToken") || (await generateCsrf());
  const res = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password, csrfToken }),
  });
  if (res.ok) {
    const data = await handleSuccess(res, "Login successful, redirecting to chat...");
    if (data?.token) {
      sessionStorage.setItem("jwtToken", data.token);
      return data.token;
    } else {
      console.warn("No JWT-token received in login response.");
      return null;
    }
  }
  await handleError(res, "Login failed. Please check your username and password.");
}

// Hämta meddelanden
export async function getMessages() {
  const jwtToken = sessionStorage.getItem("jwtToken");
  if (!jwtToken) throw new Error("Ingen JWT-token hittades.");

  const res = await fetch(`${API_URL}/messages`, {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `Bearer ${jwtToken}` },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Kunde inte hämta meddelanden." }));
    throw new Error(error.message || "Kunde inte hämta meddelanden.");
  }

  return res.json();
}

// Skapa meddelande
export async function createMessage({ text }) {
  const jwtToken = sessionStorage.getItem("jwtToken");
  if (!jwtToken) throw new Error("Ingen JWT-token hittades.");

  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Kunde inte skicka meddelande." }));
    throw new Error(error.message || "Kunde inte skicka meddelande.");
  }

  return res.json();
}

// DELETE
export async function deleteMessage(id) {
  const jwtToken = sessionStorage.getItem("jwtToken");
  if (!jwtToken) throw new Error("Ingen JWT-token hittades.");

  const res = await fetch(`${API_URL}/messages/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Kunde inte radera meddelande." }));
    throw new Error(error.message || "Kunde inte radera meddelande.");
  }

  return res.json();
}

// LOGGAR UT ANVÄNDARE
export function logoutUser() {
  try {
    // Ta bort CSRF-token och JWT-token från sessionStorage
    sessionStorage.removeItem("csrfToken");
    sessionStorage.removeItem("jwtToken");

    // Ta bort CSRF-token och JWT-token från localStorage (om de finns)
    localStorage.removeItem("csrfToken");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");

    console.log("Logout successful. All tokens and user data removed.");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}