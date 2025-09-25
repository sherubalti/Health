import React, { useState, useMemo } from 'react';
import SearchBox from '../components/SearchBox';
import DoctorCard from '../components/DoctorCard';
import hospitalData from '../data/hospitalData';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Get all doctors
  const allDoctors = useMemo(() => {
    return hospitalData.hospitals.flatMap(hospital => 
      hospital.doctors.map(doctor => ({
        ...doctor,
        hospital: hospital.hospitalClinicName,
        location: hospital.location
      }))
    );
  }, []);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    let results = allDoctors;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(doctor => 
        doctor.doctorName.toLowerCase().includes(term) ||
        doctor.specialization.toLowerCase().includes(term) ||
        (doctor.treatsDiseases && doctor.treatsDiseases.some(disease => 
          disease.toLowerCase().includes(term)
        ))
      );
    }

    if (selectedSpecialty) {
      results = results.filter(doctor => 
        doctor.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    return results;
  }, [allDoctors, searchTerm, selectedSpecialty]);

  // Get unique specialties
  const specialties = useMemo(() => {
    const unique = [...new Set(allDoctors.map(d => d.specialization))];
    return unique.sort();
  }, [allDoctors]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="container">
      <h2 className="section-title">All Medical Professionals ({filteredDoctors.length})</h2>
      
      <SearchBox 
        onSearch={handleSearch} 
        placeholder="Search doctors by name, specialty, or diseases treated..."
      />
      
      {specialties.length > 0 && (
        <div className="specialty-filter" style={{ 
          margin: '2rem 0', 
          background: 'white', 
          padding: '1rem', 
          borderRadius: 'var(--border-radius)', 
          boxShadow: 'var(--shadow)' 
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
            <i className="fas fa-filter"></i> Filter by Specialty
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button 
              key="all"
              onClick={() => setSelectedSpecialty('')}
              style={{
                background: selectedSpecialty ? 'var(--secondary)' : 'var(--primary)',
                color: selectedSpecialty ? 'var(--text)' : 'white',
                border: '1px solid #ddd',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              All Specialties
            </button>
            {specialties.map((specialty) => (
              <button 
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty === selectedSpecialty ? '' : specialty)}
                style={{
                  background: specialty === selectedSpecialty ? 'var(--primary)' : 'var(--secondary)',
                  color: specialty === selectedSpecialty ? 'white' : 'var(--text)',
                  border: '1px solid #ddd',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredDoctors.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-user-md" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}></i>
          <h3>No doctors found</h3>
          <p>Try adjusting your search or specialty filter</p>
        </div>
      ) : (
        <div className="doctors-list">
          {filteredDoctors.map((doctor, index) => (
            <DoctorCard 
              key={`${doctor.doctorName}-${doctor.hospital}-${index}`}
              doctor={doctor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;