const medicalTerminology = {
  diseases: {
    hepatitis: [
      "Hepatitis A", "Hepatitis B", "Hepatitis C", "Hepatitis D", "Hepatitis E",
      "Acute Hepatitis", "Chronic Hepatitis", "Viral Hepatitis", "Alcoholic Hepatitis",
      "Autoimmune Hepatitis", "Fulminant Hepatitis"
    ],
    diabetes: [
      "Type 1 Diabetes", "Type 2 Diabetes", "Gestational Diabetes", "Prediabetes",
      "Diabetes Mellitus", "Insulin Resistance", "Hyperglycemia", "Hypoglycemia"
    ],
    cardiac: [
      "Coronary Artery Disease", "Myocardial Infarction", "Heart Failure",
      "Arrhythmia", "Hypertension", "Angina Pectoris", "Cardiomyopathy",
      "Pericarditis", "Endocarditis"
    ],
    respiratory: [
      "Pneumonia", "Asthma", "COPD", "Bronchitis", "Tuberculosis",
      "Pulmonary Embolism", "Lung Cancer", "Pleurisy"
    ],
    gastrointestinal: [
      "Gastritis", "GERD", "Peptic Ulcer", "Inflammatory Bowel Disease",
      "Irritable Bowel Syndrome", "Cirrhosis", "Pancreatitis", "Cholecystitis"
    ],
    neurological: [
      "Transient Ischemic Attack", "Stroke", "Seizure Disorder", "Migraine",
      "Multiple Sclerosis", "Parkinson's Disease", "Alzheimer's Disease"
    ]
  },
  tests: {
    liver: [
      "ALT (Alanine Aminotransferase)", "AST (Aspartate Aminotransferase)",
      "ALP (Alkaline Phosphatase)", "Bilirubin Total", "Bilirubin Direct",
      "Albumin", "Total Protein", "GGT (Gamma-Glutamyl Transferase)",
      "PT/INR", "Hepatitis Viral Markers"
    ],
    cardiac: [
      "ECG (Electrocardiogram)", "Echocardiogram", "Stress Test",
      "Cardiac Enzymes", "Lipid Profile", "Holter Monitor",
      "Cardiac CT", "Coronary Angiography"
    ],
    diabetes: [
      "Fasting Blood Glucose", "Random Blood Glucose", "HbA1c",
      "Oral Glucose Tolerance Test", "Insulin Level", "C-Peptide"
    ],
    renal: [
      "Creatinine", "Blood Urea Nitrogen", "eGFR", "Urinalysis",
      "24-hour Urine Protein", "Renal Ultrasound", "Electrolytes"
    ],
    neurological: [
      "Carotid Ultrasound", "Brain MRI", "EEG (Electroencephalogram)",
      "CT Angiography", "Lumbar Puncture"
    ],
    general: [
      "Complete Blood Count", "ESR", "CRP", "Thyroid Function Tests",
      "Vitamin D Level", "Iron Studies", "Coagulation Profile"
    ]
  },
  medications: {
    antibiotics: [
      "Amoxicillin", "Azithromycin", "Ciprofloxacin", "Doxycycline",
      "Metronidazole", "Cefixime", "Levofloxacin"
    ],
    cardiac: [
      "Atenolol", "Metoprolol", "Amlodipine", "Lisinopril",
      "Losartan", "Furosemide", "Spironolactone"
    ],
    diabetes: [
      "Metformin", "Glibenclamide", "Glimepiride", "Insulin",
      "Sitagliptin", "Pioglitazone"
    ],
    gastrointestinal: [
      "Omeprazole", "Pantoprazole", "Domperidone", "Metoclopramide",
      "Loperamide", "Ursodeoxycholic Acid"
    ],
    analgesics: [
      "Paracetamol", "Ibuprofen", "Diclofenac", "Tramadol",
      "Morphine", "Codeine"
    ],
    neurological: [
      "Aspirin", "Clopidogrel", "Levetiracetam", "Phenytoin",
      "Sumatriptan", "Donepezil"
    ]
  },
  symptoms: {
    general: ["Fever", "Fatigue", "Weight Loss", "Weight Gain", "Weakness"],
    gastrointestinal: [
      "Abdominal Pain", "Nausea", "Vomiting", "Diarrhea", "Constipation",
      "Jaundice", "Loss of Appetite", "Heartburn"
    ],
    cardiac: [
      "Chest Pain", "Palpitations", "Shortness of Breath", "Edema",
      "Dizziness", "Syncope"
    ],
    respiratory: [
      "Cough", "Sputum", "Hemoptysis", "Wheezing", "Chest Tightness"
    ],
    neurological: [
      "Headache", "Dizziness", "Seizures", "Weakness", "Numbness",
      "Vision Changes", "Speech Difficulty", "Facial Droop"
    ]
  },
  abbreviations: {
    common: {
      "BP": "Blood Pressure",
      "HR": "Heart Rate",
      "RR": "Respiratory Rate",
      "SpO2": "Oxygen Saturation",
      "T": "Temperature",
      "CBC": "Complete Blood Count",
      "LFT": "Liver Function Test",
      "KFT": "Kidney Function Test",
      "ECG": "Electrocardiogram",
      "USG": "Ultrasonography",
      "CT": "Computed Tomography",
      "MRI": "Magnetic Resonance Imaging",
      "TIA": "Transient Ischemic Attack"
    },
    lab: {
      "ALT": "Alanine Aminotransferase",
      "AST": "Aspartate Aminotransferase",
      "ALP": "Alkaline Phosphatase",
      "Hb": "Hemoglobin",
      "WBC": "White Blood Cells",
      "RBC": "Red Blood Cells",
      "PLT": "Platelets",
      "INR": "International Normalized Ratio",
      "PT": "Prothrombin Time"
    }
  }
};

const isMedicalTerm = (term) => {
  const allTerms = [
    ...Object.values(medicalTerminology.diseases).flat(),
    ...Object.values(medicalTerminology.tests).flat(),
    ...Object.values(medicalTerminology.medications).flat(),
    ...Object.values(medicalTerminology.symptoms).flat(),
    ...Object.keys(medicalTerminology.abbreviations.common),
    ...Object.keys(medicalTerminology.abbreviations.lab)
  ];
  return allTerms.some(medicalTerm =>
    medicalTerm.toLowerCase().includes(term.toLowerCase()) ||
    term.toLowerCase().includes(medicalTerm.toLowerCase())
  );
};

const expandAbbreviation = (abbr) => {
  return medicalTerminology.abbreviations.common[abbr] || 
         medicalTerminology.abbreviations.lab[abbr] || 
         abbr;
};

const getRelatedTerms = (term) => {
  const related = [];
  Object.entries(medicalTerminology.diseases).forEach(([category, diseases]) => {
    if (diseases.some(d => d.toLowerCase().includes(term.toLowerCase()))) {
      related.push(...diseases);
    }
  });
  return [...new Set(related)];
};

medicalTerminology.isMedicalTerm = isMedicalTerm;
medicalTerminology.expandAbbreviation = expandAbbreviation;
medicalTerminology.getRelatedTerms = getRelatedTerms;

export default medicalTerminology;