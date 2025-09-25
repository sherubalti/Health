const hospitalData = {
  hospitals: [



    {
      hospitalClinicName: "Zahida Hassan Memorial Hospital",
      type: { public: false, private: true, clinic: true },
      fullAddress: "Muhib Road near banazir incomesupport office Skardu, Gilgit-Baltistan",
      location: { latitude: 35.2931433, longitude: 75.6449132 },
      phoneNumbers: ["03554843983"],
      facilities: {
        emergencyServices: true,
        icu: false,
        ccu: false,
        nicu: false,
        operationTheatre: false,
        mriCtScan: false,
        xRay: false,
        ultrasound: false,
        dialysisCenter: false,
        bloodBank: false,
        pharmacyMedicineStore: true,
        laboratoryPathology: true,
        vaccinationCenter: false,
        ambulanceService: false,
        inpatientWard: { available: true, beds: 6 },
        outpatientDepartment: false,
        maternityWard: false,
        dentalUnit: false,
        physiotherapyUnit: false,
        mentalHealthPsychiatryServices: false,
        eyeCareOphthalmologyUnit: false,
        otherFacilities: null
      },
      departments: {
        cardiology: false,
        neurology: false,
        pediatrics: false,
        gynecologyObstetrics: false,
        orthopedics: false,
        generalMedicine: false,
        generalSurgery: false,
        ent: false,
        dermatology: false,
        urology: false,
        nephrology: false,
        gastroenterology: true,
        oncology: false,
        psychiatryPsychology: false,
        ophthalmology: false,
        dentalOralHealth: false,
        pulmonology: false,
        endocrinology: false,
        physiotherapyRehabilitation: false,
        otherDepartments: null
      },
      doctors: [
        {
          doctorName: "Dr. Sajjad Hussain",
          specialization: "Gastroenterologist & Hepatologist",
          availabilityTimings: "Mon-Sat, 4:00 PM - 10:00 PM",
          contactNumber: "03411084148",
          averagePatientsPerDay: 30,
          treatsDiseases: [
            "Hepatitis",
            "Gastritis",
            "Liver Cirrhosis",
            "Peptic Ulcers"
          ]
        }
      ]
    },
    {
      hospitalClinicName: "Dolti Hospital",
      type: { public: false, private: true, clinic: false },
      fullAddress: "Zero point Jamia Masjid road, Skardu",
      location: { latitude: 35.3000, longitude: 75.5900 },
      phoneNumbers: ["05815454499"],
      facilities: {
        emergencyServices: true,
        icu: true,
        ccu: true,
        nicu: true,
        operationTheatre: true,
        mriCtScan: false,
        xRay: true,
        ultrasound: true,
        dialysisCenter: false,
        bloodBank: false,
        pharmacyMedicineStore: true,
        laboratoryPathology: true,
        vaccinationCenter: false,
        ambulanceService: false,
        inpatientWard: { available: true, beds: 40 },
        outpatientDepartment: true,
        maternityWard: true,
        dentalUnit: true,
        physiotherapyUnit: false,
        mentalHealthPsychiatryServices: false,
        eyeCareOphthalmologyUnit: true,
        otherFacilities: null
      },
      departments: {
        cardiology: true,
        neurology: true,
        pediatrics: true,
        gynecologyObstetrics: false,
        orthopedics: false,
        generalMedicine: true,
        generalSurgery: true,
        ent: true,
        dermatology: true,
        urology: true,
        nephrology: true,
        gastroenterology: false,
        oncology: true,
        psychiatryPsychology: false,
        ophthalmology: true,
        dentalOralHealth: true,
        pulmonology: false,
        endocrinology: false,
        physiotherapyRehabilitation: false,
        otherDepartments: null
      },
      doctors: [
        {
          doctorName: "Dr. Muhammad Jamil",
          specialization: "Diagnostic Radiologist",
          availabilityTimings: "Mon-Sat, 3:30 PM - 5:30 PM",
          contactNumber: null,
          averagePatientsPerDay: 20,
          treatsDiseases: [
            "X-ray Analysis",
            "CT Scan Interpretation",
            "MRI Diagnosis",
            "Ultrasound Evaluation"
          ]
        },
        {
          doctorName: "Dr. Ashiq Laghari",
          specialization: "General Surgeon",
          availabilityTimings: "Mon-Sat, 4:30 PM - 7:30 PM",
          contactNumber: null,
          averagePatientsPerDay: 10,
          treatsDiseases: [
            "Appendicitis",
            "Hernia Repair",
            "Gallbladder Removal",
            "Abscess Treatment"
          ]
        },
        {
          doctorName: "Dr. Irshad Ahmed",
          specialization: "Urologist",
          availabilityTimings: "Mon-Sat, 4:00 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 45,
          treatsDiseases: [
            "Urinary Tract Infection",
            "Kidney Stones",
            "Prostate Enlargement",
            "Bladder Disorders"
          ]
        },
        {
          doctorName: "Farzana Batool",
          specialization: "ENT Specialist",
          availabilityTimings: "Mon-Sat, 5:00 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 25,
          treatsDiseases: [
            "Tonsillitis",
            "Sinusitis",
            "Otitis Media",
            "Laryngitis"
          ]
        },
        {
          doctorName: "Mubashir Raza",
          specialization: "Child Specialist",
          availabilityTimings: "Mon-Sat, 4:00 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 40,
          treatsDiseases: [
            "Respiratory Infections",
            "Gastroenteritis",
            "Immunizations",
            "Developmental Delays"
          ]
        },
        {
          doctorName: "Dr. Sayira Shigree",
          specialization: "Gynaecologist",
          availabilityTimings: "Mon-Sat, 5:00 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 40,
          treatsDiseases: [
            "Menstrual Irregularities",
            "Prenatal Care",
            "Infertility",
            "Menopausal Symptoms"
          ]
        },
        {
          doctorName: "Dr. Kazim Raza",
          specialization: "Cancer Specialist",
          availabilityTimings: "Mon-Sat, 4:00 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 0,
          treatsDiseases: [
            "Chemotherapy Management",
            "Radiation Therapy",
            "Tumor Biopsy",
            "Palliative Care"
          ]
        },
        {
          doctorName: "Madiha Essa",
          specialization: "Eye Specialist",
          availabilityTimings: "Mon-Sat, 4:30 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 10,
          treatsDiseases: [
            "Cataracts",
            "Glaucoma",
            "Refractive Errors",
            "Conjunctivitis"
          ]
        },
        {
          doctorName: "Dr. Nasir Hussain",
          specialization: "Medical Specialist",
          availabilityTimings: "Mon-Sat, 4:00 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 25,
          treatsDiseases: [
            "Diabetes Mellitus",
            "Hypertension",
            "Infectious Diseases",
            "Anemia"
          ]
        },
        {
          doctorName: "Dr. Wazir Muhammad Ejaz",
          specialization: "Neuro Surgeon",
          availabilityTimings: "Mon-Sat, 4:00 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 20,
          treatsDiseases: [
            "Brain Tumors",
            "Spinal Disc Herniation",
            "Traumatic Brain Injury",
            "Epilepsy"
          ]
        },
        {
          doctorName: "Dr. Mohsin Raza",
          specialization: "Cardiologist",
          availabilityTimings: "Sat-Sun, 4:00 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 10,
          treatsDiseases: [
            "Coronary Artery Disease",
            "Arrhythmias",
            "Heart Failure",
            "Valvular Heart Disease"
          ]
        },
        {
          doctorName: "Tehmina Irshad",
          specialization: "Radiologist & Diagnostic",
          availabilityTimings: "Mon-Sat, 5:00 PM - 8:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 40,
          treatsDiseases: [
            "Diagnostic Imaging",
            "Fluoroscopy",
            "Mammography",
            "Bone Density Scans"
          ]
        },
        {
          doctorName: "Dr. Essa Ali",
          specialization: "Anesthetist",
          availabilityTimings: "On Call",
          contactNumber: null,
          averagePatientsPerDay: null,
          treatsDiseases: [
            "General Anesthesia",
            "Regional Anesthesia",
            "Pain Control",
            "Sedation"
          ]
        },
        {
          doctorName: "Dr. Zoya Naeem",
          specialization: "Consultant Gynecologist",
          availabilityTimings: "Mon-Sat, 10:30 AM - 3:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 10,
          treatsDiseases: [
            "High-Risk Pregnancy",
            "Endometriosis",
            "Uterine Fibroids",
            "Polycystic Ovary Syndrome"
          ]
        },
        {
          doctorName: "Dr. Zill E Huma",
          specialization: "Dental Surgeon",
          availabilityTimings: "Mon-Sat, 10:30 AM - 3:00 PM",
          contactNumber: null,
          averagePatientsPerDay: 10,
          additionalNotes: {
            challengesFaced: "Remote location access issues",
            specialServices: "Mobile health camps",
            patientOrigin: "Shigar, surrounding villages"
          },
          treatsDiseases: [
            "Dental Caries",
            "Periodontitis",
            "Oral Surgery",
            "Orthodontics"
          ]
        }
      ]
    },
    {
      hospitalClinicName: "City Hospital Skardu",
      type: { public: false, private: true, clinic: true },
      fullAddress: "Near calaftan pool sharja quaid azam road skardu",
      location: { latitude: 35.4250, longitude: 75.6500 },
      phoneNumbers: ["03554309529"],
      facilities: {
        emergencyServices: true,
        icu: true,
        ccu: false,
        nicu: false,
        operationTheatre: false,
        mriCtScan: false,
        xRay: false,
        ultrasound: false,
        dialysisCenter: false,
        bloodBank: false,
        pharmacyMedicineStore: true,
        laboratoryPathology: false,
        vaccinationCenter: false,
        ambulanceService: false,
        inpatientWard: { available: true, beds: 7 },
        outpatientDepartment: true,
        maternityWard: true,
        dentalUnit: false,
        physiotherapyUnit: false,
        mentalHealthPsychiatryServices: false,
        eyeCareOphthalmologyUnit: false,
        otherFacilities: null
      },
      departments: {
        cardiology: false,
        neurology: false,
        pediatrics: false,
        gynecologyObstetrics: false,
        orthopedics: false,
        generalMedicine: true,
        generalSurgery: false,
        ent: true,
        dermatology: false,
        urology: false,
        nephrology: false,
        gastroenterology: false,
        oncology: false,
        psychiatryPsychology: false,
        ophthalmology: false,
        dentalOralHealth: false,
        pulmonology: false,
        endocrinology: false,
        physiotherapyRehabilitation: false,
        "child specialist": true,
        otherDepartments: null
      },
      doctors: [
        {
          doctorName: "Dr. Zahoor Ahmed",
          specialization: "General Medical",
          availabilityTimings: "Sun-Sat, 4:30 PM - 9:00 PM",
          contactNumber: "03554309529",
          averagePatientsPerDay: "20-25",
          treatsDiseases: [
            "Diabetes Mellitus",
            "Hypertension",
            "Infectious Diseases",
            "Anemia"
          ]
        },
        {
          doctorName: "Dr. Farzana",
          specialization: "ENT",
          availabilityTimings: "Mon-Sat, 4:30 PM - 6:00 PM",
          contactNumber: "03554309529",
          averagePatientsPerDay: "10-15",
          treatsDiseases: [
            "Tonsillitis",
            "Sinusitis",
            "Otitis Media",
            "Laryngitis"
          ]
        },
        {
          doctorName: "Dr. Azher",
          specialization: "Child Specialist",
          availabilityTimings: "Mon-Sat, 4:30 PM - 7:30 PM",
          contactNumber: "03554309529",
          averagePatientsPerDay: "10-15",
          additionalNotes: {
            challengesFaced: "Remote location access issues",
            specialServices: "Mobile health camps",
            patientOrigin: "Shigar, surrounding villages"
          },
          treatsDiseases: [
            "Respiratory Infections",
            "Gastroenteritis",
            "Immunizations",
            "Developmental Delays"
          ]
        }
      ]
    },
    {
      hospitalClinicName: "Abbas Memorial Hospital",
      type: { public: false, private: true, clinic: true },
      fullAddress: "Near calaftan pool sharja quaid azam road skardu",
      location: { latitude: 35.4250, longitude: 75.6500 },
      phoneNumbers: ["03555743016"],
      facilities: {
        emergencyServices: false,
        icu: true,
        ccu: false,
        nicu: false,
        operationTheatre: true,
        mriCtScan: false,
        xRay: false,
        ultrasound: true,
        dialysisCenter: false,
        bloodBank: false,
        pharmacyMedicineStore: true,
        laboratoryPathology: true,
        vaccinationCenter: false,
        ambulanceService: false,
        inpatientWard: { available: true, beds: 5 },
        outpatientDepartment: true,
        maternityWard: true,
        dentalUnit: false,
        physiotherapyUnit: false,
        mentalHealthPsychiatryServices: false,
        eyeCareOphthalmologyUnit: false,
        otherFacilities: null
      },
      departments: {
        cardiology: false,
        neurology: false,
        pediatrics: false,
        gynecologyObstetrics: false,
        orthopedics: false,
        generalMedicine: false,
        generalSurgery: false,
        ent: false,
        dermatology: false,
        urology: true,
        Radiology: true,
        gastroenterology: true,
        oncology: false,
        psychiatryPsychology: false,
        ophthalmology: false,
        dentalOralHealth: false,
        pulmonology: false,
        endocrinology: false,
        physiotherapyRehabilitation: false,
        "child specialist": false,
        otherDepartments: null
      },
      doctors: [
        {
          doctorName: "Dr. Tatheer Abbas",
          specialization: "Urologist",
          availabilityTimings: "Mon-Sat, 5:00 PM - 9:00 PM",
          contactNumber: null,
          averagePatientsPerDay: "15-20",
          treatsDiseases: [
            "Urinary Tract Infection",
            "Kidney Stones",
            "Prostate Enlargement",
            "Bladder Disorders"
          ]
        },
        {
          doctorName: "Dr. Tanzeela Iram",
          specialization: "Gynaecologist & Obstetrical",
          availabilityTimings: "Mon-Sat, 5:00 PM - 9:00 PM",
          contactNumber: null,
          averagePatientsPerDay: "10-15",
          treatsDiseases: [
            "Menstrual Irregularities",
            "Prenatal Care",
            "Infertility",
            "Menopausal Symptoms"
          ]
        },
        {
          doctorName: "Dr. Nazneen",
          specialization: "Radiology",
          availabilityTimings: "Mon-Sat, 5:00 PM - 9:00 PM",
          contactNumber: null,
          averagePatientsPerDay: "10-15",
          additionalNotes: {
            challengesFaced: "Remote location access issues",
            specialServices: "Mobile health camps",
            patientOrigin: "Shigar, surrounding villages"
          },
          treatsDiseases: [
            "Diagnostic Imaging",
            "Fluoroscopy",
            "Mammography",
            "Bone Density Scans"
          ]
        }
      ]
    },


    {
      hospitalClinicName: "Doctors Hospital Skardu",
      type: { public: false, private: true, clinic: false },
      fullAddress: "Opposite to Degree College for Women, Jamia Masjid Road, Skardu",
      location: { latitude: 35.57, longitude: 465.54 },
      phoneNumbers: ["05815456677", "05815450099"],
      facilities: {
        emergencyServices: false,
        icu: false,
        ccu: false,
        nicu: false,
        operationTheatre: true,
        mriCtScan: false,
        xRay: true,
        ultrasound: true,
        dialysisCenter: true,
        bloodBank: false,
        pharmacyMedicineStore: true,
        laboratoryPathology: true,
        vaccinationCenter: false,
        ambulanceService: false,
        inpatientWard: { available: true, beds: 50 },
        outpatientDepartment: false,
        maternityWard: false,
        dentalUnit: false,
        physiotherapyUnit: false,
        mentalHealthPsychiatryServices: false,
        eyeCareOphthalmologyUnit: false,
        otherFacilities: "ENT, etc"
      },
      departments: {
        cardiology: false,
        neurology: false,
        pediatrics: false,
        gynecologyObstetrics: false,
        orthopedics: false,
        generalMedicine: false,
        generalSurgery: false,
        ent: false,
        dermatology: false,
        urology: false,
        nephrology: false,
        gastroenterology: false,
        oncology: false,
        psychiatryPsychology: false,
        ophthalmology: false,
        dentalOralHealth: false,
        pulmonology: false,
        endocrinology: false,
        physiotherapyRehabilitation: false,
        radiology: true,
        otherDepartments: null
      },
      doctors: [
        {
          doctorName: "Dr. Ehsan Ali",
          specialization: "ENT",
          availabilityTimings: "On Call",
          contactNumber: "+923129902072",
          averagePatientsPerDay: "OT, 2"
        },
        {
          doctorName: "Dr. Muhammad Jafar",
          specialization: "Medical Specialist",
          availabilityTimings: "4:30 PM - 8:30 PM",
          contactNumber: "+92454758448",
          averagePatientsPerDay: "15"
        },
        {
          doctorName: "Dr. Zulfiqar Ali Haidri",
          specialization: "Child Specialist and Neonatologist",
          availabilityTimings: "4:30 PM - 8:30 PM",
          contactNumber: "+923423103224",
          averagePatientsPerDay: "50"
        },
        {
          doctorName: "Dr. Ashiq Hussain Laghari",
          specialization: "Consultant Surgical Specialist",
          availabilityTimings: "5:30 PM - 8:30 PM",
          contactNumber: "+923468330840",
          averagePatientsPerDay: "10"
        },
        {
          doctorName: "Dr. Mehdi Ali Mehdivi",
          specialization: "Consultant Orthopedic Surgeon",
          availabilityTimings: "5:30 PM - 9:00 PM",
          contactNumber: "+923334775427",
          averagePatientsPerDay: "30"
        },
        {
          doctorName: "Dr. Nida Fatima",
          specialization: "Consultant Gynecologist",
          availabilityTimings: "5:00 PM - 7:30 PM",
          contactNumber: "+923454758448",
          averagePatientsPerDay: "30"
        },
        {
          doctorName: "Dr. Muhammad Habib",
          specialization: "Consultant Neurologist",
          availabilityTimings: "6:00 PM - 9:00 PM",
          contactNumber: "+923469554966",
          averagePatientsPerDay: "12"
        },
        {
          doctorName: "Dr. Muhammad Jameel",
          specialization: "Consultant Radiologist",
          availabilityTimings: "6:00 PM - 9:30 PM",
          contactNumber: "+923458355389",
          averagePatientsPerDay: "22"
        },
        {
          doctorName: "Dr. Athar Ali Haidri",
          specialization: "Consultant Nephrologist / Medical Specialist",
          availabilityTimings: "6:00 PM - 8:00 PM",
          contactNumber: "+923555998939",
          averagePatientsPerDay: "8"
        }
      ],
      additionalNotes: {
        challengesFaced: "",
        specialServices: "Only for poor",
        patientOrigin: "Skardu, Roundu, Khaplu, Shigar"
      }
    },



  // Al-Abbas Hospital Skardu
  {
    hospitalClinicName: "Al-Abbas Hospital Skardu",
    type: { public: false, private: true, clinic: false },
    fullAddress: "Sukamaidan Road, Skardu",
    location: { latitude: 35.57, longitude: 465.54 },
    phoneNumbers: ["05815455518"],
    facilities: {
      emergencyServices: false,
      icu: false,
      ccu: false,
      nicu: false,
      operationTheatre: true,
      mriCtScan: false,
      xRay: true,
      ultrasound: true,
      dialysisCenter: false,
      bloodBank: false,
      pharmacyMedicineStore: true,
      laboratoryPathology: true,
      vaccinationCenter: false,
      ambulanceService: false,
      inpatientWard: { available: true, beds: 8 },
      outpatientDepartment: false,
      maternityWard: false,
      dentalUnit: true,
      physiotherapyUnit: false,
      mentalHealthPsychiatryServices: false,
      eyeCareOphthalmologyUnit: false,
      otherFacilities: null
    },
    departments: {
      cardiology: false,
      neurology: false,
      pediatrics: false,
      gynecologyObstetrics: false,
      orthopedics: false,
      generalMedicine: false,
      generalSurgery: false,
      ent: false,
      dermatology: false,
      urology: false,
      nephrology: false,
      gastroenterology: false,
      oncology: false,
      psychiatryPsychology: false,
      ophthalmology: false,
      dentalOralHealth: false,
      pulmonology: false,
      endocrinology: false,
      physiotherapyRehabilitation: false,
      radiology: false,
      otherDepartments: null
    },
    doctors: [],
    additionalNotes: {
      challengesFaced: "",
      specialServices: "Free for all",
      patientOrigin: "Skardu, Roundu, Khaplu, Shigar"
    },
    challanFee: 100
  },

  // Darul Shifa Hazarat Abbas Hospital Skardu
  {
    hospitalClinicName: "Darul Shifa Hazarat Abbas Hospital Skardu",
    type: { public: false, private: true, clinic: false },
    fullAddress: "Imambargah Kalam Skardu",
    location: { latitude: 35.57, longitude: 465.54 },
    phoneNumbers: [],
    facilities: {
      emergencyServices: true,
      icu: true,
      ccu: false,
      nicu: true,
      operationTheatre: true,
      mriCtScan: false,
      xRay: true,
      ultrasound: true,
      dialysisCenter: false,
      bloodBank: false,
      pharmacyMedicineStore: true,
      laboratoryPathology: true,
      vaccinationCenter: true,
      ambulanceService: true,
      inpatientWard: { available: true, beds: 37 },
      outpatientDepartment: true,
      maternityWard: true,
      dentalUnit: false,
      physiotherapyUnit: false,
      mentalHealthPsychiatryServices: false,
      eyeCareOphthalmologyUnit: false,
      otherFacilities: null
    },
    departments: {
      cardiology: false,
      neurology: false,
      pediatrics: true,
      gynecologyObstetrics: true,
      orthopedics: false,
      generalMedicine: false,
      generalSurgery: false,
      ent: false,
      dermatology: false,
      urology: false,
      nephrology: false,
      gastroenterology: false,
      oncology: false,
      psychiatryPsychology: false,
      ophthalmology: false,
      dentalOralHealth: false,
      pulmonology: false,
      endocrinology: false,
      physiotherapyRehabilitation: false,
      radiology: true,
      child: true,
      otherDepartments: null
    },
    doctors: [
      {
        doctorName: "Dr. Syeda Shargila",
        specialization: "Child",
        availabilityTiming: "8:00 AM to 2:00 PM",
        contactNumber: "",
        averagePatientsPerDay: 30
      },
      {
        doctorName: "Dr. Rohmanayar",
        specialization: "Gynaecologist Specialist",
        availabilityTiming: "8:00 AM - 2:00 PM",
        contactNumber: "",
        averagePatientsPerDay: 35
      },
      {
        doctorName: "Dr. Syed Shahid",
        specialization: "MO",
        availabilityTiming: "2:00 PM - 7:00 PM",
        contactNumber: "",
        averagePatientsPerDay: 15
      },
      {
        doctorName: "Dr. Iffat Fatima",
        specialization: "LMO",
        availabilityTiming: "8:00 AM - 2:00 PM",
        contactNumber: "",
        averagePatientsPerDay: 35
      }
    ],
    additionalNotes: {
      challengesFaced: "",
      specialServices: "Free for all",
      patientOrigin: "Skardu, Roundu, Khaplu, Shigar"
    },
    challanFee: 100
  }





  ]
};

export default hospitalData;