import React from 'react';

const Filters = ({ filters, onFilterChange }) => {
  const filterGroups = [
    {
      title: "Facility Type",
      icon: "fas fa-stethoscope",
      type: "facilityType",
      options: [
        { value: "all", label: "All", icon: "fas fa-check-circle" },
        { value: "hospital", label: "Hospital", icon: "fas fa-hospital" },
        { value: "clinic", label: "Clinic", icon: "fas fa-clinic-medical" },
        { value: "public", label: "Public", icon: "fas fa-building" },
        { value: "private", label: "Private", icon: "fas fa-home" }
      ]
    },
    {
      title: "Specialties",
      icon: "fas fa-heartbeat",
      type: "specialty",
      options: [
        { value: "emergency", label: "Emergency", icon: "fas fa-ambulance" },
        { value: "surgery", label: "Surgery", icon: "fas fa-stethoscope" },
        { value: "pediatrics", label: "Pediatrics", icon: "fas fa-baby" },
        { value: "gynecology", label: "Gynecology", icon: "fas fa-female" },
        { value: "cardiology", label: "Cardiology", icon: "fas fa-heart" }
      ]
    },
    {
      title: "Services",
      icon: "fas fa-concierge-bell",
      type: "service",
      options: [
        { value: "pharmacyMedicineStore", label: "Pharmacy", icon: "fas fa-pills" },
        { value: "laboratoryPathology", label: "Laboratory", icon: "fas fa-flask" },
        { value: "xRay", label: "X-Ray", icon: "fas fa-x-ray" },
        { value: "ultrasound", label: "Ultrasound", icon: "fas fa-procedures" },
        { value: "icu", label: "ICU", icon: "fas fa-plus-square" }
      ]
    }
  ];

  const handleFilterClick = (filterType, value) => {
    if (value === 'all') {
      // Clear all filters for this type
      onFilterChange(filterType, [], true);
    } else {
      const currentFilters = filters[filterType] || [];
      const isActive = !currentFilters.includes(value);
      const newFilters = isActive 
        ? [...currentFilters, value]
        : currentFilters.filter(f => f !== value);
      
      onFilterChange(filterType, newFilters, isActive);
    }
  };

  const hasActiveFilters = Object.values(filters).some(group => group.length > 0);

  return (
    <div className="filters">
      {filterGroups.map((group, index) => (
        <div key={index} className="filter-group">
          <h3>
            <i className={group.icon}></i> {group.title}
          </h3>
          <div className="filter-options">
            {group.options.map((option) => {
              const isActive = option.value === 'all' 
                ? (filters[group.type] || []).length === 0 
                : (filters[group.type] || []).includes(option.value);
              
              return (
                <div
                  key={option.value}
                  className={`filter-option ${isActive ? 'active' : ''}`}
                  onClick={() => handleFilterClick(group.type, option.value)}
                >
                  <i className={option.icon}></i> {option.label}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {hasActiveFilters && (
        <div className="filter-actions" style={{ textAlign: 'right', marginTop: '1rem' }}>
          <button 
            className="clear-filters-btn"
            onClick={() => {
              Object.keys(filters).forEach(key => {
                onFilterChange(key, [], true);
              });
            }}
            style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-times"></i> Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;