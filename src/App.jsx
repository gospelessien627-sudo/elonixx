import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";

const App = () => {
  return (
    <Routes>
      <Route
        path="/home"
        element={<Home />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/"
        element={<Login />}
      />
    </Routes>
  );
};

export default App;