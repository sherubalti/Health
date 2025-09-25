import React from 'react';
import { formatFacilityName } from '../utils/formatFacility';
import { getGoogleMapsUrl } from '../utils/googleMaps';

const HospitalCard = ({ hospital, onViewDetails }) => {
  const type = hospital.type.private ? 'Private' : 'Public';
  const subtype = hospital.type.clinic ? 'Clinic' : 'Hospital';
  
  const facilities = [];
  for (const [key, value] of Object.entries(hospital.facilities)) {
    if (value === true || (typeof value === 'object' && value !== null && value.available === true)) {
      facilities.push(key);
    }
  }
  
  const displayedFacilities = facilities.slice(0, 5);
  const extraFacilitiesCount = facilities.length - 5;
  
  const mapsUrl = getGoogleMapsUrl(hospital);
  const { latitude, longitude } = hospital.location;
  
  return (
    <div className="hospital-card">
      <div className="hospital-header">
        <h3 className="hospital-name">{hospital.hospitalClinicName}</h3>
        <p className="hospital-type">
          <i className={`fas ${hospital.type.clinic ? 'fa-clinic-medical' : 'fa-hospital'}`}></i> 
          {type} {subtype}
        </p>
      </div>
      
      <div className="hospital-body">
        <div className="hospital-info">
          <p>
            <i className="fas fa-map-marker-alt"></i> 
            <a 
              href={mapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="location-link"
            >
              {hospital.fullAddress}
            </a>
          </p>
          <p className="coordinates">
            <i className="fas fa-globe"></i> Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
          </p>
          <p><i className="fas fa-phone"></i> {hospital.phoneNumbers[0]}</p>
          {hospital.facilities.emergencyServices && (
            <p><i className="fas fa-ambulance"></i> Emergency Services Available</p>
          )}
        </div>
        
        <div className="facilities">
          {displayedFacilities.map((facility, index) => (
            <span key={index} className="facility">
              {formatFacilityName(facility)}
            </span>
          ))}
          {extraFacilitiesCount > 0 && (
            <span className="facility">+{extraFacilitiesCount} more</span>
          )}
        </div>
        
        <button 
          className="view-details"
          onClick={() => onViewDetails(hospital)}
          style={{
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            padding: '0.7rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background 0.3s',
            marginTop: 'auto'
          }}
          onMouseOver={(e) => e.target.style.background = '#0d47a1'}
          onMouseOut={(e) => e.target.style.background = 'var(--primary)'}
        >
          <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i> 
          View Details
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;