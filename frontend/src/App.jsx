import React from "react";
import Header from './components/Header/Header'
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Home />} />
        
      </Routes>
      <Footer/>
    </Router>
    
    
  )
}

export default App