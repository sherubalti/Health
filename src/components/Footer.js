import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <style jsx>{`
        .footer {
          background: #333;
          color: white;
          padding: 3rem 1rem 1rem;
          margin-top: 3rem;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .footer-section h3 {
          margin-bottom: 1rem;
          color: #ccc;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #555;
        }
        
        .footer-section p {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .footer-section i {
          margin-right: 10px;
          color: var(--primary);
        }
        
        .footer-section a {
          color: #ccc;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .footer-section a:hover {
          color: white;
        }
        
        .copyright {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #555;
          color: #ccc;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }
      `}</style>
      
      <div className="footer-content">
        <div className="footer-section">
          <h3>Skardu Healthcare</h3>
          <p><i className="fas fa-map-marker-alt"></i> Skardu, Gilgit-Baltistan, Pakistan</p>
          <p><i className="fas fa-phone"></i> +92-5815-XXXXX</p>
          <p><i className="fas fa-envelope"></i> info@skarduhealthcare.com</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <p><a href="/emergency"><i className="fas fa-ambulance"></i> Emergency Services</a></p>
          <p><a href="/stats"><i className="fas fa-chart-bar"></i> Healthcare Stats</a></p>
          <p><a href="/about"><i className="fas fa-info-circle"></i> About Skardu Region</a></p>
          <p><a href="/hospitals"><i className="fas fa-map-marked-alt"></i> Find Hospital</a></p>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <p><a href="#"><i className="fab fa-facebook"></i> Facebook</a></p>
          <p><a href="#"><i className="fab fa-twitter"></i> Twitter</a></p>
          <p><a href="#"><i className="fab fa-instagram"></i> Instagram</a></p>
          <p><a href="#"><i className="fab fa-youtube"></i> YouTube</a></p>
        </div>
      </div>
      
      <div className="copyright">
        &copy; 2025 Skardu Healthcare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;