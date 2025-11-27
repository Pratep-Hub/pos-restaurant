import { createContext, useContext, useState, useEffect } from "react";
import { setAuthToken } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("pos_auth");
    if (saved) {
      const { user, token } = JSON.parse(saved);
      setUser(user);
      setToken(token);
      setAuthToken(token);
    }
  }, []);

  const login = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    setAuthToken(payload.token);
    localStorage.setItem("pos_auth", JSON.stringify(payload));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem("pos_auth");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
