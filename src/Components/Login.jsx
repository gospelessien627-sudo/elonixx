
import React, { useState } from "react";
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

const Login = () => {
  const [activeForm, setActiveForm] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  

  const handleLogin = (e) => {
  e.preventDefault();

  // Get registered users
  const existingUsers =
    JSON.parse(localStorage.getItem("finwalletUsers")) || [];

  // Find user
  const user = existingUsers.find(
    (user) =>
      user.email === loginData.email &&
      user.password === loginData.password
  );

  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  // Save logged-in user
  localStorage.setItem(
    "finwalletCurrentUser",
    JSON.stringify(user)
  );

  alert(`Welcome back, ${user.name}!`);

  // Navigate to dashboard if using React Router
};





  const handleRegister = (e) => {
  e.preventDefault();

  if (registerData.password !== registerData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  // Get existing registered users
  const existingUsers =
    JSON.parse(localStorage.getItem("finwalletUsers")) || [];

  // Check if email already exists
  const userExists = existingUsers.some(
    (user) => user.email === registerData.email
  );

  if (userExists) {
    alert("An account with this email already exists.");
    return;
  }

  // Create new user
  const newUser = {
    name: registerData.name,
    email: registerData.email,
    password: registerData.password,
  };

  // Save user
  existingUsers.push(newUser);

  localStorage.setItem(
    "finwalletUsers",
    JSON.stringify(existingUsers)
  );

  // Save currently logged-in user
  localStorage.setItem(
    "finwalletCurrentUser",
    JSON.stringify(newUser)
  );

  alert(`Account created successfully, ${registerData.name}!`);

  // You can navigate to dashboard here if you use React Router
};

  return (
    <div className="love">

      {/* ================= FORM SECTION ================= */}
      <div className="finwallet-right">

        <div className="auth-container">

          {/* LOGO */}
          <div className="mobile-brand">

            <div className="mobile-brand-icon">
              <FaWallet />
            </div>

            <div>
              <h2>FinWallet</h2>
              <p>Secure • Simple • Reliable</p>
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
                  activeForm === "login"
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
                activeForm === "login"
                  ? "tab active"
                  : "tab"
              }
              onClick={() => setActiveForm("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={
                activeForm === "register"
                  ? "tab active"
                  : "tab"
              }
              onClick={() => setActiveForm("register")}
            >
              Register
            </button>

          </div>


          {/* ================= LOGIN ================= */}
          {activeForm === "login" && (

            <div className="form-box">

              <h2>Welcome Back! 👋</h2>

              <p className="description">
                Login to your FinWallet account and
                continue managing your money with ease.
              </p>

              <form onSubmit={handleLogin}>

                {/* EMAIL */}
                <div className="input-box">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />

                </div>


                {/* PASSWORD */}
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
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>


                {/* OPTIONS */}
                <div className="form-options">

                  <label>
                    <input type="checkbox" />
                    Remember me
                  </label>

                  <button type="button">
                    Forgot password?
                  </button>

                </div>


                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="auth-button"
                >
                  Login
                  <FaArrowRight />
                </button>

              </form>


              {/* DIVIDER */}
              <div className="divider">

                <span></span>

                <p>OR</p>

                <span></span>

              </div>


              {/* SOCIAL LOGIN */}
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


              {/* BOTTOM */}
              <p className="bottom-text">

                New to FinWallet?

                <button
                  type="button"
                  onClick={() =>
                    setActiveForm("register")
                  }
                >
                  Create an account
                </button>

              </p>

            </div>
          )}


          {/* ================= REGISTER ================= */}
          {activeForm === "register" && (

            <div className="form-box">

              <h2>Create Your Account 🚀</h2>

              <p className="description">
                Join FinWallet and take control of
                your money with ease.
              </p>

              <form onSubmit={handleRegister}>

                {/* NAME */}
                <div className="input-box">

                  <FaUser />

                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                  />

                </div>


                {/* EMAIL */}
                <div className="input-box">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                  />

                </div>


                {/* PASSWORD */}
                                    <div className="input-box">
                    <FaLock className="input-icon" />

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                    />

                    <button
                        type="button"
                        className="eye-button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    </div>


                {/* CONFIRM PASSWORD */}
                            <div className="input-box">
            <FaLock className="input-icon" />

            <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
            />

            <button
                type="button"
                className="eye-button"
                onClick={() =>
                setShowConfirmPassword((prev) => !prev)
                }
                aria-label={
                showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
            >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            </div>


                {/* TERMS */}
                <label className="terms">

                  <input
                    type="checkbox"
                    required
                  />

                  <span>
                    I agree to the Terms & Conditions
                    and Privacy Policy.
                  </span>

                </label>


                {/* REGISTER BUTTON */}
                <button
                  type="submit"
                  className="auth-button"
                >
                  Create Account
                  <FaArrowRight />
                </button>

              </form>


              {/* DIVIDER */}
              <div className="divider">

                <span></span>

                <p>OR</p>

                <span></span>

              </div>


              {/* SOCIAL LOGIN */}
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


              {/* BOTTOM */}
              <p className="bottom-text">

                Already have an account?

                <button
                  type="button"
                  onClick={() =>
                    setActiveForm("login")
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

