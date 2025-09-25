// import React, { useMemo } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Bar, Doughnut } from 'react-chartjs-2';
// import hospitalData from '../data/hospitalData';
// import StatsCard from '../components/StatsCard';

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Stats = () => {
//   const stats = useMemo(() => {
//     const hospitals = hospitalData.hospitals;
//     const allDoctors = hospitals.flatMap(h => h.doctors || []);
    
//     const totalHospitals = hospitals.length;
//     const totalDoctors = allDoctors.length;
//     const totalBeds = hospitals.reduce((sum, h) => sum + (h.facilities.inpatientWard?.beds || 0), 0);
//     const emergencyCenters = hospitals.filter(h => h.facilities.emergencyServices).length;
    
//     const patientLoads = allDoctors
//       .filter(d => d.averagePatientsPerDay && typeof d.averagePatientsPerDay === 'number')
//       .map(d => d.averagePatientsPerDay);
    
//     const totalPatientsPerDay = patientLoads.reduce((sum, load) => sum + load, 0);
//     const avgPatientsPerDoctor = patientLoads.length > 0 ? totalPatientsPerDay / patientLoads.length : 0;
    
//     const doctorsBySpecialty = allDoctors.reduce((acc, doctor) => {
//       const specialty = doctor.specialization || 'General';
//       acc[specialty] = (acc[specialty] || 0) + 1;
//       return acc;
//     }, {});
    
//     const facilitiesCount = hospitals.reduce((acc, hospital) => {
//       Object.entries(hospital.facilities).forEach(([key, value]) => {
//         if (value === true && key !== 'otherFacilities') {
//           acc[key] = (acc[key] || 0) + 1;
//         }
//       });
//       return acc;
//     }, {});
    
//     const monthlyPatientProjection = Math.round(totalPatientsPerDay * 25);
//     const yearlyPatientProjection = Math.round(monthlyPatientProjection * 12);
    
//     return {
//       basic: {
//         totalHospitals,
//         totalDoctors,
//         totalBeds,
//         emergencyCenters,
//         totalPatientsPerDay: Math.round(totalPatientsPerDay),
//         avgPatientsPerDoctor: Math.round(avgPatientsPerDoctor),
//         monthlyPatientProjection,
//         yearlyPatientProjection
//       },
//       doctorsBySpecialty,
//       facilitiesCount,
//       patientLoads,
//       topFacilities: Object.entries(facilitiesCount)
//         .sort(([,a], [,b]) => b - a)
//         .slice(0, 5)
//         .map(([key, value]) => ({ name: key.replace(/([A-Z])/g, ' $1').trim(), count: value }))
//     };
//   }, []);

//   // Chart data
//   const patientLoadChartData = {
//     labels: stats.patientLoads.length > 0 
//       ? stats.patientLoads.map((_, i) => `Dr ${i + 1}`)
//       : ['No Data'],
//     datasets: [{
//       label: 'Patients/Day',
//       data: stats.patientLoads.length > 0 ? stats.patientLoads : [0],
//       backgroundColor: 'rgba(26, 118, 210, 0.6)',
//       borderColor: 'rgba(26, 118, 210, 1)',
//       borderWidth: 1
//     }]
//   };

//   const specialtyChartData = {
//     labels: Object.keys(stats.doctorsBySpecialty).slice(0, 8),
//     datasets: [{
//       label: '# of Doctors',
//       data: Object.values(stats.doctorsBySpecialty).slice(0, 8),
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.6)',
//         'rgba(54, 162, 235, 0.6)',
//         'rgba(255, 205, 86, 0.6)',
//         'rgba(75, 192, 192, 0.6)',
//         'rgba(153, 102, 255, 0.6)',
//         'rgba(255, 159, 64, 0.6)',
//         'rgba(199, 199, 199, 0.6)',
//         'rgba(83, 102, 255, 0.6)'
//       ],
//       borderWidth: 0
//     }]
//   };

//   const facilityChartData = {
//     labels: stats.topFacilities.map(f => f.name),
//     datasets: [{
//       label: 'Facilities',
//       data: stats.topFacilities.map(f => f.count),
//       backgroundColor: 'rgba(26, 118, 210, 0.6)',
//       borderColor: 'rgba(26, 118, 210, 1)',
//       borderWidth: 1
//     }]
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Healthcare Statistics' }
//     },
//     scales: { y: { beginAtZero: true } }
//   };

//   return (
//     <div className="container">
//       <h2 className="section-title">Healthcare Analytics Dashboard</h2>
      
//       <div className="stats">
//         <StatsCard icon="fas fa-hospital" title="Total Facilities" value={stats.basic.totalHospitals} color="primary" />
//         <StatsCard icon="fas fa-user-md" title="Doctors" value={stats.basic.totalDoctors} color="success" />
//         <StatsCard icon="fas fa-bed" title="Total Beds" value={stats.basic.totalBeds} color="warning" />
//         <StatsCard icon="fas fa-ambulance" title="Emergency Centers" value={stats.basic.emergencyCenters} color="danger" />
//         <StatsCard icon="fas fa-users" title="Daily Patients" value={stats.basic.totalPatientsPerDay} color="info" />
//         <StatsCard icon="fas fa-calendar" title="Monthly Projection" value={stats.basic.monthlyPatientProjection} color="secondary" />
//       </div>

//       <div className="stats-charts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', margin: '2rem 0' }}>
//         <div className="chart-container" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)' }}>
//           <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Patient Load Distribution</h3>
//           <div style={{ height: '300px' }}>
//             <Bar data={patientLoadChartData} options={chartOptions} />
//           </div>
//         </div>

//         <div className="chart-container" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)' }}>
//           <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Doctors by Specialty</h3>
//           <div style={{ height: '300px' }}>
//             <Doughnut data={specialtyChartData} options={chartOptions} />
//           </div>
//         </div>

//         <div className="chart-container" style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)' }}>
//           <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Top Facilities</h3>
//           <div style={{ height: '300px' }}>
//             <Bar data={facilityChartData} options={chartOptions} />
//           </div>
//         </div>
//       </div>

//       <div className="kpi-section" style={{ 
//         background: 'linear-gradient(135deg, var(--primary), #0d47a1)', 
//         color: 'white', 
//         padding: '2rem', 
//         borderRadius: 'var(--border-radius)', 
//         margin: '2rem 0' 
//       }}>
//         <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Key Performance Indicators</h3>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
//           <div style={{ textAlign: 'center' }}>
//             <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
//               {((stats.basic.emergencyCenters / stats.basic.totalHospitals) * 100).toFixed(1)}%
//             </div>
//             <div>Emergency Coverage</div>
//           </div>
//           <div style={{ textAlign: 'center' }}>
//             <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
//               {Math.round(stats.basic.totalBeds / stats.basic.totalHospitals)}
//             </div>
//             <div>Beds per Facility</div>
//           </div>
//           <div style={{ textAlign: 'center' }}>
//             <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
//               {stats.basic.avgPatientsPerDoctor.toFixed(1)}
//             </div>
//             <div>Patients per Doctor</div>
//           </div>
//           <div style={{ textAlign: 'center' }}>
//             <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
//               {stats.basic.yearlyPatientProjection.toLocaleString()}
//             </div>
//             <div>Annual Patients</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Stats;



import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Doughnut } from 'react-chartjs-2';
import hospitalData from '../data/hospitalData';
import StatsCard from '../components/StatsCard';

// Register Chart.js + DataLabels
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Stats = () => {
  const stats = useMemo(() => {
    const hospitals = hospitalData.hospitals || [];
    const allDoctors = hospitals.flatMap(h => h.doctors || []);

    const totalHospitals = hospitals.length;
    const totalDoctors = allDoctors.length;
    const totalBeds = hospitals.reduce(
      (sum, h) => sum + (h.facilities?.inpatientWard?.beds || 0),
      0
    );
    const emergencyCenters = hospitals.filter(
      h => h.facilities?.emergencyServices
    ).length;

    // Normalize doctors
    const doctorList = allDoctors
      .map(d => ({
        name: d.doctorName || d.name || 'Unknown',
        patients: Number(d.averagePatientsPerDay) || 0,
        specialization: d.specialization || 'General'
      }))
      .filter(d => d.name);

    const totalPatientsPerDay = doctorList.reduce(
      (s, d) => s + d.patients,
      0
    );
    const avgPatientsPerDoctor = doctorList.length
      ? totalPatientsPerDay / doctorList.length
      : 0;

    // Doctors by specialty
    const doctorsBySpecialty = allDoctors.reduce((acc, doctor) => {
      const specialty = doctor.specialization || 'General';
      acc[specialty] = (acc[specialty] || 0) + 1;
      return acc;
    }, {});

    // Facilities count
    const facilitiesCount = hospitals.reduce((acc, hospital) => {
      Object.entries(hospital.facilities || {}).forEach(([key, value]) => {
        if (value === true && key !== 'otherFacilities') {
          acc[key] = (acc[key] || 0) + 1;
        }
      });
      return acc;
    }, {});

    // Facility type counts (Hospitals vs Clinics)
    const facilityTypeCount = hospitals.reduce(
      (acc, h) => {
        if (h.type?.clinic) acc.clinics = (acc.clinics || 0) + 1;
        else acc.hospitals = (acc.hospitals || 0) + 1;
        return acc;
      },
      { hospitals: 0, clinics: 0 }
    );

    const monthlyPatientProjection = Math.round(totalPatientsPerDay * 25);
    const yearlyPatientProjection = Math.round(monthlyPatientProjection * 12);

    // Top doctors
    const sortedByPatients = [...doctorList].sort(
      (a, b) => b.patients - a.patients
    );
    const top3Doctors = sortedByPatients.slice(0, 3);
    const top3Sum = top3Doctors.reduce((s, d) => s + d.patients, 0);
    const othersSum = Math.max(0, totalPatientsPerDay - top3Sum);
    const doctorWithMostPatients = top3Doctors[0] || {
      name: 'No Data',
      patients: 0
    };

    return {
      basic: {
        totalHospitals,
        totalDoctors,
        totalBeds,
        emergencyCenters,
        totalPatientsPerDay: Math.round(totalPatientsPerDay),
        avgPatientsPerDoctor: Math.round(avgPatientsPerDoctor),
        monthlyPatientProjection,
        yearlyPatientProjection
      },
      doctorsBySpecialty,
      facilitiesCount,
      facilityTypeCount,
      doctorList,
      top3Doctors,
      othersSum,
      doctorWithMostPatients,
      topFacilities: Object.entries(facilitiesCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([key, value]) => ({
          name: key.replace(/([A-Z])/g, ' $1').trim(),
          count: value
        }))
    };
  }, []);

  // Shared chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        color: '#000',
        font: { weight: 'bold' },
        formatter: (value) => (value > 0 ? value : '')
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.label}: ${ctx.raw} patients`
        }
      }
    },
    scales: { y: { beginAtZero: true } }
  };

  // Patient load per doctor
  const patientLoadChartData = {
    labels: stats.doctorList.map(d => d.name),
    datasets: [
      {
        label: 'Patients/Day',
        data: stats.doctorList.map(d => d.patients),
        backgroundColor: 'rgba(26, 118, 210, 0.6)',
        borderColor: 'rgba(26, 118, 210, 1)',
        borderWidth: 1
      }
    ]
  };

  // Top doctors doughnut
  const topDoctorsChartData = {
    labels: [
      ...stats.top3Doctors.map(d => d.name),
      ...(stats.othersSum > 0 ? ['Others'] : [])
    ],
    datasets: [
      {
        data: [
          ...stats.top3Doctors.map(d => d.patients),
          ...(stats.othersSum > 0 ? [stats.othersSum] : [])
        ],
        backgroundColor: ['#42a5f5', '#66bb6a', '#ffa726', '#bdbdbd'],
        hoverOffset: 8
      }
    ]
  };

  // Doctors by specialty
  const specialtyChartData = {
    labels: Object.keys(stats.doctorsBySpecialty).slice(0, 8),
    datasets: [
      {
        label: '# of Doctors',
        data: Object.values(stats.doctorsBySpecialty).slice(0, 8),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)'
        ]
      }
    ]
  };

  // Top facilities
  const facilityChartData = {
    labels: stats.topFacilities.map(f => f.name),
    datasets: [
      {
        label: 'Facilities',
        data: stats.topFacilities.map(f => f.count),
        backgroundColor: 'rgba(26, 118, 210, 0.6)',
        borderColor: 'rgba(26, 118, 210, 1)',
        borderWidth: 1
      }
    ]
  };

  // Facility type (hospitals vs clinics)
  const facilityTypeData = {
    labels: ['Hospitals', 'Clinics'],
    datasets: [
      {
        data: [
          stats.facilityTypeCount.hospitals,
          stats.facilityTypeCount.clinics
        ],
        backgroundColor: ['#4caf50', '#ff9800'],
        hoverOffset: 8
      }
    ]
  };

  return (
    <div className="container">
      <h2 className="section-title">Healthcare Analytics Dashboard</h2>

      {/* KPI Cards */}
      <div className="stats">
        <StatsCard icon="fas fa-hospital" title="Total Facilities" value={stats.basic.totalHospitals} color="primary" />
        <StatsCard icon="fas fa-user-md" title="Doctors" value={stats.basic.totalDoctors} color="success" />
        <StatsCard icon="fas fa-bed" title="Total Beds" value={stats.basic.totalBeds} color="warning" />
        <StatsCard icon="fas fa-ambulance" title="Emergency Centers" value={stats.basic.emergencyCenters} color="danger" />
        <StatsCard icon="fas fa-users" title="Daily Patients" value={stats.basic.totalPatientsPerDay} color="info" />
        <StatsCard icon="fas fa-calendar" title="Monthly Projection" value={stats.basic.monthlyPatientProjection} color="secondary" />
      </div>

      {/* Charts */}
      <div className="stats-charts"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem', margin: '2rem 0' }}
      >
        <div className="chart-container" style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Patient Load Distribution</h3>
          <Bar data={patientLoadChartData} options={chartOptions} />
        </div>

        <div className="chart-container" style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Top 3 Doctors (by Patients)</h3>
          <Doughnut data={topDoctorsChartData} options={chartOptions} />
        </div>

        <div className="chart-container" style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Doctors by Specialty</h3>
          <Doughnut data={specialtyChartData} options={chartOptions} />
        </div>

        <div className="chart-container" style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Top Facilities</h3>
          <Bar data={facilityChartData} options={chartOptions} />
        </div>

        <div className="chart-container" style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>Facility Types</h3>
          <Doughnut data={facilityTypeData} options={chartOptions} />
        </div>
      </div>

      {/* Doctor with most patients */}
      <div style={{ margin: '2rem 0', padding: '1.25rem', background: '#f9fbff', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Doctor with Most Patients</h3>
        <p style={{ fontSize: '1.1rem' }}>
          <strong>{stats.doctorWithMostPatients.name}</strong> sees about <strong>{stats.doctorWithMostPatients.patients}</strong> patients/day.
        </p>
      </div>

      {/* KPI Section */}
      <div className="kpi-section"
        style={{
          background: 'linear-gradient(135deg, var(--primary), #0d47a1)',
          color: 'white',
          padding: '2rem',
          borderRadius: '8px',
          margin: '2rem 0'
        }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Key Performance Indicators</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {((stats.basic.emergencyCenters / Math.max(stats.basic.totalHospitals, 1)) * 100).toFixed(1)}%
            </div>
            <div>Emergency Coverage</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {Math.round(stats.basic.totalBeds / Math.max(stats.basic.totalHospitals, 1))}
            </div>
            <div>Beds per Facility</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.basic.avgPatientsPerDoctor.toFixed(1)}
            </div>
            <div>Patients per Doctor</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {stats.basic.yearlyPatientProjection.toLocaleString()}
            </div>
            <div>Annual Patients</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
