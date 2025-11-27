import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../components/Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">

      {/* LEFT SECTION */}
      <div className="nav-left">
        <div className="nav-logo">TD</div>
        <span className="nav-title">Turkish Doner</span>
      </div>

      {/* RIGHT SECTION */}
      <div className="nav-right">

        {/* Reports Link */}
        <Link to="/reports" className="nav-report-btn">
          Reports
        </Link>

        {/* User Icon */}
        <div className="nav-user-icon">
          <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
        </div>

        {/* Username */}
        <span className="nav-username">{user?.name}</span>

        {/* Logout Button */}
        <button onClick={logout} className="nav-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
