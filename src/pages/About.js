import React from 'react';

const About = () => {
  return (
    <div className="container">
      <h2 className="section-title">About Skardu Healthcare</h2>
      
      <div className="about-content" style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: 'var(--border-radius)', 
        boxShadow: 'var(--shadow)', 
        marginBottom: '2rem' 
      }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
          <i className="fas fa-heartbeat" style={{ marginRight: '0.5rem' }}></i>
          Our Mission
        </h3>
        <p style={{ lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Skardu Healthcare is dedicated to providing accessible and comprehensive medical information 
          for the beautiful Skardu region in Gilgit-Baltistan. Our mission is to connect residents and 
          visitors with the best healthcare facilities, doctors, and emergency services available in 
          this remote yet breathtaking region of Pakistan.
        </p>
        
        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
          <i className="fas fa-mountain" style={{ marginRight: '0.5rem' }}></i>
          About Skardu Region
        </h3>
        <p style={{ lineHeight: '1.8', marginBottom: '1.5rem' }}>
          Nestled in the heart of Gilgit-Baltistan, Skardu is known as the gateway to some of the world's 
          highest peaks including K2. Despite its stunning natural beauty, the region faces unique healthcare 
          challenges due to its remote location and harsh weather conditions. Our platform aims to bridge 
          this gap by providing reliable healthcare information to both locals and tourists.
        </p>
        
        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
          <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
          Our Services
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>🏥 Hospital Directory</h4>
            <p>Complete listing of all medical facilities with detailed information</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>👨‍⚕️ Doctor Database</h4>
            <p>Find specialists by name, specialty, and availability</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>🚨 Emergency Services</h4>
            <p>24/7 emergency contact information and nearest facilities</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '6px' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>📊 Healthcare Analytics</h4>
            <p>Detailed statistics and performance metrics</p>
          </div>
        </div>
      </div>

      <div className="contact-section" style={{ 
        background: 'linear-gradient(135deg, var(--primary), #0d47a1)', 
        color: 'white', 
        padding: '2rem', 
        borderRadius: 'var(--border-radius)', 
        textAlign: 'center' 
      }}>
        <h3 style={{ marginBottom: '1rem' }}>
          <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
          Get In Touch
        </h3>
        <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
          Have questions or suggestions? We'd love to hear from you!
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <p><i className="fas fa-envelope"></i> info@skarduhealthcare.com</p>
          <p><i className="fas fa-phone"></i> +92-5815-123456</p>
          <p><i className="fas fa-map-marker-alt"></i> Skardu, Gilgit-Baltistan</p>
        </div>
      </div>
    </div>
  );
};

export default About;