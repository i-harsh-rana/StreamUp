import React from "react";
import Header from './components/Header/Header'
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Pages/Home/Home";
import SignUp from "./components/Pages/SignUp";
import Login from "./components/Pages/Login";
import AllVideos from "./components/Pages/AllVideos";
import ChangePassword from "./components/Pages/ChangePassword";
import Profile from "./components/Pages/Profile";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/videos" element={<AllVideos />} />
        
      </Routes>
      </main>
      <Footer/>
      </div>
    </Router>
    
    
  )
}

export default App