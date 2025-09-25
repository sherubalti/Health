import React from 'react';
import { formatFacilityName } from '../utils/formatFacility';
import { getGoogleMapsUrl, getCoordinatesString } from '../utils/googleMaps';
import DoctorCard from './DoctorCard';

const HospitalModal = ({ hospital, onClose }) => {
  if (!hospital) return null;

  const facilities = [];
  for (const [key, value] of Object.entries(hospital.facilities)) {
    if (value === true) {
      facilities.push(key);
    } else if (typeof value === 'object' && value !== null && value.available === true) {
      facilities.push(`${key} (${value.beds} beds)`);
    }
  }

  const departments = [];
  for (const [key, value] of Object.entries(hospital.departments)) {
    if (value === true) {
      departments.push(key);
    }
  }

  const mapsUrl = getGoogleMapsUrl(hospital);
  const coordinates = getCoordinatesString(hospital);
  const type = hospital.type.private ? 'Private' : 'Public';
  const subtype = hospital.type.clinic ? 'Clinic' : 'Hospital';

  const hasAdditionalNotes = hospital.doctors.some(d => d.additionalNotes);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style jsx>{`
        .modal-overlay {
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }
        
        .modal-content {
          background: white;
          margin: auto;
          border-radius: var(--border-radius);
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalFade 0.3s;
          position: relative;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        @keyframes modalFade {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .close-modal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--light-text);
          z-index: 10;
          background: rgba(255,255,255,0.8);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
        }
        
        .hospital-detail {
          padding: 2rem;
        }
        
        .detail-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .detail-header h2 {
          color: var(--primary);
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
          line-height: 1.3;
        }
        
        .detail-section {
          margin-bottom: 2rem;
        }
        
        .detail-section h3 {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
          color: var(--primary);
          display: flex;
          align-items: center;
        }
        
        .detail-section h3 i {
          margin-right: 10px;
        }
        
        .doctors-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .location-map-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background 0.3s;
          display: inline-flex;
          align-items: center;
        }
        
        .location-map-btn:hover {
          background: #0d47a1;
        }
        
        .coordinates-display {
          font-size: 0.8rem;
          color: var(--light-text);
          background: #f8f9fa;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          margin-top: 0.5rem;
          display: inline-block;
        }
        
        .additional-notes {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          border-left: 4px solid var(--primary);
        }
        
        .additional-notes h4 {
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .modal-content {
            margin: 1rem;
            max-height: 95vh;
          }
          
          .hospital-detail {
            padding: 1rem;
          }
          
          .doctors-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="hospital-detail">
          <div className="detail-header">
            <h2>{hospital.hospitalClinicName}</h2>
            <div>
              <p>
                <i className="fas fa-map-marker-alt"></i>{' '}
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="location-link">
                  {hospital.fullAddress}
                </a>
              </p>
              <span className="coordinates-display">📍 {coordinates}</span>
            </div>
            <button 
              className="location-map-btn"
              onClick={() => window.open(mapsUrl, '_blank')}
            >
              <i className="fas fa-map-marked-alt"></i> View on Google Maps
            </button>
            <p><i className="fas fa-phone"></i> <strong>Phone:</strong> {hospital.phoneNumbers.join(', ')}</p>
            {hospital.facilities.emergencyServices && (
              <p><i className="fas fa-ambulance"></i> <strong>Emergency Services Available</strong></p>
            )}
            <p><strong>Type:</strong> {type} {subtype}</p>
          </div>

          <div className="detail-section">
            <h3><i className="fas fa-concierge-bell"></i> Facilities & Services ({facilities.length})</h3>
            <div className="facilities" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {facilities.map((facility, index) => (
                <span key={index} className="facility" style={{ 
                  background: 'var(--accent)', 
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem', 
                  color: 'var(--primary)' 
                }}>
                  {formatFacilityName(facility)}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3><i className="fas fa-stethoscope"></i> Departments ({departments.length})</h3>
            <div className="facilities" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {departments.map((dept, index) => (
                <span key={index} className="facility" style={{ 
                  background: 'var(--accent)', 
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem', 
                  color: 'var(--primary)' 
                }}>
                  {formatFacilityName(dept)}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3><i className="fas fa-user-md"></i> Doctors ({hospital.doctors.length})</h3>
            <div className="doctors-list">
              {hospital.doctors.map((doctor, index) => (
                <DoctorCard key={index} doctor={doctor} />
              ))}
            </div>
          </div>

          {hasAdditionalNotes && (
            <div className="detail-section">
              <h3><i className="fas fa-info-circle"></i> Additional Information</h3>
              {hospital.doctors
                .filter(d => d.additionalNotes)
                .map((doctor, index) => (
                  <div key={index} className="additional-notes">
                    <h4>challengesFaced</h4>
                    <p><i className="fas fa-exclamation-triangle"></i> <strong>Challenges:</strong> {doctor.additionalNotes.challengesFaced}</p>
                    <p><i className="fas fa-hands-helping"></i> <strong>Special Services:</strong> {doctor.additionalNotes.specialServices}</p>
                    <p><i className="fas fa-map-marked-alt"></i> <strong>Patient Origin:</strong> {doctor.additionalNotes.patientOrigin}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalModal;