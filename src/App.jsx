import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import Live from "./Components/Live";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/" element={<Login />} />
      </Routes>

      {/* Live chat floats on all pages */}
      <Live role="client" />
    </>
  );
};

export default App;