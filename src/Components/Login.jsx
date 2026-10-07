import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaWallet,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaGoogle,
  FaApple,
  FaFacebookF,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import "./Login.css";

const API_URL = "https://api.elonixx.com";

const Login = () => {
  const navigate = useNavigate();

  const [activeForm, setActiveForm] =
    useState("login");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loginData, setLoginData] =
    useState({
      email: "",
      password: "",
    });

  const [registerData, setRegisterData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [loading, setLoading] =
    useState(false);

  /* =====================================================
     LOGIN INPUT
  ===================================================== */

  const handleLoginChange = (e) => {
    setLoginData((previous) => ({
      ...previous,
      [e.target.name]:
        e.target.value,
    }));
  };

  /* =====================================================
     REGISTER INPUT
  ===================================================== */

  const handleRegisterChange = (e) => {
    setRegisterData((previous) => ({
      ...previous,
      [e.target.name]:
        e.target.value,
    }));
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email:
              loginData.email.trim(),

            password:
              loginData.password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Invalid email or password."
        );

        return;
      }

      if (data.user) {
        localStorage.setItem(
          "finwalletCurrentUser",
          JSON.stringify(
            data.user
          )
        );
      }

      if (data.token) {
        localStorage.setItem(
          "finwalletToken",
          data.token
        );
      }

      alert(
        data.message ||
          "Login successful!"
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "Unable to connect to the server. Please check that the backend is online."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      registerData.password !==
      registerData.confirmPassword
    ) {
      alert(
        "Passwords do not match."
      );

      return;
    }

    if (
      registerData.password.length <
      6
    ) {
      alert(
        "Password must contain at least 6 characters."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name:
              registerData.name.trim(),

            email:
              registerData.email
                .trim()
                .toLowerCase(),

            password:
              registerData.password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to create account."
        );

        return;
      }

      if (data.user) {
        localStorage.setItem(
          "finwalletCurrentUser",
          JSON.stringify(
            data.user
          )
        );
      }

      if (data.token) {
        localStorage.setItem(
          "finwalletToken",
          data.token
        );
      }

      alert(
        data.message ||
          "Account created successfully!"
      );

      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      /*
       * Since registration already returns
       * a JWT, send the user directly
       * to the dashboard.
       */

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      alert(
        "Unable to connect to the server. Please check that the backend is online."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="love">
      <div className="finwallet-right">

        <div className="auth-container">

          {/* LOGO */}

          <div className="mobile-brand">

            <div className="mobile-brand-icon">
              <FaWallet />
            </div>

            <div>
              <h2>
                ElonixxWallet
              </h2>

              <p>
                Secure • Simple • Reliable
              </p>
            </div>

          </div>

          {/* ACCOUNT SWITCH */}

          <div className="account-switch">

            <span>
              {activeForm === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>

            <button
              type="button"
              onClick={() =>
                setActiveForm(
                  activeForm ===
                    "login"
                    ? "register"
                    : "login"
                )
              }
            >
              {activeForm === "login"
                ? "Create one"
                : "Login"}

              <FaArrowRight />
            </button>

          </div>

          {/* TABS */}

          <div className="tabs">

            <button
              type="button"
              className={
                activeForm ===
                "login"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setActiveForm(
                  "login"
                )
              }
            >
              Login
            </button>

            <button
              type="button"
              className={
                activeForm ===
                "register"
                  ? "tab active"
                  : "tab"
              }
              onClick={() =>
                setActiveForm(
                  "register"
                )
              }
            >
              Register
            </button>

          </div>

          {/* =================================================
              LOGIN FORM
          ================================================= */}

          {activeForm ===
            "login" && (
            <div className="form-box">

              <h2>
                Welcome Back! 👋
              </h2>

              <p className="description">
                Login to your
                ElonixxWallet account
                and continue managing
                your money with ease.
              </p>

              <form
                onSubmit={
                  handleLogin
                }
              >

                <div className="input-box">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={
                      loginData.email
                    }
                    onChange={
                      handleLoginChange
                    }
                    required
                  />

                </div>

                <div className="input-box">

                  <FaLock />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Password"
                    value={
                      loginData.password
                    }
                    onChange={
                      handleLoginChange
                    }
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

                <div className="form-options">

                  <label>
                    <input
                      type="checkbox"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                  >
                    Forgot password?
                  </button>

                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading
                    ? "Logging in..."
                    : "Login"}

                  {!loading && (
                    <FaArrowRight />
                  )}
                </button>

              </form>

              <div className="divider">

                <span></span>

                <p>OR</p>

                <span></span>

              </div>

              <div className="social-login">

                <button type="button">
                  <FaGoogle />
                  Google
                </button>

                <button type="button">
                  <FaApple />
                  Apple
                </button>

                <button type="button">
                  <FaFacebookF />
                  Facebook
                </button>

              </div>

              <p className="bottom-text">

                New to ElonixxWallet?

                <button
                  type="button"
                  onClick={() =>
                    setActiveForm(
                      "register"
                    )
                  }
                >
                  Create an account
                </button>

              </p>

            </div>
          )}

          {/* =================================================
              REGISTER FORM
          ================================================= */}

          {activeForm ===
            "register" && (
            <div className="form-box">

              <h2>
                Create Your Account 🚀
              </h2>

              <p className="description">
                Join ElonixxWallet and
                take control of your
                money with ease.
              </p>

              <form
                onSubmit={
                  handleRegister
                }
              >

                <div className="input-box">

                  <FaUser />

                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={
                      registerData.name
                    }
                    onChange={
                      handleRegisterChange
                    }
                    required
                  />

                </div>

                <div className="input-box">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={
                      registerData.email
                    }
                    onChange={
                      handleRegisterChange
                    }
                    required
                  />

                </div>

                <div className="input-box">

                  <FaLock />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create password"
                    value={
                      registerData.password
                    }
                    onChange={
                      handleRegisterChange
                    }
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

                <div className="input-box">

                  <FaLock />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={
                      registerData.confirmPassword
                    }
                    onChange={
                      handleRegisterChange
                    }
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>

                <label className="terms">

                  <input
                    type="checkbox"
                    required
                  />

                  <span>
                    I agree to the
                    Terms & Conditions
                    and Privacy Policy.
                  </span>

                </label>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}

                  {!loading && (
                    <FaArrowRight />
                  )}
                </button>

              </form>

              <div className="divider">

                <span></span>

                <p>OR</p>

                <span></span>

              </div>

              <div className="social-login">

                <button type="button">
                  <FaGoogle />
                  Google
                </button>

                <button type="button">
                  <FaApple />
                  Apple
                </button>

                <button type="button">
                  <FaFacebookF />
                  Facebook
                </button>

              </div>

              <p className="bottom-text">

                Already have an account?

                <button
                  type="button"
                  onClick={() =>
                    setActiveForm(
                      "login"
                    )
                  }
                >
                  Login
                </button>

              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Login;