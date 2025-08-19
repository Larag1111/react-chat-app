import axios from "axios";

export const api = axios.create({
  baseURL: "/api",        // <-- använd Netlify-proxy
  withCredentials: true,  // skicka/ta emot cookies
});
