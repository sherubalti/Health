import React, { useState } from 'react';
import HospitalCard from '../components/HospitalCard';
import HospitalModal from '../components/HospitalModal';
import hospitalData from '../data/hospitalData';

const Emergency = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter emergency hospitals
  const emergencyHospitals = hospitalData.hospitals.filter(hospital => 
    hospital.facilities.emergencyServices === true
  );

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
      <h2 className="section-title">
        <i className="fas fa-ambulance" style={{ marginRight: '0.5rem', color: '#dc3545' }}></i>
        Emergency Services ({emergencyHospitals.length})
      </h2>
      
      {emergencyHospitals.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '1rem' }}></i>
          <h3>No Emergency Services Available</h3>
          <p>Please dial 1122 for emergency assistance</p>
        </div>
      ) : (
        <div className="hospital-list">
          {emergencyHospitals.map((hospital, index) => (
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

export default Emergency;