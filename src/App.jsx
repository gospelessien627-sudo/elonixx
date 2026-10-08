import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import Live from "./Components/Live";
import Admin from "./Components/Admin";

const App = () => {
  return (
    <>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

      </Routes>

      {/* Live Chat */}
      <Live role="client" />
    </>
  );
};

export default App;