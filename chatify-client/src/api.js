import axios from "axios";

export const api = axios.create({
    baseURL: "https://chatify-api.up.railway.app",
    withCredentials: true,
});