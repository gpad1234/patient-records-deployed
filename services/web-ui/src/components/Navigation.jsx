import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          🏥 Diabetes EMR
        </Link>
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Dashboard</Link></li>
          <li><Link to="/patients" onClick={closeMenu}>Patients</Link></li>
          <li><Link to="/patients/new" onClick={closeMenu}>Add Patient</Link></li>
          <li><Link to="/research/ai" onClick={closeMenu}>🧠 AI Research</Link></li>
          <li><Link to="/predictions/ai" onClick={closeMenu}>🤖 AI Predictions</Link></li>
          <li><Link to="/admin/seed" onClick={closeMenu}>📊 Test Data</Link></li>
        </ul>
      </div>
    </nav>
  );
}
