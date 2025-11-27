import axios from "axios";

// Local backend during development
const API_BASE = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
