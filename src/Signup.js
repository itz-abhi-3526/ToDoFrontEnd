import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";
function Signup() {
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async (username, password) => {
    setAuthLoading(true);
    setAuthError("");
    setSuccess(false);

    const response = await fetch(
      "https://todobackend-6cpm.onrender.com/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await response.json();
    setAuthLoading(false);

    if (data.message === "User registered") {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setAuthError(data.message || "Signup failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card glass">
        <h2 className="login-title">Sign Up</h2>

        {authError && <div className="error-message">{authError}</div>}

        {success && (
          <div className="success-message">
            Registration successful! Redirecting...
          </div>
        )}

        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            signup(username, password);
          }}
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className="btn purple" disabled={authLoading}>
            {authLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="login-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
