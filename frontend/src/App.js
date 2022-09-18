import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function BasicExample() {
  return (
    <BrowserRouter>
      <ul className="main-nav">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  );
}


function Home() {
  return (
    <div>
      <h2>Home Page : Ongoing</h2>
    </div>
  );
}


