
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import hospitalData from '../data/hospitalData.js';
import medicalTerminology from '../data/medicalTerminology.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyCevWg6kZsh37LOdZhg-f8CAilTBE-xfj0');

const UserMedicalRecord = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [diseases, setDiseases] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [tests, setTests] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const fileToGenerativePart = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const extractDiseasesFromFile = async (file) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Extract all disease names from the medical document and categorize them by system (e.g., neurological, cardiac, gastrointestinal, respiratory, diabetes, hepatitis).
        Return the result in JSON format:
        {
          "fileName": "${file.name}",
          "diseasesBySystem": {
            "neurological": ["array of neurological diseases"],
            "cardiac": ["array of cardiac diseases"],
            "gastrointestinal": ["array of gastrointestinal diseases"],
            "respiratory": ["array of respiratory diseases"],
            "diabetes": ["array of diabetes-related conditions"],
            "hepatitis": ["array of hepatitis-related conditions"],
            "other": ["array of other diseases"]
          }
        }
        Ensure accuracy and only include diseases explicitly mentioned in the document.
      `;
      const imagePart = await fileToGenerativePart(file);
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;

      // Simulate minimum 4-minute processing time
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 240000)); // 4 minutes
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 240000) {
        await new Promise(resolve => setTimeout(resolve, 240000 - elapsedTime));
      }

      try {
        return JSON.parse(response.text().replace(/```json\n?|\n?```/g, ''));
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        return {
          fileName: file.name,
          diseasesBySystem: { other: ['Error extracting diseases. Document may be unclear.'] },
          error: true
        };
      }
    } catch (error) {
      console.error('AI Extraction Error:', error);
      return {
        fileName: file.name,
        diseasesBySystem: { other: [`Error extracting diseases from ${file.name}.`] },
        error: true
      };
    }
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const audioPart = await fileToGenerativePart(audioBlob);
      const prompt = `
        Transcribe the audio content to text accurately.
        Return the result in JSON format:
        {
          "transcription": "transcribed text"
        }
      `;
      const result = await model.generateContent([prompt, audioPart]);
      const response = await result.response;
      try {
        return JSON.parse(response.text().replace(/```json\n?|\n?```/g, '')).transcription;
      } catch (parseError) {
        console.error('Transcription Parse Error:', parseError);
        return "Error transcribing audio.";
      }
    } catch (error) {
      console.error('Audio Transcription Error:', error);
      return "Error transcribing audio.";
    }
  };

  const extractDiseasesFromText = async (text) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Extract all disease names from the provided text and categorize them by system (e.g., neurological, cardiac, gastrointestinal, respiratory, diabetes, hepatitis).
        Return the result in JSON format:
        {
          "fileName": "Voice Recording",
          "diseasesBySystem": {
            "neurological": ["array of neurological diseases"],
            "cardiac": ["array of cardiac diseases"],
            "gastrointestinal": ["array of gastrointestinal diseases"],
            "respiratory": ["array of respiratory diseases"],
            "diabetes": ["array of diabetes-related conditions"],
            "hepatitis": ["array of hepatitis-related conditions"],
            "other": ["array of other diseases"]
          }
        }
        Ensure accuracy and only include diseases explicitly mentioned in the text.
        Text: ${text}
      `;
      const result = await model.generateContent([prompt]);
      const response = await result.response;

      // Simulate minimum 4-minute processing time
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 240000)); // 4 minutes
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 240000) {
        await new Promise(resolve => setTimeout(resolve, 240000 - elapsedTime));
      }

      try {
        return JSON.parse(response.text().replace(/```json\n?|\n?```/g, ''));
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        return {
          fileName: "Voice Recording",
          diseasesBySystem: { other: ['Error extracting diseases from transcribed text.'] },
          error: true
        };
      }
    } catch (error) {
      console.error('Text Extraction Error:', error);
      return {
        fileName: "Voice Recording",
        diseasesBySystem: { other: ['Error extracting diseases from transcribed text.'] },
        error: true
      };
    }
  };

  const findProfessionalDoctors = (diseasesBySystem) => {
    const scoredDoctors = [];
    const allDiseases = Object.values(diseasesBySystem).flat();
    const requiredSpecialties = [];

    if (diseasesBySystem.neurological?.length > 0) requiredSpecialties.push('Neurology');
    if (diseasesBySystem.cardiac?.length > 0) requiredSpecialties.push('Cardiology');
    if (diseasesBySystem.gastrointestinal?.length > 0) requiredSpecialties.push('Gastroenterology');
    if (diseasesBySystem.respiratory?.length > 0) requiredSpecialties.push('Pulmonology');
    if (diseasesBySystem.diabetes?.length > 0) requiredSpecialties.push('Endocrinology');
    if (diseasesBySystem.hepatitis?.length > 0) requiredSpecialties.push('Hepatology');

    hospitalData.hospitals.forEach((hospital) => {
      hospital.doctors.forEach((doctor) => {
        let score = 0;
        let matchReasons = [];

        const doctorSpecialty = doctor.specialty?.toLowerCase() || '';
        const matchesSpecialty = requiredSpecialties.some(specialty =>
          doctorSpecialty.includes(specialty.toLowerCase())
        );

        if (matchesSpecialty) {
          score += 40;
          matchReasons.push('Specialty match');
        }

        const matchesCondition = doctor.treatsDiseases?.some(disease =>
          allDiseases.some(d =>
            d.toLowerCase().includes(disease.toLowerCase()) ||
            disease.toLowerCase().includes(d.toLowerCase())
          )
        );

        if (matchesCondition) {
          score += 35;
          matchReasons.push('Condition expertise');
        }

        if (doctor.experience) {
          const expYears = parseInt(doctor.experience) || 0;
          if (expYears >= 15) score += 15;
          else if (expYears >= 10) score += 12;
          else if (expYears >= 5) score += 8;
          else if (expYears >= 2) score += 5;
          if (expYears > 0) matchReasons.push(`${expYears} years experience`);
        }

        if (doctor.avgPatients && doctor.avgPatients > 20) {
          score += 5;
          matchReasons.push('High patient volume');
        }

        if (doctor.availability && doctor.availability.includes('Mon-Sat')) {
          score += 5;
          matchReasons.push('Good availability');
        }

        if (score > 0) {
          scoredDoctors.push({
            ...doctor,
            hospital: hospital.hospitalClinicName,
            hospitalId: hospital.id,
            score,
            matchPercentage: Math.min(100, score),
            matchReasons,
            exactSpecialtyMatch: matchesSpecialty,
            exactConditionMatch: matchesCondition
          });
        }
      });
    });

    return scoredDoctors.sort((a, b) => {
      if (a.exactSpecialtyMatch && !b.exactSpecialtyMatch) return -1;
      if (!a.exactSpecialtyMatch && b.exactSpecialtyMatch) return 1;
      if (a.exactConditionMatch && !b.exactConditionMatch) return -1;
      if (!a.exactConditionMatch && b.exactConditionMatch) return 1;
      if (b.score !== a.score) return b.score - a.score;
      const aExp = parseInt(a.experience) || 0;
      const bExp = parseInt(b.experience) || 0;
      return bExp - aExp;
    });
  };

  const getComprehensiveTests = (diseasesBySystem) => {
    const testMap = medicalTerminology.tests;
    const tests = [];

    if (diseasesBySystem.neurological?.length > 0) tests.push(...testMap.neurological);
    if (diseasesBySystem.cardiac?.length > 0) tests.push(...testMap.cardiac);
    if (diseasesBySystem.gastrointestinal?.length > 0) tests.push(...testMap.gastrointestinal || testMap.general);
    if (diseasesBySystem.respiratory?.length > 0) tests.push(...testMap.respiratory || testMap.general);
    if (diseasesBySystem.diabetes?.length > 0) tests.push(...testMap.diabetes);
    if (diseasesBySystem.hepatitis?.length > 0) tests.push(...testMap.liver);
    if (diseasesBySystem.other?.length > 0) tests.push(...testMap.general);

    return [...new Set(tests)].slice(0, 10);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (selectedFile && (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.doc') || selectedFile.name.endsWith('.docx'))) {
      setFile(selectedFile);
      setError('');
      setTranscription('');
    } else {
      setFile(null);
      setError('Please upload a PDF, image, or document file.');
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      const elapsedTime = Date.now() - recordingStartTime;
      if (elapsedTime < 240000) {
        setError('Recording must be at least 4 minutes. Please continue recording.');
        return;
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        setRecordingStartTime(Date.now());

        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
          setFile(audioFile);
          setError('');
          const transcriptionText = await transcribeAudio(audioFile);
          setTranscription(transcriptionText);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setError('');
      } catch (err) {
        setError(`Microphone access denied: ${err.message}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a medical record or record audio.');
      return;
    }

    setLoading(true);
    setProgress(20);
    setDiseases(null);
    setDoctors([]);
    setHospitals([]);
    setTests([]);
    setError('');

    try {
      let extracted;
      if (file.type.startsWith('audio/')) {
        const transcriptionText = await transcribeAudio(file);
        setTranscription(transcriptionText);
        extracted = await extractDiseasesFromText(transcriptionText);
      } else {
        extracted = await extractDiseasesFromFile(file);
      }
      setProgress(50);

      setDiseases(extracted);
      const professionalDoctors = findProfessionalDoctors(extracted.diseasesBySystem);
      const topHospitals = new Set();
      professionalDoctors.slice(0, 10).forEach(doctor => topHospitals.add(doctor.hospital));
      const comprehensiveTests = getComprehensiveTests(extracted.diseasesBySystem);

      setDoctors(professionalDoctors);
      setHospitals(Array.from(topHospitals));
      setTests(comprehensiveTests);
      setProgress(100);
    } catch (err) {
      setError(`Error processing input: ${err.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="container">
      <h2 className="section-title">User Medical Record Analysis</h2>
      <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
        <p style={{ marginBottom: '1rem' }}>
          <i className="fas fa-robot" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
          Upload a medical record or record audio to extract disease names and get AI-powered recommendations.
        </p>


        <h1>Record</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
            onChange={handleFileChange}
            style={{ padding: '0.5rem', marginRight: '1rem' }}
          />
          <small style={{ color: '#666', display: 'block', marginBottom: '0.5rem' }}>
            {file ? `Selected: ${file.name}` : 'Supported: Medical reports, lab results (PDF, JPG, PNG, DOC, TXT)'}
          </small>
          <button
            type="button"
            onClick={handleMicClick}
            style={{
              background: isRecording ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              marginRight: '1rem'
            }}
          >
            <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`} style={{ marginRight: '0.5rem' }}></i>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          <button
            type="submit"
            disabled={loading || (isRecording && (Date.now() - recordingStartTime < 240000))}
            style={{
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '4px',
              cursor: loading || (isRecording && (Date.now() - recordingStartTime < 240000)) ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                Analyzing... {progress}%
              </>
            ) : (
              'Analyze'
            )}
          </button>
          {isRecording && (
            <div style={{ marginTop: '0.5rem' }}>
              <i className="fas fa-microphone-alt" style={{ marginRight: '0.5rem' }}></i>
              Recording... Please speak clearly for at least 4 minutes.
            </div>
          )}
          {transcription && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <strong style={{ marginBottom: '0.5rem', display: 'block' }}>Transcribed Text:</strong>
              <p style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{transcription}</p>
            </div>
          )}
        </form>
      </div>
      {error && (
        <div style={{ color: 'red', padding: '0.5rem', background: '#ffe6e6', borderRadius: '4px', marginBottom: '1rem' }}>
          <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
          {error}
        </div>
      )}
      {loading && (
        <div>
          <div style={{ width: '100%', background: '#f0f0f0', borderRadius: '10px', marginBottom: '1rem' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '20px',
                background: 'var(--primary)',
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
          <p>
            <i className="fas fa-file-medical" style={{ marginRight: '0.5rem' }}></i>
            AI is analyzing your input... This will take at least 4 minutes.
          </p>
        </div>
      )}
      {diseases && (
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <i className="fas fa-file-alt" style={{ marginRight: '0.5rem' }}></i>
            Extracted Diseases
          </h3>
          <div
            style={{
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '4px',
              borderLeft: diseases.error ? '4px solid #dc3545' : '4px solid #28a745'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong>{diseases.fileName}</strong>
              <span
                style={{
                  background: diseases.error ? '#dc3545' : '#28a745',
                  color: 'white',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}
              >
                {diseases.error ? 'Extraction Failed' : 'Successfully Processed'}
              </span>
            </div>
            {!diseases.error && (
              <div style={{ fontSize: '0.9rem' }}>
                {Object.entries(diseases.diseasesBySystem).map(([system, diseasesList]) =>
                  diseasesList.length > 0 && (
                    <div key={system} style={{ marginBottom: '0.5rem' }}>
                      <strong>{system.charAt(0).toUpperCase() + system.slice(1)}:</strong>
                      <ul style={{ margin: '0.2rem 0 0 1rem', padding: 0 }}>
                        {diseasesList.map((disease, index) => (
                          <li key={index}>{medicalTerminology.expandAbbreviation(disease) || disease}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {(doctors.length > 0 || hospitals.length > 0 || tests.length > 0) && (
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <i className="fas fa-hand-holding-medical" style={{ marginRight: '0.5rem' }}></i>
            AI-Recommended Healthcare Providers
          </h3>
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                background: '#fff3cd',
                padding: '1rem',
                borderRadius: '4px',
                borderLeft: '4px solid #ffc107',
                marginBottom: '1rem'
              }}
            >
              Matching Criteria: Specialty alignment, condition expertise, experience, patient volume, and availability
            </div>
          </div>
          <h4 style={{ marginBottom: '1rem' }}>
            <i className="fas fa-user-md" style={{ marginRight: '0.5rem' }}></i>
            Recommended Specialists ({doctors.length})
          </h4>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {doctors.slice(0, 8).map((doctor, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: index < 3 ? '#f8f9fa' : 'white',
                  position: 'relative'
                }}
              >
                {index < 3 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      background: index === 0 ? '#ffc107' : index === 1 ? '#6c757d' : '#fd7e14',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}
                  >
                    {index === 0 ? 'BEST MATCH' : index === 1 ? 'SECOND CHOICE' : 'HIGHLY RECOMMENDED'}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>{doctor.name}</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#555' }}>
                      {medicalTerminology.expandAbbreviation(doctor.specialty) || doctor.specialty}
                    </p>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Availability: </strong>{doctor.availability}
                    </div>
                    {doctor.avgPatients && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Average Patients per Day: </strong>{doctor.avgPatients}
                      </div>
                    )}
                    {doctor.treatsDiseases && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Possible Diseases:</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                          {doctor.treatsDiseases.map((disease, idx) => (
                            <li key={idx} style={{ fontSize: '0.9rem' }}>
                              • {medicalTerminology.expandAbbreviation(disease) || disease}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {doctor.contact && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Contact: </strong>{doctor.contact}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      background: '#e8f5e8',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      minWidth: '100px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
                      {doctor.matchPercentage}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Match Score</div>
                  </div>
                </div>
                {doctor.matchReasons?.length > 0 && (
                  <div
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      background: '#f1f8ff',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}
                  >
                    <strong>Match Reasons: </strong>{doctor.matchReasons.join(', ')}
                  </div>
                )}
                {doctor.experience && (
                  <div
                    style={{
                      display: 'inline-block',
                      background: '#17a2b8',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    {doctor.experience} Experience
                  </div>
                )}
              </div>
            ))}
          </div>
          <h4 style={{ margin: '2rem 0 1rem' }}>
            <i className="fas fa-hospital" style={{ marginRight: '0.5rem' }}></i>
            Recommended Medical Facilities ({hospitals.length})
          </h4>
          {hospitals.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {hospitals.slice(0, 5).map((hospital, index) => (
                <li
                  key={index}
                  style={{
                    padding: '0.75rem',
                    background: '#f8f9fa',
                    marginBottom: '0.5rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderLeft: index === 0 ? '4px solid #28a745' : '4px solid #6c757d'
                  }}
                >
                  <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
                  <div>
                    <strong>{hospital}</strong>
                    {index === 0 && (
                      <span style={{ marginLeft: '1rem', color: '#28a745', fontSize: '0.8rem' }}>
                        PRIMARY RECOMMENDATION
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No specialized hospitals found.</p>
          )}
          <h4 style={{ margin: '2rem 0 1rem' }}>
            <i className="fas fa-flask" style={{ marginRight: '0.5rem' }}></i>
            Recommended Diagnostic Tests
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
            {tests.map((test, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  background: index < 3 ? '#e8f5e8' : '#e3f2fd',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderLeft: index < 3 ? '4px solid #28a745' : '4px solid #2196f3'
                }}
              >
                <i
                  className={`fas ${index < 3 ? 'fa-star' : 'fa-check-circle'}`}
                  style={{ marginRight: '0.5rem', color: index < 3 ? '#ffc107' : '#2196f3' }}
                ></i>
                <div>
                  <div style={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                    {medicalTerminology.expandAbbreviation(test) || test}
                  </div>
                  {index < 3 && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>
                      High priority - essential for diagnosis
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMedicalRecord;




