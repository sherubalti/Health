import React, { useState, useEffect } from 'react';

const SearchBox = ({ onSearch, placeholder = "Search for hospitals, clinics, doctors, specialties, or facilities..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <style jsx>{`
        .search-box {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 50px;
          padding: 0.5rem;
          display: flex;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .search-input {
          flex: 1;
          border: none;
          padding: 0.8rem 1.5rem;
          font-size: 1rem;
          border-radius: 50px 0 0 50px;
          outline: none;
        }
        
        .search-button {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 0 50px 50px 0;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s;
          display: flex;
          align-items: center;
        }
        
        .search-button:hover {
          background: #0d47a1;
        }
        
        .search-button i {
          margin-right: 8px;
        }
        
        @media (max-width: 768px) {
          .search-box {
            flex-direction: column;
            border-radius: 8px;
          }
          
          .search-input {
            border-radius: 8px 8px 0 0;
            margin-bottom: 1px;
          }
          
          .search-button {
            border-radius: 0 0 8px 8px;
          }
        }
      `}</style>
      
      <input
        type="text"
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit" className="search-button">
        <i className="fas fa-search"></i> Search
      </button>
    </form>
  );
};

export default SearchBox;