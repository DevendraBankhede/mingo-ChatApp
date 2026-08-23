import React from "react";
import SiteHeader from "./components/SiteHeader";
import Home from "./pages/Home";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import ContactUs from "./pages/Contactus";
import UserDashboard from "./pages/UserDashboard";

const App = () => {
  const path = useLocation().pathname;
  console.log(path);

  return (
    <>
      <Toaster />
      {/* {path !== "/chat" && <SiteHeader />} */}
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </>
  );
};

export default App;