import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://api.elonixx.com";

export default function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isRegister
        ? "/api/register"
        : "/api/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      if (data.role === "admin") {
        if (!data.token) {
          throw new Error("The server did not return an admin token.");
        }

        localStorage.removeItem("finwalletToken");
        localStorage.removeItem("finwalletCurrentUser");

        localStorage.setItem("elonixxAdminToken", data.token);
        localStorage.setItem(
          "elonixxAdminEmail",
          data.email || email.trim().toLowerCase()
        );

        navigate("/admin", { replace: true });
        return;
      }

      if (!data.token || !data.user) {
        throw new Error("The server did not return your account session.");
      }

      localStorage.removeItem("elonixxAdminToken");
      localStorage.removeItem("elonixxAdminEmail");

      localStorage.setItem("finwalletToken", data.token);
      localStorage.setItem(
        "finwalletCurrentUser",
        JSON.stringify(data.user)
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>ElonixxWallet</h1>
        <h2>{isRegister ? "Create account" : "Sign in"}</h2>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        {isRegister && (
          <>
            <label htmlFor="auth-name">Full name</label>
            <input
              id="auth-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </>
        )}

        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={isRegister ? "new-password" : "current-password"}
          minLength={isRegister ? 6 : undefined}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isRegister
            ? "Create account"
            : "Login"}
        </button>

        <p>
          {isRegister ? "Already have an account?" : "New to ElonixxWallet?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister((value) => !value);
              setError("");
            }}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>

        <Link to="/home">Back to home</Link>
      </form>
    </main>
  );
}