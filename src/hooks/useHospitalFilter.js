import { useState, useCallback, useEffect } from 'react';
import hospitalData from '../data/hospitalData';

export const useHospitalFilter = () => {
  const [allHospitals] = useState(hospitalData.hospitals);
  const [filteredHospitals, setFilteredHospitals] = useState(allHospitals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    facilityType: [],
    specialty: [],
    service: []
  });

  const applyFilters = useCallback(() => {
    let results = [...allHospitals];

    // Apply facility type filters
    if (filters.facilityType.length > 0) {
      results = results.filter(hospital => 
        filters.facilityType.some(filter => {
          if (filter === 'hospital') return !hospital.type.clinic;
          if (filter === 'clinic') return hospital.type.clinic;
          if (filter === 'public') return hospital.type.public;
          if (filter === 'private') return hospital.type.private;
          return false;
        })
      );
    }

    // Apply specialty filters
    if (filters.specialty.length > 0) {
      results = results.filter(hospital => 
        filters.specialty.some(filter => {
          if (filter === 'emergency') return hospital.facilities.emergencyServices;
          if (filter === 'surgery') return hospital.departments.generalSurgery;
          if (filter === 'pediatrics') return hospital.departments.pediatrics || hospital.departments['child specialist'];
          if (filter === 'gynecology') return hospital.departments.gynecologyObstetrics;
          if (filter === 'cardiology') return hospital.departments.cardiology;
          return false;
        })
      );
    }

    // Apply service filters
    if (filters.service.length > 0) {
      results = results.filter(hospital => 
        filters.service.some(filter => hospital.facilities[filter] === true)
      );
    }

    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(hospital => {
        if (hospital.hospitalClinicName.toLowerCase().includes(term)) return true;
        if (hospital.fullAddress.toLowerCase().includes(term)) return true;
        if (hospital.doctors.some(doctor => 
          doctor.specialization.toLowerCase().includes(term)
        )) return true;
        if (hospital.doctors.some(doctor => 
          doctor.treatsDiseases && doctor.treatsDiseases.some(disease => 
            disease.toLowerCase().includes(term)
          )
        )) return true;
        
        for (const [dept, available] of Object.entries(hospital.departments)) {
          if (available === true && dept.toLowerCase().includes(term)) return true;
        }
        
        for (const [facility, value] of Object.entries(hospital.facilities)) {
          if ((value === true || (typeof value === 'object' && value?.available === true)) && 
              facility.toLowerCase().includes(term)) {
            return true;
          }
        }
        return false;
      });
    }

    setFilteredHospitals(results);
  }, [allHospitals, searchTerm, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const updateSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const updateFilter = useCallback((filterType, newFilters) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(newFilters) ? newFilters : []
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      facilityType: [],
      specialty: [],
      service: []
    });
    setSearchTerm('');
  }, []);

  return {
    hospitals: filteredHospitals,
    totalHospitals: filteredHospitals.length,
    searchTerm,
    filters,
    updateSearch,
    updateFilter,
    clearFilters,
    applyFilters
  };
};