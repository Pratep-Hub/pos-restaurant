import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- AUTH ROUTES ---------- */}

        {/* Signup (only allowed if NOT logged in) */}
        <Route
          path="/signup"
          element={
            !user ? <Signup /> : <Navigate to="/" />
          }
        />

        {/* Login (only allowed if NOT logged in) */}
        <Route
          path="/login"
          element={
            !user ? <Login /> : <Navigate to="/" />
          }
        />

        {/* ---------- PROTECTED ROUTES ---------- */}

        {/* Dashboard */}
        <Route
          path="/"
          element={
            user ? <Dashboard /> : <Navigate to="/login" />
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            user ? <Reports /> : <Navigate to="/login" />
          }
        />

        {/* ---------- UNKNOWN ROUTES ---------- */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
