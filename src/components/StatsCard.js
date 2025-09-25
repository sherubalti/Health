import React from 'react';

const StatsCard = ({ icon, title, value, color = "primary" }) => {
  const colorStyles = {
    primary: { background: '#1a76d2', color: 'white' },
    success: { background: '#28a745', color: 'white' },
    warning: { background: '#ffc107', color: '#212529' },
    danger: { background: '#dc3545', color: 'white' },
    info: { background: '#17a2b8', color: 'white' },
    secondary: { background: '#6c757d', color: 'white' }
  };

  const style = {
    ...colorStyles[color],
    borderRadius: 'var(--border-radius)',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: 'var(--shadow)',
    transition: 'transform 0.3s'
  };

  return (
    <div className="stat-card" style={style} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <i className={icon} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}></i>
      <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{value}</h3>
      <p style={{ margin: 0, opacity: 0.9 }}>{title}</p>
    </div>
  );
};

export default StatsCard;