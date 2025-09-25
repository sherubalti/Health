import React from 'react';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="doctor-card" style={{ 
      background: 'var(--secondary)', 
      padding: '1rem', 
      borderRadius: '6px', 
      boxShadow: 'var(--shadow)' 
    }}>
      <div className="doctor-name" style={{ 
        fontWeight: '600', 
        marginBottom: '0.5rem', 
        color: 'var(--primary)', 
        lineHeight: '1.3' 
      }}>
        {doctor.doctorName}
      </div>
      <div className="doctor-specialization" style={{ 
        fontSize: '0.9rem', 
        color: 'var(--light-text)', 
        marginBottom: '0.5rem', 
        lineHeight: '1.3' 
      }}>
        {doctor.specialization}
      </div>
      
      <div className="doctor-info" style={{ 
        fontSize: '0.9rem', 
        marginBottom: '0.3rem', 
        display: 'flex', 
        alignItems: 'center', 
        lineHeight: '1.3' 
      }}>
        <i className="fas fa-clock" style={{ marginRight: '8px', color: 'var(--primary)' }}></i> 
        <strong>Availability:</strong> {doctor.availabilityTimings}
      </div>
      
      <div className="doctor-info" style={{ 
        fontSize: '0.9rem', 
        marginBottom: '0.3rem', 
        display: 'flex', 
        alignItems: 'center', 
        lineHeight: '1.3' 
      }}>
        <i className="fas fa-users" style={{ marginRight: '8px', color: 'var(--primary)' }}></i> 
        <strong>Average Patients per Day:</strong> {doctor.averagePatientsPerDay || 'N/A'}
      </div>
      
      {doctor.treatsDiseases && doctor.treatsDiseases.length > 0 && (
        <div className="diseases-list" style={{ 
          marginTop: '0.5rem', 
          padding: '0.5rem', 
          background: '#f0f8ff', 
          borderRadius: '4px', 
          fontSize: '0.8rem' 
        }}>
          <h4 style={{ 
            marginBottom: '0.3rem', 
            color: 'var(--primary)', 
            fontSize: '0.9rem' 
          }}>
            <i className="fas fa-notes-medical"></i> Possible Diseases:
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {doctor.treatsDiseases.map((disease, index) => (
              <li key={index} style={{ padding: '0.1rem 0', color: 'var(--text)' }}>
                • {disease}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {doctor.contactNumber && doctor.contactNumber !== 'null' && (
        <div className="doctor-info" style={{ 
          fontSize: '0.9rem', 
          marginBottom: '0.3rem', 
          display: 'flex', 
          alignItems: 'center', 
          lineHeight: '1.3' 
        }}>
          <i className="fas fa-phone" style={{ marginRight: '8px', color: 'var(--primary)' }}></i> 
          <strong>Contact:</strong> {doctor.contactNumber}
        </div>
      )}
    </div>
  );
};

export default DoctorCard;