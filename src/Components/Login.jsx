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

const API_URL =
  "https://api.elonixx.com";

const Login = () => {
  const navigate = useNavigate();

  const [
    activeForm,
    setActiveForm,
  ] = useState("login");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loginData,
    setLoginData,
  ] = useState({
    email: "",
    password: "",
  });

  const [
    registerData,
    setRegisterData,
  ] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  /* =====================================================
     LOGIN INPUT
  ===================================================== */

  const handleLoginChange = (e) => {
    setLoginData(
      (previous) => ({
        ...previous,
        [e.target.name]:
          e.target.value,
      })
    );
  };

  /* =====================================================
     REGISTER INPUT
  ===================================================== */

  const handleRegisterChange = (
    e
  ) => {
    setRegisterData(
      (previous) => ({
        ...previous,
        [e.target.name]:
          e.target.value,
      })
    );
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    const email =
      loginData.email
        .trim()
        .toLowerCase();

    const password =
      loginData.password;

    if (!email || !password) {
      alert(
        "Email and password are required."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const responseText =
        await response.text();

      let data = {};

      try {
        data =
          responseText
            ? JSON.parse(
                responseText
              )
            : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        console.error(
          "Login API error:",
          response.status,
          data
        );

        alert(
          data.message ||
            `Login failed. Server returned ${response.status}.`
        );

        return;
      }

      /* =================================================
         ADMIN LOGIN
      ================================================= */

      if (
        data.role ===
          "admin" &&
        data.token
      ) {
        /*
         * Clear normal user session.
         */

        localStorage.removeItem(
          "finwalletToken"
        );

        localStorage.removeItem(
          "finwalletCurrentUser"
        );

        /*
         * Save admin session.
         */

        localStorage.setItem(
          "elonixxAdminToken",
          data.token
        );

        localStorage.setItem(
          "elonixxAdminEmail",
          data.email ||
            email
        );

        /*
         * Verify that the token
         * was actually stored.
         */

        const savedAdminToken =
          localStorage.getItem(
            "elonixxAdminToken"
          );

        if (!savedAdminToken) {
          alert(
            "Admin login succeeded, but the admin session could not be saved."
          );

          return;
        }

        alert(
          data.message ||
            "Admin login successful!"
        );

        navigate("/admin", {
          replace: true,
        });

        return;
      }

      /* =================================================
         NORMAL USER LOGIN
      ================================================= */

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

      /*
       * Remove admin session.
       */

      localStorage.removeItem(
        "elonixxAdminToken"
      );

      localStorage.removeItem(
        "elonixxAdminEmail"
      );

      alert(
        data.message ||
          "Login successful!"
      );

      navigate("/dashboard", {
        replace: true,
      });
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

  const handleRegister =
    async (e) => {
      e.preventDefault();

      if (loading) return;

      const name =
        registerData.name.trim();

      const email =
        registerData.email
          .trim()
          .toLowerCase();

      const password =
        registerData.password;

      const confirmPassword =
        registerData.confirmPassword;

      if (
        !name ||
        !email ||
        !password
      ) {
        alert(
          "Name, email and password are required."
        );

        return;
      }

      if (name.length < 2) {
        alert(
          "Name must contain at least 2 characters."
        );

        return;
      }

      if (password.length < 6) {
        alert(
          "Password must contain at least 6 characters."
        );

        return;
      }

      if (
        password !==
        confirmPassword
      ) {
        alert(
          "Passwords do not match."
        );

        return;
      }

      setLoading(true);

      try {
        const response =
          await fetch(
            `${API_URL}/api/register`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name,
                email,
                password,
              }),
            }
          );

        const responseText =
          await response.text();

        let data = {};

        try {
          data =
            responseText
              ? JSON.parse(
                  responseText
                )
              : {};
        } catch {
          data = {};
        }

        if (!response.ok) {
          console.error(
            "Registration API error:",
            response.status,
            data
          );

          alert(
            data.message ||
              `Registration failed. Server returned ${response.status}.`
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

        localStorage.removeItem(
          "elonixxAdminToken"
        );

        localStorage.removeItem(
          "elonixxAdminEmail"
        );

        alert(
          data.message ||
            "Account created successfully!"
        );

        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirmPassword:
            "",
        });

        navigate("/dashboard", {
          replace: true,
        });
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
              {activeForm ===
              "login"
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
              {activeForm ===
              "login"
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
              LOGIN
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

                  {loading ? (
                    <>
                      <span className="button-spinner" />
                      <span>
                        Logging in...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Login
                      </span>

                      <FaArrowRight />
                    </>
                  )}

                </button>

              </form>

              <div className="divider">

                <span />

                <p>OR</p>

                <span />

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
              REGISTER
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

                  {loading ? (
                    <>
                      <span className="button-spinner" />
                      <span>
                        Creating Account...
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        Create Account
                      </span>

                      <FaArrowRight />
                    </>
                  )}

                </button>

              </form>

              <div className="divider">

                <span />

                <p>OR</p>

                <span />

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