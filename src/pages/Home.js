import React, { useState } from 'react';
import Hero from '../components/Hero';
import Filters from '../components/Filters';
import HospitalCard from '../components/HospitalCard';
import HospitalModal from '../components/HospitalModal';
import StatsCard from '../components/StatsCard';
import { useHospitalFilter } from '../hooks/useHospitalFilter';
import hospitalData from '../data/hospitalData';

const Home = () => {
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

  // Calculate basic stats for home page
  const basicStats = {
    totalFacilities: hospitalData.hospitals.length,
    totalDoctors: hospitalData.hospitals.reduce((sum, h) => sum + (h.doctors?.length || 0), 0),
    totalBeds: hospitalData.hospitals.reduce((sum, h) => sum + (h.facilities.inpatientWard?.beds || 0), 0),
    emergencyCenters: hospitalData.hospitals.filter(h => h.facilities.emergencyServices).length
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      
      <div className="container">
        <div className="stats">
          <StatsCard icon="fas fa-hospital" title="Medical Facilities" value={basicStats.totalFacilities} color="primary" />
          <StatsCard icon="fas fa-user-md" title="Medical Professionals" value={basicStats.totalDoctors} color="success" />
          <StatsCard icon="fas fa-procedures" title="Total Beds Available" value={basicStats.totalBeds} color="warning" />
          <StatsCard icon="fas fa-ambulance" title="Emergency Centers" value={basicStats.emergencyCenters} color="danger" />
        </div>
        
        <h2 className="section-title">Medical Facilities</h2>
        
        <Filters 
          filters={filters} 
          onFilterChange={handleFilterChange}
        />
        
        {hospitals.length === 0 ? (
          <div className="no-results">
            <i className="fas fa-search" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}></i>
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
      </div>

      {showModal && selectedHospital && (
        <HospitalModal 
          hospital={selectedHospital}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default Home;