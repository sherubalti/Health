// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();

//   const isActive = (path) => location.pathname === path ? 'active' : '';

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <header className="header">
//       <div className="header-content">
//         <div className="logo">
//           <i className="fas fa-hospital"></i> Skardu Healthcare
//         </div>
        
//         <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
//           <ul>
//             <li><Link to="/" className={`nav-link ${isActive('/')}`} onClick={toggleMenu}>Home</Link></li>
//             <li><Link to="/hospitals" className={`nav-link ${isActive('/hospitals')}`} onClick={toggleMenu}>Hospitals</Link></li>
//             <li><Link to="/doctors" className={`nav-link ${isActive('/doctors')}`} onClick={toggleMenu}>Doctors</Link></li>
//             <li><Link to="/emergency" className={`nav-link ${isActive('/emergency')}`} onClick={toggleMenu}>Emergency</Link></li>
//             <li><Link to="/stats" className={`nav-link ${isActive('/stats')}`} onClick={toggleMenu}>Stats</Link></li>
//             <li><Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={toggleMenu}>About</Link></li>
//             <li><Link to="/ai-report" className={`nav-link ${isActive('/ai-report')}`} onClick={toggleMenu}>AI Report</Link></li>  // New link
//           </ul>
//         </nav>

//         <button className="menu-toggle" onClick={toggleMenu}>
//           <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      style={{
        background: 'linear-gradient(135deg, var(--primary), #0d47a1)',
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: 'var(--shadow)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <i className="fas fa-hospital" style={{ marginRight: '10px' }}></i> Skardu Healthcare
        </div>

        <nav
          style={{
            display: 'flex',
            width: isMenuOpen ? '100%' : 'auto',
          }}
        >
          <ul
            style={{
              display: isMenuOpen ? 'flex' : 'flex',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              flexDirection: isMenuOpen && window.innerWidth <= 768 ? 'column' : 'row',
              gap: isMenuOpen && window.innerWidth <= 768 ? '0.5rem' : '0',
            }}
          >
            <li style={{ marginLeft: isMenuOpen && window.innerWidth <= 768 ? '0' : '1.5rem' }}>
              <Link
                to="/"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'background 0.3s',
                  background: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
                onClick={toggleMenu}
                onMouseOver={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
                onMouseOut={(e) =>
                  (e.target.style.background = isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent')
                }
              >
                Home
              </Link>
            </li>
            <li style={{ marginLeft: isMenuOpen && window.innerWidth <= 768 ? '0' : '1.5rem' }}>
              <Link
                to="/hospitals"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'background 0.3s',
                  background: isActive('/hospitals') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
                onClick={toggleMenu}
                onMouseOver={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
                onMouseOut={(e) =>
                  (e.target.style.background = isActive('/hospitals') ? 'rgba(255, 255, 255, 0.1)' : 'transparent')
                }
              >
                Hospitals
              </Link>
            </li>
            <li style={{ marginLeft: isMenuOpen && window.innerWidth <= 768 ? '0' : '1.5rem' }}>
              <Link
                to="/doctors"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'background 0.3s',
                  background: isActive('/doctors') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
                onClick={toggleMenu}
                onMouseOver={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
                onMouseOut={(e) =>
                  (e.target.style.background = isActive('/doctors') ? 'rgba(255, 255, 255, 0.1)' : 'transparent')
                }
              >
                Doctors
              </Link>
            </li>
            <li style={{ marginLeft: isMenuOpen && window.innerWidth <= 768 ? '0' : '1.5rem' }}>
              <Link
                to="/emergency"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'background 0.3s',
                  background: isActive('/emergency') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
                onClick={toggleMenu}
                onMouseOver={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
                onMouseOut={(e) =>
                  (e.target.style.background = isActive('/emergency') ? 'rgba(255, 255, 255, 0.1)' : 'transparent')
                }
              >
                Emergency
              </Link>
            </li>
            <li style={{ marginLeft: isMenuOpen && window.innerWidth <= 768 ? '0' : '1.5rem' }}>
              <Link
                to="/stats"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'background 0.3s',
                  background: isActive('/stats') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
                onClick={toggleMenu}
                onMouseOver={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
                onMouseOut={(e) =>
                  (e.target.style.background = isActive('/stats') ? 'rgba(255, 255, 255, 0.1)' : 'transparent')
                }
              >
                Stats
              </Link>
            </li>
            <li style={{ marginLeft: isMenuOpen && window.innerWidth <= 768 ? '0' : '1.5rem' }}>
              <Link
                to="/about"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'background 0.3s',
                  background: isActive('/about') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
                onClick={toggleMenu}
                onMouseOver={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
                onMouseOut={(e) =>
                  (e.target.style.background = isActive('/about') ? 'rgba(255, 255, 255, 0.1)' : 'transparent')
                }
              >
                About
              </Link>
            </li>
            <li style={{ marginLeft: isMenuOpen && window.innerWidth <= 768 ? '0' : '1.5rem' }}>
              <Link
                to="/ai-report"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'background 0.3s',
                  background: isActive('/ai-report') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
                onClick={toggleMenu}
                onMouseOver={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
                onMouseOut={(e) =>
                  (e.target.style.background = isActive('/ai-report') ? 'rgba(255, 255, 255, 0.1)' : 'transparent')
                }
              >
                AI Report
              </Link>
            </li>
          </ul>
        </nav>

        <button
          style={{
            display: window.innerWidth <= 768 ? 'block' : 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            position: 'absolute',
            right: '1rem',
            top: '1rem',
          }}
          onClick={toggleMenu}
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
    </header>
  );
};

export default Header;