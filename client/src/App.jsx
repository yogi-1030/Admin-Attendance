import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Dashboard from "./pages/Dashboard";
import "./App.css";

export default function App(){
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="logo">
          <span className="logo-dot"></span>
          Attendance Tracker
        </div>
        <div className="nav-links">
          <NavLink to="/" end>Members</NavLink>
          <NavLink to="/attendance">Attendance</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <a href="#" className="btn btn-blue click-anim">Mark Today</a>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Members/>} />
          <Route path="/attendance" element={<Attendance/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
