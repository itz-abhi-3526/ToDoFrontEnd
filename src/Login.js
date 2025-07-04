import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

export default function Login({ setToken }) {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");

    const response = await fetch(
      "https://todobackend-6cpm.onrender.com/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    setAuthLoading(false);

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      setAuthError(data.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card glass">
        <h2 className="login-title">Login</h2>

        {authError && <div className="error-message">{authError}</div>}

        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            login(username, password);
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn purple">
            {authLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <span>Don't have an account? </span>
          <Link to="/signup" className="signup-link">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
