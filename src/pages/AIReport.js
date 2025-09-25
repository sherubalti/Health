


import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import hospitalData from '../data/hospitalData';
import medicalTerminology from '../data/medicalTerminology';

const AIReport = () => {
  const [files, setFiles] = useState([]);
  const [extractedTexts, setExtractedTexts] = useState([]);
  const [consolidatedAnalysis, setConsolidatedAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState({ doctors: [], hospitals: [], tests: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioTranscription, setAudioTranscription] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [hasAudioRecording, setHasAudioRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Modal states for detailed views
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI('AIzaSyAtP-zjYtW2JScRS0L5SKUqVVnkgfS3b0s');

  // Voice recording timer effect
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
    }

    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Modal handlers
  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  const handleHospitalClick = (hospitalName) => {
    const hospital = hospitalData.hospitals.find(h => h.hospitalClinicName === hospitalName);
    setSelectedHospital(hospital);
    setShowHospitalModal(true);
  };

  const handleTestClick = (test) => {
    setSelectedTest(test);
    setShowTestModal(true);
  };

  const closeModals = () => {
    setShowDoctorModal(false);
    setShowHospitalModal(false);
    setShowTestModal(false);
    setSelectedDoctor(null);
    setSelectedHospital(null);
    setSelectedTest(null);
  };

  // Voice recording functions
  const handleMicClick = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          } 
        });
        
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        setRecordingTime(0);
        setAudioTranscription('');
        setDetectedLanguage('');

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: 'audio/webm;codecs=opus' 
          });
          
          // Create a file object from the audio blob
          const audioFile = new File([audioBlob], 'medical-voice-recording.webm', { 
            type: 'audio/webm' 
          });
          
          // Add to files array
          setFiles(prev => [...prev, audioFile]);
          setHasAudioRecording(true);
          setDocumentCount(prev => prev + 1);
          
          // Auto-transcribe the audio with language detection
          setLoading(true);
          setProgress(20);
          const transcriptionResult = await transcribeAudioWithLanguageDetection(audioFile);
          setAudioTranscription(transcriptionResult.transcription);
          setDetectedLanguage(transcriptionResult.language);
          setLoading(false);
          
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start(1000);
        setIsRecording(true);
        setError('');
      } catch (err) {
        setError(`Microphone access denied: ${err.message}`);
      }
    }
  };

  const detectLanguage = async (text) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Detect the language of the following text. Return ONLY the language name in English.
        Options: English, Urdu, Mixed (English and Urdu)
        
        Text: "${text.substring(0, 500)}"
        
        Return format: "English", "Urdu", or "Mixed"
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Language detection error:', error);
      return 'Unknown';
    }
  };

  const translateUrduToEnglish = async (urduText) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        Translate the following Urdu medical text to English. Preserve medical terminology and be accurate with symptoms and conditions.
        
        URDU TEXT: "${urduText}"
        
        Return only the English translation. Be precise with medical terms.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Translation error:', error);
      return urduText; // Return original if translation fails
    }
  };

  const transcribeAudioWithLanguageDetection = async (audioBlob) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const audioPart = await fileToGenerativePart(audioBlob);
      
      // First, transcribe with language support
      const prompt = `
        Transcribe this medical audio recording accurately. The speaker may be using English, Urdu, or a mix of both.
        Focus on medical terms, symptoms, conditions, and patient descriptions.
        Return the transcription in the original language(s). If it's Urdu or mixed, transcribe exactly what you hear.
        
        Important: Be precise with medical terminology in any language.
      `;
      
      const result = await model.generateContent([prompt, audioPart]);
      const response = await result.response;
      const rawTranscription = response.text();
      
      // Detect language
      const language = await detectLanguage(rawTranscription);
      
      let finalTranscription = rawTranscription;
      let needsTranslation = false;
      
      // If Urdu or mixed, translate to English for analysis
      if (language.includes('Urdu') || language === 'Mixed') {
        needsTranslation = true;
        finalTranscription = await translateUrduToEnglish(rawTranscription);
      }
      
      return {
        transcription: finalTranscription,
        originalTranscription: rawTranscription,
        language: language,
        translated: needsTranslation
      };
    } catch (error) {
      console.error('Audio Transcription Error:', error);
      return {
        transcription: "Error transcribing audio. Please try again.",
        language: 'Error',
        translated: false
      };
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const validFiles = selectedFiles.filter(file =>
        file.type === 'application/pdf' ||
        file.type.startsWith('image/') ||
        file.type === 'text/plain' ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx') ||
        file.type.startsWith('audio/')
      );
      
      if (validFiles.length > 0) {
        setFiles(validFiles);
        setError('');
        setDocumentCount(validFiles.length);
        
        // Check if any audio files were added
        const hasAudio = validFiles.some(file => file.type.startsWith('audio/'));
        setHasAudioRecording(hasAudio);
      } else {
        setError('Please upload PDF, image, document, or audio files only.');
      }
    }
  };

  const fileToGenerativePart = async (file) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
    
    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    };
  };

  const extractTextWithAI = async (file) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let prompt = "";
      if (file.type.startsWith('audio/')) {
        prompt = "Transcribe this medical audio recording accurately. The speaker may use English, Urdu, or mixed language. Preserve exact medical terminology, symptoms, conditions, and patient descriptions.";
      } else {
        prompt = "Extract all medical text accurately. Preserve exact formatting, numbers, medical terminology, test results, values, dates, and clinical comments.";
      }
      
      const imagePart = await fileToGenerativePart(file);
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      
      let content = response.text();
      let language = 'English';
      let translated = false;
      
      // For audio files, detect language and translate if needed
      if (file.type.startsWith('audio/')) {
        const detectedLang = await detectLanguage(content);
        if (detectedLang.includes('Urdu') || detectedLang === 'Mixed') {
          const englishTranslation = await translateUrduToEnglish(content);
          content = englishTranslation;
          language = detectedLang;
          translated = true;
        }
      }
      
      return {
        fileName: file.name,
        content: content,
        fileType: file.type,
        isAudio: file.type.startsWith('audio/'),
        language: language,
        translated: translated
      };
    } catch (error) {
      console.error('AI Extraction Error:', error);
      return {
        fileName: file.name,
        content: `Error extracting text from ${file.name}. Please ensure the document is clear and readable.`,
        error: true
      };
    }
  };

  const analyzeSingleDocument = async (text, fileName, isAudio = false, language = 'English') => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const languageContext = language.includes('Urdu') ? 
        `(Originally spoken in ${language}, translated to English for analysis)` : 
        `(Language: ${language})`;
      
      const prompt = isAudio ? `
      Analyze this medical voice recording transcription thoroughly and provide a detailed analysis in JSON format.

      RECORDING: ${fileName}
      LANGUAGE: ${languageContext}
      
      MEDICAL ANALYSIS REQUIREMENTS:
      - Identify described symptoms and health concerns
      - Extract mentioned medical conditions or diseases
      - Assess urgency level based on described symptoms (low/medium/high/critical)
      - Identify required medical specialties based on symptoms
      - Note any medications or treatments mentioned
      - Highlight concerning symptoms that need immediate attention
      - Consider cultural context if original language was Urdu

      Required JSON format:
      {
        "documentName": "${fileName}",
        "documentType": "voice_recording",
        "originalLanguage": "${language}",
        "primaryCondition": "main described condition",
        "secondaryConditions": ["array of other conditions mentioned"],
        "urgency": "low/medium/high/critical",
        "keyFindings": ["array of key symptoms and findings"],
        "clinicalInterpretation": "detailed clinical analysis of described symptoms",
        "requiredSpecialties": ["array of medical specialties needed"],
        "recommendedActions": ["array of recommended actions"],
        "riskLevel": "low/medium/high",
        "culturalNotes": "any cultural or linguistic considerations"
      }

      Voice Recording Transcription:
      ${text.substring(0, 3000)}
      ` : `
      Analyze this medical document thoroughly and provide a detailed analysis in JSON format.

      DOCUMENT: ${fileName}
      
      MEDICAL ANALYSIS REQUIREMENTS:
      - Identify primary health conditions or diseases
      - Extract all test results with values and reference ranges
      - Note abnormal findings and their clinical significance
      - Assess urgency level (low/medium/high/critical)
      - Identify required medical specialties
      - Note any medications or treatments mentioned
      - Highlight concerning findings that need immediate attention

      Required JSON format:
      {
        "documentName": "${fileName}",
        "documentType": "medical_document",
        "primaryCondition": "main diagnosed condition",
        "secondaryConditions": ["array of other conditions"],
        "urgency": "low/medium/high/critical",
        "keyFindings": ["array of key medical findings"],
        "testResults": {"test_name": {"value": "result", "status": "normal/abnormal"}},
        "clinicalInterpretation": "detailed clinical analysis",
        "requiredSpecialties": ["array of medical specialties needed"],
        "recommendedActions": ["array of recommended actions"],
        "riskLevel": "low/medium/high"
      }

      Medical Document Text:
      ${text.substring(0, 3000)}
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      try {
        const analysis = JSON.parse(response.text().replace(/```json\n?|\n?```/g, ''));
        return analysis;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        return createBasicAnalysis(text, fileName, isAudio, language);
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return createBasicAnalysis(text, fileName, isAudio, language);
    }
  };

  const createBasicAnalysis = (text, fileName, isAudio = false, language = 'English') => {
    const lowerText = text.toLowerCase();
    let condition = 'Requires Professional Evaluation';
    let urgency = 'medium';
    const findings = [];

    // Common medical terms in Urdu (translated equivalents)
    const urduMedicalTerms = {
      'dard': 'pain',
      'bukhar': 'fever',
      'chakkar': 'dizziness',
      'ult': 'vomiting',
      'dast': 'diarrhea',
      'khansi': 'cough',
      'sans': 'breath',
      'dil': 'heart',
      'jigar': 'liver',
      'gurda': 'kidney',
      'shugar': 'diabetes',
      'bp': 'blood pressure'
    };

    // Replace common Urdu medical terms if detected
    let processedText = lowerText;
    if (language.includes('Urdu')) {
      Object.keys(urduMedicalTerms).forEach(urduTerm => {
        const regex = new RegExp(urduTerm, 'gi');
        processedText = processedText.replace(regex, urduMedicalTerms[urduTerm]);
      });
    }

    if (processedText.includes('hbs ag') && processedText.includes('reactive')) {
      condition = 'Hepatitis B Infection';
      urgency = 'high';
      findings.push('HBs Ag Reactive - Possible Hepatitis B infection detected');
    }
    
    if (processedText.includes('diabetes') || processedText.includes('glucose') || processedText.includes('sugar') || processedText.includes('shugar')) {
      condition = condition === 'Requires Professional Evaluation' ? 'Diabetes' : condition + ', Diabetes';
      findings.push('Blood glucose related findings noted');
    }

    if (processedText.includes('tia') || processedText.includes('transient ischemic attack') || processedText.includes('stroke')) {
      condition = condition === 'Requires Professional Evaluation' ? 'Transient Ischemic Attack' : condition + ', Transient Ischemic Attack';
      urgency = urgency === 'critical' ? 'critical' : 'high';
      findings.push('Possible neurological event detected - requires urgent evaluation');
    }

    if (processedText.includes('chest pain') || processedText.includes('heart') || processedText.includes('cardiac') || processedText.includes('dil')) {
      condition = condition === 'Requires Professional Evaluation' ? 'Cardiac Symptoms' : condition + ', Cardiac Symptoms';
      urgency = 'high';
      findings.push('Cardiac symptoms mentioned');
    }

    if (processedText.includes('fever') || processedText.includes('infection') || processedText.includes('cough') || processedText.includes('bukhar') || processedText.includes('khansi')) {
      findings.push('Infection symptoms described');
    }

    if (processedText.includes('liver') || processedText.includes('hepatitis') || processedText.includes('jigar')) {
      condition = condition === 'Requires Professional Evaluation' ? 'Liver Condition' : condition + ', Liver Condition';
      findings.push('Liver-related symptoms mentioned');
    }

    return {
      documentName: fileName,
      documentType: isAudio ? 'voice_recording' : 'medical_document',
      originalLanguage: language,
      primaryCondition: condition,
      urgency,
      keyFindings: findings.length > 0 ? findings : ['Medical information requires professional interpretation'],
      requiredSpecialties: ['General Medicine', 
        ...(processedText.includes('tia') || processedText.includes('stroke') ? ['Neurology'] : []),
        ...(processedText.includes('chest pain') || processedText.includes('heart') || processedText.includes('dil') ? ['Cardiology'] : []),
        ...(processedText.includes('liver') || processedText.includes('hepatitis') || processedText.includes('jigar') ? ['Gastroenterology'] : [])
      ],
      recommendedActions: ['Consult with healthcare professional', 
        ...(urgency === 'high' || urgency === 'critical' ? ['Seek immediate medical attention if symptoms worsen'] : [])
      ],
      ...(language.includes('Urdu') && { culturalNotes: 'Analysis based on Urdu voice recording translation' })
    };
  };

  const analyzeConsolidatedDocuments = async (allAnalyses) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const voiceRecordings = allAnalyses.filter(a => a.documentType === 'voice_recording');
      const medicalDocs = allAnalyses.filter(a => a.documentType === 'medical_document');
      const urduRecordings = allAnalyses.filter(a => a.originalLanguage && a.originalLanguage.includes('Urdu'));
      
      const prompt = `
      You are a senior medical consultant. Analyze these multiple medical reports and voice recordings together and provide a comprehensive consolidated analysis.

      DOCUMENTS ANALYZED: ${medicalDocs.length} medical document(s)
      VOICE RECORDINGS ANALYZED: ${voiceRecordings.length} recording(s)
      URDU RECORDINGS: ${urduRecordings.length} recording(s)
      
      INDIVIDUAL FINDINGS:
      ${allAnalyses.map(analysis => `
      ${analysis.documentType === 'voice_recording' ? 'VOICE RECORDING' : 'MEDICAL DOCUMENT'}: ${analysis.documentName}
      Language: ${analysis.originalLanguage || 'English'}
      Primary Condition: ${analysis.primaryCondition}
      Urgency: ${analysis.urgency}
      Key Findings: ${analysis.keyFindings?.join(', ') || 'N/A'}
      `).join('\n')}

      CONSOLIDATED ANALYSIS REQUIREMENTS:
      - Integrate findings from both documents and voice recordings
      - Consider language variations (especially Urdu translations)
      - Identify overarching health conditions across all sources
      - Determine overall urgency level (consider the most urgent finding)
      - Consolidate all symptoms, test results, and findings
      - Provide integrated clinical interpretation
      - Recommend the most appropriate medical specialists
      - Suggest comprehensive follow-up actions and tests
      - Assess overall health risk profile
      - Consider cultural context for Urdu recordings

      Required JSON format:
      {
        "overallCondition": "primary consolidated diagnosis",
        "overallUrgency": "low/medium/high/critical",
        "consolidatedFindings": ["array of all important findings"],
        "mostCriticalIssue": "description of most urgent finding",
        "recommendedSpecialists": ["array of prioritized medical specialties"],
        "comprehensiveTests": ["array of all recommended tests"],
        "integratedInterpretation": "detailed consolidated analysis",
        "nextSteps": ["array of immediate next steps"],
        "riskAssessment": "overall risk level",
        "documentSummary": "summary of all documents and recordings analyzed",
        "sourcesIncluded": {
          "medicalDocuments": ${medicalDocs.length},
          "voiceRecordings": ${voiceRecordings.length},
          "urduRecordings": ${urduRecordings.length},
          "englishRecordings": ${voiceRecordings.length - urduRecordings.length}
        },
        "languageConsiderations": "notes about multilingual analysis"
      }

      Provide the most professional medical advice based on all available information from both documents and patient descriptions in multiple languages.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      try {
        return JSON.parse(response.text().replace(/```json\n?|\n?```/g, ''));
      } catch (parseError) {
        console.error('Consolidated JSON Parse Error:', parseError);
        return createConsolidatedFallback(allAnalyses);
      }
    } catch (error) {
      console.error('Consolidated Analysis Error:', error);
      return createConsolidatedFallback(allAnalyses);
    }
  };

  const createConsolidatedFallback = (analyses) => {
    const urgencies = analyses.map(a => a.urgency);
    const highestUrgency = urgencies.includes('critical') ? 'critical' : 
                          urgencies.includes('high') ? 'high' : 
                          urgencies.includes('medium') ? 'medium' : 'low';

    const allConditions = analyses.map(a => a.primaryCondition);
    const uniqueConditions = [...new Set(allConditions)];

    const voiceRecordings = analyses.filter(a => a.documentType === 'voice_recording');
    const medicalDocs = analyses.filter(a => a.documentType === 'medical_document');
    const urduRecordings = analyses.filter(a => a.originalLanguage && a.originalLanguage.includes('Urdu'));

    return {
      overallCondition: uniqueConditions.join('; ') || 'Multiple Health Considerations',
      overallUrgency: highestUrgency,
      consolidatedFindings: analyses.flatMap(a => a.keyFindings || []),
      mostCriticalIssue: analyses.find(a => a.urgency === highestUrgency)?.keyFindings[0] || 'No critical issue identified',
      recommendedSpecialties: ['Internal Medicine', 'General Physician', 
        ...(analyses.some(a => a.primaryCondition.includes('Transient Ischemic Attack') || a.primaryCondition.includes('stroke')) ? ['Neurology'] : []),
        ...(analyses.some(a => a.primaryCondition.includes('Cardiac')) ? ['Cardiology'] : []),
        ...(analyses.some(a => a.primaryCondition.includes('Hepatitis') || a.primaryCondition.includes('Liver')) ? ['Gastroenterology'] : [])
      ],
      comprehensiveTests: ['Comprehensive Blood Work', 'Diagnostic Imaging as needed'],
      integratedInterpretation: `Based on analysis of ${medicalDocs.length} medical documents and ${voiceRecordings.length} voice recordings (${urduRecordings.length} in Urdu). Professional consultation recommended.`,
      nextSteps: ['Schedule appointment with primary care physician', 'Complete recommended tests'],
      sourcesIncluded: {
        medicalDocuments: medicalDocs.length,
        voiceRecordings: voiceRecordings.length,
        urduRecordings: urduRecordings.length,
        englishRecordings: voiceRecordings.length - urduRecordings.length
      },
      languageConsiderations: urduRecordings.length > 0 ? 'Includes analysis of Urdu voice recordings with translation' : 'All sources in English'
    };
  };

  const findProfessionalDoctors = (requiredSpecialties, condition, findings) => {
    const scoredDoctors = [];
    
    hospitalData.hospitals.forEach((hospital) => {
      hospital.doctors.forEach((doctor) => {
        let score = 0;
        let matchReasons = [];
        
        const doctorSpecialty = doctor.specialty?.toLowerCase() || '';
        const matchesSpecialty = requiredSpecialties.some(specialty => {
          const specialtyLower = specialty.toLowerCase();
          return doctorSpecialty.includes(specialtyLower) || 
                 specialtyLower.includes(doctorSpecialty);
        });
        
        if (matchesSpecialty) {
          score += 40;
          matchReasons.push('Specialty match');
        }
        
        const conditionLower = condition.toLowerCase();
        const relatedConditions = medicalTerminology.getRelatedTerms(condition);
        const matchesCondition = doctor.treatsDiseases?.some(disease => {
          const diseaseLower = disease.toLowerCase();
          return conditionLower.includes(diseaseLower) || 
                 diseaseLower.includes(conditionLower) ||
                 relatedConditions.some(rel => 
                   rel.toLowerCase().includes(diseaseLower) || 
                   diseaseLower.includes(rel.toLowerCase())
                 );
        });
        
        if (matchesCondition) {
          score += 35;
          matchReasons.push('Condition expertise');
          if (relatedConditions.length > 0) {
            matchReasons.push(`Related conditions: ${relatedConditions.join(', ')}`);
          }
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
        
        const allDiseases = Object.values(medicalTerminology.diseases).flat();
        if (allDiseases.some(d => conditionLower.includes(d.toLowerCase()))) {
          if (conditionLower.includes('hepatitis') && doctorSpecialty.includes('hepatolog')) {
            score += 10;
            matchReasons.push('Hepatology specialist');
          }
          if (conditionLower.includes('liver') && doctorSpecialty.includes('gastro')) {
            score += 8;
            matchReasons.push('Liver disease specialist');
          }
          if (conditionLower.includes('diabetes') && doctorSpecialty.includes('endocrinolog')) {
            score += 10;
            matchReasons.push('Endocrinology specialist');
          }
          if (conditionLower.includes('cardiac') && doctorSpecialty.includes('cardiolog')) {
            score += 10;
            matchReasons.push('Cardiology specialist');
          }
          if ((conditionLower.includes('tia') || conditionLower.includes('transient ischemic attack')) && doctorSpecialty.includes('neurolog')) {
            score += 15;
            matchReasons.push('Neurology specialist for TIA');
          }
        }
        
        const allSymptoms = Object.values(medicalTerminology.symptoms).flat();
        const matchesSymptoms = findings.some(finding => 
          allSymptoms.some(symptom => 
            finding.toLowerCase().includes(symptom.toLowerCase())
          )
        );
        if (matchesSymptoms) {
          score += 5;
          matchReasons.push('Relevant symptom expertise');
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

  const getComprehensiveTests = (condition, findings) => {
    const testMap = medicalTerminology.tests;
    const conditionKey = Object.keys(testMap).find(key => 
      condition.toLowerCase().includes(key)
    );

    const baseTests = conditionKey ? testMap[conditionKey] : testMap.general;
    const additionalTests = [];

    if (findings.some(f => f.toLowerCase().includes('liver'))) {
      additionalTests.push(...testMap.liver);
    }
    if (findings.some(f => f.toLowerCase().includes('kidney'))) {
      additionalTests.push(...testMap.renal);
    }
    if (findings.some(f => f.toLowerCase().includes('heart') || f.toLowerCase().includes('cardiac'))) {
      additionalTests.push(...testMap.cardiac);
    }
    if (condition.toLowerCase().includes('tia') || condition.toLowerCase().includes('transient ischemic attack')) {
      additionalTests.push('Carotid Ultrasound', 'Brain MRI', 'EEG', 'CT Angiography');
    }

    return [...new Set([...baseTests, ...additionalTests])].slice(0, 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) return setError('Please upload one or more medical reports or record audio.');

    setLoading(true);
    setProgress(0);
    setSuggestions({ doctors: [], hospitals: [], tests: [] });
    setConsolidatedAnalysis(null);
    setExtractedTexts([]);

    try {
      const extractedResults = [];
      let processedFiles = 0;
      
      for (const file of files) {
        setProgress(Math.round((processedFiles / files.length) * 25));
        const extracted = await extractTextWithAI(file);
        extractedResults.push(extracted);
        processedFiles++;
        setProgress(Math.round((processedFiles / files.length) * 50));
      }

      setExtractedTexts(extractedResults);

      const individualAnalyses = [];
      for (const [index, result] of extractedResults.entries()) {
        if (!result.error) {
          setProgress(50 + Math.round((index / extractedResults.length) * 20));
          const analysis = await analyzeSingleDocument(result.content, result.fileName, result.isAudio, result.language);
          individualAnalyses.push(analysis);
        }
      }

      setProgress(80);
      const consolidated = await analyzeConsolidatedDocuments(individualAnalyses);
      setConsolidatedAnalysis(consolidated);

      setProgress(90);
      await generateProfessionalRecommendations(consolidated, individualAnalyses);
      
      setProgress(100);
      
    } catch (err) {
      setError('Error processing medical documents: ' + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const generateProfessionalRecommendations = async (consolidated, individualAnalyses) => {
    const professionalDoctors = findProfessionalDoctors(
      consolidated.recommendedSpecialists || ['Internal Medicine'],
      consolidated.overallCondition,
      consolidated.consolidatedFindings || []
    );

    const topHospitals = new Set();
    professionalDoctors.slice(0, 10).forEach(doctor => {
      topHospitals.add(doctor.hospital);
    });

    const comprehensiveTests = getComprehensiveTests(
      consolidated.overallCondition,
      consolidated.consolidatedFindings || []
    );

    setSuggestions({
      doctors: professionalDoctors.slice(0, 8),
      hospitals: Array.from(topHospitals).slice(0, 5),
      tests: comprehensiveTests,
      analysis: consolidated
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return '#dc3545';
      case 'high': return '#ff6b35';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setDocumentCount(prev => prev - 1);
    
    // Check if we still have audio files
    const remainingAudio = files.filter((_, index) => index !== indexToRemove && files[index].type.startsWith('audio/'));
    setHasAudioRecording(remainingAudio.length > 0);
  };

  const EnhancedDoctorCard = ({ doctor, index }) => {
    const expandedDiseases = doctor.treatsDiseases?.map(disease => 
      medicalTerminology.expandAbbreviation(disease) || disease
    );
    const expandedSpecialty = medicalTerminology.expandAbbreviation(doctor.specialty) || doctor.specialty;

    return (
      <div 
        style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1rem', 
          marginBottom: '1rem',
          background: index < 3 ? '#f8f9fa' : 'white',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onClick={() => handleDoctorClick(doctor)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
      >
        {index < 3 && (
          <div style={{
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
          }}>
            {index === 0 ? 'BEST MATCH' : index === 1 ? 'SECOND CHOICE' : 'HIGHLY RECOMMENDED'}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)' }}>
              {doctor.name}
            </h4>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#555' }}>
              {expandedSpecialty}
            </p>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Availability:</strong> {doctor.availability}
            </div>
            
            {doctor.avgPatients && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Average Patients per Day:</strong> {doctor.avgPatients}
              </div>
            )}
            
            {expandedDiseases && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Possible Diseases:</strong>
                <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                  {expandedDiseases.map((disease, i) => (
                    <li key={i} style={{ fontSize: '0.9rem' }}>• {disease}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {doctor.contact && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Contact:</strong> {doctor.contact}
              </div>
            )}
          </div>
          
          <div style={{ 
            background: '#e8f5e8', 
            padding: '0.5rem', 
            borderRadius: '4px',
            minWidth: '100px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
              {doctor.matchPercentage}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Match Score</div>
          </div>
        </div>
        
        {doctor.matchReasons && doctor.matchReasons.length > 0 && (
          <div style={{ 
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: '#f1f8ff',
            borderRadius: '4px',
            fontSize: '0.8rem'
          }}>
            <strong>Match Reasons:</strong> {doctor.matchReasons.join(', ')}
          </div>
        )}
        
        {doctor.experience && (
          <div style={{ 
            display: 'inline-block',
            background: '#17a2b8',
            color: 'white',
            padding: '0.2rem 0.5rem',
            borderRadius: '20px',
            fontSize: '0.7rem',
            marginTop: '0.5rem'
          }}>
            {doctor.experience} Experience
          </div>
        )}

        <div style={{ 
          marginTop: '1rem', 
          padding: '0.5rem', 
          background: '#f8f9fa', 
          borderRadius: '4px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#666'
        }}>
          <i className="fas fa-info-circle"></i> Click to view full profile and contact details
        </div>
      </div>
    );
  };

  // Modal Components
  const DoctorDetailModal = () => {
    if (!selectedDoctor) return null;

    const expandedSpecialty = medicalTerminology.expandAbbreviation(selectedDoctor.specialty) || selectedDoctor.specialty;
    const expandedDiseases = selectedDoctor.treatsDiseases?.map(disease => 
      medicalTerminology.expandAbbreviation(disease) || disease
    );

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}>
          <button 
            onClick={closeModals}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>

          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <i className="fas fa-user-md" style={{ marginRight: '0.5rem' }}></i>
            Doctor Profile
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem'
              }}>
                <i className="fas fa-user-md"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedDoctor.name}</h4>
                <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '1.1rem' }}>
                  {expandedSpecialty}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <strong>Hospital/Clinic</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>{selectedDoctor.hospital}</p>
              </div>
              
              <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <strong>Availability</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>{selectedDoctor.availability}</p>
              </div>
            </div>

            {selectedDoctor.contact && (
              <div style={{ padding: '1rem', background: '#e8f5e8', borderRadius: '8px' }}>
                <strong>Contact Information</strong>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>
                  <i className="fas fa-phone" style={{ marginRight: '0.5rem' }}></i>
                  {selectedDoctor.contact}
                </p>
              </div>
            )}

            {expandedDiseases && expandedDiseases.length > 0 && (
              <div style={{ padding: '1rem', background: '#f1f8ff', borderRadius: '8px' }}>
                <strong>Specializes In</strong>
                <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                  {expandedDiseases.map((disease, i) => (
                    <li key={i} style={{ marginBottom: '0.3rem' }}>{disease}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedDoctor.experience && (
              <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
                <strong>Experience</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>{selectedDoctor.experience} years of medical practice</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button style={{
                padding: '0.8rem 1.5rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-calendar-check"></i>
                Book Appointment
              </button>
              
              <button style={{
                padding: '0.8rem 1.5rem',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-directions"></i>
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HospitalDetailModal = () => {
    if (!selectedHospital) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}>
          <button 
            onClick={closeModals}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>

          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <i className="fas fa-hospital" style={{ marginRight: '0.5rem' }}></i>
            Hospital/Clinic Details
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#dc3545',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem'
              }}>
                <i className="fas fa-hospital"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedHospital.hospitalClinicName}</h4>
                <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                  {selectedHospital.type.private ? 'Private' : 'Public'} Healthcare Facility
                </p>
              </div>
            </div>

            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <strong>Address</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>{selectedHospital.fullAddress}</p>
            </div>

            {selectedHospital.phoneNumbers && selectedHospital.phoneNumbers.length > 0 && (
              <div style={{ padding: '1rem', background: '#e8f5e8', borderRadius: '8px' }}>
                <strong>Contact Numbers</strong>
                <div style={{ margin: '0.5rem 0 0 0' }}>
                  {selectedHospital.phoneNumbers.map((phone, index) => (
                    <p key={index} style={{ margin: '0.3rem 0' }}>
                      <i className="fas fa-phone" style={{ marginRight: '0.5rem' }}></i>
                      {phone}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {selectedHospital.facilities && (
              <div style={{ padding: '1rem', background: '#f1f8ff', borderRadius: '8px' }}>
                <strong>Available Facilities</strong>
                <div style={{ margin: '0.5rem 0 0 0', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {Object.entries(selectedHospital.facilities).map(([facility, available]) => 
                    available === true && (
                      <span key={facility} style={{
                        background: '#2196f3',
                        color: 'white',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem'
                      }}>
                        {facility.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button style={{
                padding: '0.8rem 1.5rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-directions"></i>
                Get Directions
              </button>
              
              <button style={{
                padding: '0.8rem 1.5rem',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-phone"></i>
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TestDetailModal = () => {
    if (!selectedTest) return null;

    const expandedTest = medicalTerminology.expandAbbreviation(selectedTest) || selectedTest;
    const testDescription = medicalTerminology.tests ? 
      Object.entries(medicalTerminology.tests).find(([_, tests]) => 
        tests.includes(selectedTest)
      )?.[0] : null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}>
          <button 
            onClick={closeModals}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>

          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <i className="fas fa-flask" style={{ marginRight: '0.5rem' }}></i>
            Test Information
          </h3>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#17a2b8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem'
              }}>
                <i className="fas fa-flask"></i>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.5rem' }}>{expandedTest}</h4>
                {testDescription && (
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
                    {testDescription.charAt(0).toUpperCase() + testDescription.slice(1)} Test
                  </p>
                )}
              </div>
            </div>

            <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <strong>Test Description</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                This diagnostic test helps in assessing your medical condition and providing 
                accurate results for proper treatment planning.
              </p>
            </div>

            <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
              <strong>Preparation Instructions</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                <li>Follow your doctor's specific instructions</li>
                <li>Fasting may be required for some tests</li>
                <li>Bring your medical reports and ID</li>
                <li>Inform about any medications you're taking</li>
              </ul>
            </div>

            <div style={{ padding: '1rem', background: '#e8f5e8', borderRadius: '8px' }}>
              <strong>Available at these hospitals:</strong>
              <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
                {suggestions.hospitals.slice(0, 3).map((hospital, index) => (
                  <li key={index} style={{ marginBottom: '0.3rem' }}>
                    {hospital}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button style={{
                padding: '0.8rem 1.5rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <i className="fas fa-calendar-check"></i>
                Schedule Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="section-title">Advanced Multi-Document Medical Analysis</h2>
      
      <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
        <p style={{ marginBottom: '1rem' }}>
          <i className="fas fa-robot" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
          Upload multiple medical reports or record voice descriptions in English or Urdu for comprehensive AI-powered analysis and professional recommendations.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Voice Recording Section */}
          <div style={{ 
            border: '1px dashed #ddd', 
            padding: '1.5rem', 
            borderRadius: '8px',
            background: '#fafafa'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)' }}>
              <i className="fas fa-microphone" style={{ marginRight: '0.5rem' }}></i>
              Voice Recording Option (English/Urdu Supported)
            </h4>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={handleMicClick}
                style={{
                  background: isRecording ? '#dc3545' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                {isRecording ? `Stop Recording (${formatTime(recordingTime)})` : 'Start Voice Recording'}
              </button>

              {hasAudioRecording && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.5rem',
                  background: '#e8f5e8',
                  borderRadius: '4px'
                }}>
                  <i className="fas fa-check-circle" style={{ color: '#28a745' }}></i>
                  <span>Voice recording added</span>
                </div>
              )}
            </div>

            {isRecording && (
              <div style={{ 
                padding: '1rem', 
                background: '#fff3cd', 
                borderRadius: '4px',
                border: '1px solid #ffeaa7'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fas fa-microphone-alt" style={{ color: '#dc3545' }}></i>
                  <strong>Recording in progress...</strong>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    background: '#dc3545', 
                    borderRadius: '50%',
                    animation: 'pulse 1.5s infinite'
                  }}></div>
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                  Speak clearly about your symptoms, medical history, and concerns in English or Urdu. 
                  Recording time: <strong>{formatTime(recordingTime)}</strong>
                </p>
              </div>
            )}

            {audioTranscription && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: '#f8f9fa', 
                borderRadius: '4px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong>
                    <i className="fas fa-comment-medical"></i> Voice Recording Transcription:
                  </strong>
                  {detectedLanguage && (
                    <span style={{ 
                      background: '#17a2b8', 
                      color: 'white', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      fontSize: '0.7rem'
                    }}>
                      Language: {detectedLanguage}
                    </span>
                  )}
                </div>
                <p style={{ 
                  fontSize: '0.9rem', 
                  whiteSpace: 'pre-wrap',
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6'
                }}>
                  {audioTranscription}
                </p>
              </div>
            )}
          </div>

          {/* File Upload Section */}
          <div>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)' }}>
              <i className="fas fa-file-upload" style={{ marginRight: '0.5rem' }}></i>
              Document Upload Option
            </h4>
            
            <input 
              type="file" 
              onChange={handleFileChange} 
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt,audio/*"
              multiple
              style={{ 
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '100%'
              }}
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
              {documentCount > 0 
                ? `${documentCount} file(s) selected (documents + voice recordings)`
                : 'Supported: Medical reports, lab results, prescriptions, voice recordings (English/Urdu)'
              }
            </small>

            {/* File List */}
            {files.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Selected Files:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {files.map((file, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.5rem',
                      background: '#f8f9fa',
                      borderRadius: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className={`fas ${file.type.startsWith('audio/') ? 'fa-microphone' : 'fa-file'}`}></i>
                        <span>{file.name}</span>
                        {file.type.startsWith('audio/') && (
                          <span style={{ 
                            background: '#17a2b8', 
                            color: 'white', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '4px',
                            fontSize: '0.7rem'
                          }}>Voice Recording</span>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeFile(index)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#dc3545', 
                          cursor: 'pointer' 
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div style={{ color: 'red', padding: '0.5rem', background: '#ffe6e6', borderRadius: '4px' }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || files.length === 0}
            style={{
              background: loading ? '#ccc' : 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.8rem',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin"></i>
                Analyzing {files.length} File(s)... {progress}%
              </span>
            ) : (
              <span>
                <i className="fas fa-stethoscope"></i>
                Analyze {files.length} Medical File(s) with AI
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Rest of the JSX remains the same but with language information display */}
      {loading && (
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: 'var(--border-radius)', 
          boxShadow: 'var(--shadow)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '100%', 
            background: '#f0f0f0', 
            borderRadius: '10px', 
            marginBottom: '1rem' 
          }}>
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
            AI is analyzing {files.length} file(s)... This may take a few moments.
            {detectedLanguage && detectedLanguage.includes('Urdu') && (
              <span style={{ display: 'block', marginTop: '0.5rem', fontStyle: 'italic' }}>
                <i className="fas fa-language"></i> Processing Urdu content with translation...
              </span>
            )}
          </p>
        </div>
      )}

      {extractedTexts.length > 0 && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <i className="fas fa-file-alt" style={{ marginRight: '0.5rem' }}></i>
            Document Processing Summary ({extractedTexts.length} files)
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {extractedTexts.map((doc, index) => (
              <div key={index} style={{ 
                padding: '1rem', 
                background: '#f8f9fa', 
                borderRadius: '4px',
                borderLeft: doc.error ? '4px solid #dc3545' : '4px solid #28a745'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>{doc.fileName}</strong>
                    {doc.isAudio && (
                      <span style={{ 
                        background: '#17a2b8', 
                        color: 'white', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.7rem'
                      }}>Voice Recording</span>
                    )}
                    {doc.language && doc.language.includes('Urdu') && (
                      <span style={{ 
                        background: '#ff6b35', 
                        color: 'white', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.7rem'
                      }}>Urdu → English</span>
                    )}
                  </div>
                  <span style={{ 
                    background: doc.error ? '#dc3545' : '#28a745',
                    color: 'white',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {doc.error ? 'Extraction Failed' : 'Successfully Processed'}
                  </span>
                </div>
                {!doc.error && (
                  <div style={{ 
                    maxHeight: '100px', 
                    overflowY: 'auto', 
                    fontSize: '0.8rem',
                    color: '#666'
                  }}>
                    {doc.content.substring(0, 200)}...
                    {doc.translated && (
                      <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#ff6b35' }}>
                        <i className="fas fa-language"></i> Translated from {doc.language}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {consolidatedAnalysis && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <i className="fas fa-clipboard-check" style={{ marginRight: '0.5rem' }}></i>
            Consolidated Medical Analysis
          </h3>
          
          {/* Language and Sources Summary */}
          {consolidatedAnalysis.sourcesIncluded && (
            <div style={{ 
              background: '#e3f2fd', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem',
              borderLeft: '4px solid #2196f3'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1565c0' }}>
                <i className="fas fa-chart-pie" style={{ marginRight: '0.5rem' }}></i>
                Analysis Sources & Languages
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Medical Documents:</strong> {consolidatedAnalysis.sourcesIncluded.medicalDocuments}
                </div>
                <div>
                  <strong>Voice Recordings:</strong> {consolidatedAnalysis.sourcesIncluded.voiceRecordings}
                </div>
                <div>
                  <strong>Urdu Recordings:</strong> {consolidatedAnalysis.sourcesIncluded.urduRecordings || 0}
                </div>
                <div>
                  <strong>English Recordings:</strong> {consolidatedAnalysis.sourcesIncluded.englishRecordings || 0}
                </div>
              </div>
              {consolidatedAnalysis.languageConsiderations && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#bbdefb', borderRadius: '4px' }}>
                  <i className="fas fa-info-circle"></i> {consolidatedAnalysis.languageConsiderations}
                </div>
              )}
            </div>
          )}

          {consolidatedAnalysis.overallUrgency === 'critical' && (
            <div style={{ 
              background: '#dc3545', 
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
              CRITICAL CONDITION DETECTED - IMMEDIATE MEDICAL ATTENTION REQUIRED
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ 
              background: '#e8f5e8', 
              padding: '1.5rem', 
              borderRadius: '8px',
              borderLeft: `4px solid ${getUrgencyColor(consolidatedAnalysis.overallUrgency)}`
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>
                <i className="fas fa-diagnoses" style={{ marginRight: '0.5rem' }}></i>
                Primary Diagnosis
              </h4>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>
                {medicalTerminology.expandAbbreviation(consolidatedAnalysis.overallCondition) || consolidatedAnalysis.overallCondition}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span>Urgency Level:</span>
                <span style={{
                  background: getUrgencyColor(consolidatedAnalysis.overallUrgency),
                  color: 'white',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {consolidatedAnalysis.overallUrgency?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
            </div>

            <div style={{ 
              background: '#e3f2fd', 
              padding: '1.5rem', 
              borderRadius: '8px',
              borderLeft: '4px solid #2196f3'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1565c0' }}>
                <i className="fas fa-user-md" style={{ marginRight: '0.5rem' }}></i>
                Recommended Specialists
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(consolidatedAnalysis.recommendedSpecialists || []).map((specialty, index) => (
                  <span key={index} style={{
                    background: '#2196f3',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem'
                  }}>
                    {medicalTerminology.expandAbbreviation(specialty) || specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
              <i className="fas fa-stethoscope" style={{ marginRight: '0.5rem' }}></i>
              Key Clinical Findings
            </h4>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {(consolidatedAnalysis.consolidatedFindings || []).slice(0, 10).map((finding, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                  {medicalTerminology.expandAbbreviation(finding) || finding}
                </li>
              ))}
            </ul>
          </div>

          {consolidatedAnalysis.integratedInterpretation && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <i className="fas fa-comment-medical" style={{ marginRight: '0.5rem' }}></i>
                Professional Interpretation
              </h4>
              <p style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '4px',
                fontStyle: 'italic',
                lineHeight: '1.6'
              }}>
                {consolidatedAnalysis.integratedInterpretation}
              </p>
            </div>
          )}

          {consolidatedAnalysis.nextSteps && consolidatedAnalysis.nextSteps.length > 0 && (
            <div>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <i className="fas fa-list-check" style={{ marginRight: '0.5rem' }}></i>
                Recommended Next Steps
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {consolidatedAnalysis.nextSteps.map((step, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    background: '#f8f9fa',
                    borderRadius: '4px'
                  }}>
                    <i className="fas fa-check-circle" style={{ color: '#28a745', marginRight: '0.5rem' }}></i>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {suggestions.doctors.length > 0 && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
            <i className="fas fa-hand-holding-medical" style={{ marginRight: '0.5rem' }}></i>
            AI-Recommended Professional Healthcare Providers
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              background: '#fff3cd', 
              padding: '1rem', 
              borderRadius: '4px',
              borderLeft: '4px solid #ffc107',
              marginBottom: '1rem'
            }}>
              <strong>Professional Matching Criteria:</strong> Specialty alignment, condition expertise, related medical terms, experience level, patient volume, symptom relevance, and availability
            </div>
          </div>

          <h4 style={{ marginBottom: '1rem' }}>
            <i className="fas fa-user-md" style={{ marginRight: '0.5rem' }}></i>
            Top Recommended Specialists ({suggestions.doctors.length})
          </h4>
          <div className="doctors-list" style={{ display: 'grid', gap: '1rem' }}>
            {suggestions.doctors.map((doctor, index) => (
              <EnhancedDoctorCard key={index} doctor={doctor} index={index} />
            ))}
          </div>
          
          <h4 style={{ margin: '2rem 0 1rem' }}>
            <i className="fas fa-hospital" style={{ marginRight: '0.5rem' }}></i>
            Recommended Medical Facilities ({suggestions.hospitals.length})
          </h4>
          {suggestions.hospitals.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {suggestions.hospitals.map((hospital, index) => (
                <li 
                  key={index} 
                  style={{ 
                    padding: '0.75rem', 
                    background: '#f8f9fa', 
                    marginBottom: '0.5rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderLeft: index === 0 ? '4px solid #28a745' : '4px solid #6c757d',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleHospitalClick(hospital)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.background = '#e9ecef';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.background = '#f8f9fa';
                  }}
                >
                  <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
                  <div style={{ flex: 1 }}>
                    <strong>{hospital}</strong>
                    {index === 0 && <span style={{ marginLeft: '1rem', color: '#28a745', fontSize: '0.8rem' }}>PRIMARY RECOMMENDATION</span>}
                  </div>
                  <i className="fas fa-chevron-right" style={{ color: '#666' }}></i>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No specialized hospitals found.</p>
          )}
          
          <h4 style={{ margin: '2rem 0 1rem' }}>
            <i className="fas fa-flask" style={{ marginRight: '0.5rem' }}></i>
            Comprehensive Diagnostic Testing Recommendations
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '0.75rem' 
          }}>
            {suggestions.tests.map((test, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '1rem', 
                  background: index < 3 ? '#e8f5e8' : '#e3f2fd', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderLeft: index < 3 ? '4px solid #28a745' : '4px solid #2196f3',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleTestClick(test)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i className={`fas ${index < 3 ? 'fa-star' : 'fa-check-circle'}`} 
                   style={{ 
                     marginRight: '0.5rem', 
                     color: index < 3 ? '#ffc107' : '#2196f3' 
                   }}></i>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                    {medicalTerminology.expandAbbreviation(test) || test}
                  </div>
                  {index < 3 && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>
                      High priority - essential for diagnosis
                    </div>
                  )}
                </div>
                <i className="fas fa-info-circle" style={{ color: '#666' }}></i>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showDoctorModal && <DoctorDetailModal />}
      {showHospitalModal && <HospitalDetailModal />}
      {showTestModal && <TestDetailModal />}
    </div>
  );
};

export default AIReport;