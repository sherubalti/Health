import React from 'react';
import SearchBox from './SearchBox';

const Hero = ({ onSearch }) => {
  return (
    <section className="hero">
      <style jsx>{`
        .hero {
          background: linear-gradient(rgba(26, 118, 210, 0.8), rgba(13, 71, 161, 0.8)), 
                      url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80') center/cover no-repeat;
          color: white;
          text-align: center;
          padding: 4rem 1rem;
        }
        
        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .hero p {
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto 2rem;
        }
        
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
        }
      `}</style>
      
      <div className="hero-content">
        <h1>Find Healthcare in Skardu Region</h1>
        <p>Discover hospitals, clinics, and medical specialists across Skardu and surrounding areas</p>
        <SearchBox onSearch={onSearch} />
      </div>
    </section>
  );
};

export default Hero;