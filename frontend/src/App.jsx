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
import Video from "./components/Pages/Video";
import UploadVideo from "./components/Pages/UploadVideo";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import VideoManage from "./components/Pages/VideoManage";

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
        <Route path="/profile/:username" element={<Profile />} />

        <Route path="/videos" element={<AllVideos />} />
        <Route path="/video/:videoId" element={<Video/>} />
        <Route path="/user-dashboard" element={<Dashboard/>}/>

        <Route path="/newvideo" element={<UploadVideo/>}/>
        <Route path='/video-manage/:videoId' element={<VideoManage/>}/>
        
      </Routes>
      </main>
      <Footer/>
      </div>
    </Router>
    
    
  )
}

export default App