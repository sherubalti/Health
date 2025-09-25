export const formatFacilityName = (name) => {
  if (!name) return '';
  
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace('Ct', 'CT')
    .replace('Mri', 'MRI')
    .replace('Ccu', 'CCU')
    .replace('Icu', 'ICU')
    .replace('Nicu', 'NICU')
    .replace('child specialist', 'Child Specialist')
    .replace('pharmacyMedicineStore', 'Pharmacy')
    .replace('laboratoryPathology', 'Laboratory')
    .replace('eyeCareOphthalmologyUnit', 'Ophthalmology Unit')
    .replace('mentalHealthPsychiatryServices', 'Psychiatry Services')
    .replace('physiotherapyUnit', 'Physiotherapy')
    .replace('dentalUnit', 'Dental Unit')
    .replace('maternityWard', 'Maternity Ward')
    .replace('outpatientDepartment', 'Outpatient Department')
    .replace('inpatientWard', 'Inpatient Ward')
    .replace('ambulanceService', 'Ambulance')
    .replace('vaccinationCenter', 'Vaccination Center')
    .replace('bloodBank', 'Blood Bank')
    .replace('dialysisCenter', 'Dialysis Center')
    .replace('operationTheatre', 'Operation Theatre')
    .trim();
};