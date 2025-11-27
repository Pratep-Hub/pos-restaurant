import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../pages/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Admin Login</h2>
          <p>Sign in to access your POS dashboard</p>
        </div>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              placeholder="you@example.com"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={onChange}
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* 👇 Added Signup Text */}
        <div className="signup-link">
          <p>
            New Admin?{" "}
            <Link to="/signup" className="signup-text">
              Create an account
            </Link>
          </p>
        </div>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} Restaurant POS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
