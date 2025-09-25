import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Hospitals from './pages/Hospitals';
import Doctors from './pages/Doctors';
import Emergency from './pages/Emergency';
import Stats from './pages/Stats';
import About from './pages/About';
import AIReport from './pages/AIReport';  // New import
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="emergency-banner">
          <i className="fas fa-phone-alt"></i> Emergency Services: Dial 1122 |{' '}
          <a href="/emergency">Find Emergency Centers</a>
        </div>
        
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai-report" element={<AIReport />} />  // New route
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;