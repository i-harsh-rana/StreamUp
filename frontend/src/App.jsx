import React from "react";
import Header from './components/Header/Header'
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Pages/Home/Home";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
      <Routes>
        {/* General Routes */}
        <Route path="/" element={<Home />} />
        
      </Routes>
      </main>
      <Footer/>
      </div>
    </Router>
    
    
  )
}

export default App