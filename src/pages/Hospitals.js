import React, { useState } from 'react';
import HospitalCard from '../components/HospitalCard';
import SearchBox from '../components/SearchBox';
import Filters from '../components/Filters';
import HospitalModal from '../components/HospitalModal';
import { useHospitalFilter } from '../hooks/useHospitalFilter';
import hospitalData from '../data/hospitalData';

const Hospitals = () => {
  const { hospitals, searchTerm, filters, updateSearch, updateFilter } = useHospitalFilter();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = (term) => {
    updateSearch(term);
  };

  const handleFilterChange = (filterType, newFilters) => {
    updateFilter(filterType, newFilters);
  };

  const handleViewDetails = (hospital) => {
    setSelectedHospital(hospital);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHospital(null);
  };

  return (
    <div className="container">
      <h2 className="section-title">All Hospitals & Clinics ({hospitals.length})</h2>
      
      <SearchBox onSearch={handleSearch} placeholder="Search hospitals by name, location, or specialty..." />
      
      <Filters 
        filters={filters} 
        onFilterChange={handleFilterChange}
      />
      
      {hospitals.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-hospital" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}></i>
          <h3>No hospitals found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="hospital-list">
          {hospitals.map((hospital, index) => (
            <HospitalCard
              key={`${hospital.hospitalClinicName}-${index}`}
              hospital={hospital}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {showModal && selectedHospital && (
        <HospitalModal 
          hospital={selectedHospital}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Hospitals;