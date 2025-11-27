import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../pages/Signup.css"; // 👈 import CSS

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { name, email, password });
      setMsg("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg("Signup failed");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">Admin Signup</h2>
        <p className="signup-message">{msg}</p>

        <form onSubmit={handleSubmit} className="signup-form">

          <div className="signup-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="signup-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="signup-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        {/* 👇 ADD LOGIN LINK */}
        <p className="signup-login-link">
          Already have an account?{" "}
          <Link to="/login" className="login-text">Login</Link>
        </p>
      </div>
    </div>
  );
}
