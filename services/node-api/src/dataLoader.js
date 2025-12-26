const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Generates realistic synthetic patient data
 * Mimics Synthea output format for easy conversion
 */
class DataLoader {
  constructor(db) {
    this.db = db;
  }

  /**
   * Generate N synthetic patients with complete medical records
   */
  generateSyntheticPatients(count = 10) {
    const patients = [];
    const firstNames = ['John', 'Jane', 'Robert', 'Mary', 'Michael', 'Patricia', 'James', 'Linda', 'David', 'Barbara', 'Alice', 'Bob', 'Carol', 'David', 'Eve'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
    const diabetesTypes = ['Type 1', 'Type 2', 'Gestational'];
    const genders = ['M', 'F'];
    const baseTime = Date.now();

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      // Use timestamp + index to ensure global uniqueness
      const mrn = `MRN${String(baseTime + i).slice(-9)}`;
      
      const patient = {
        id: i + 1,
        mrn,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospital.com`,
        phone: `${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        dateOfBirth: this.randomDate(1950, 2005),
        gender: genders[Math.floor(Math.random() * genders.length)],
        address: `${Math.floor(Math.random() * 999) + 1} ${['Main', 'Oak', 'Elm', 'Pine', 'Maple'][Math.floor(Math.random() * 5)]} St`,
        city: ['Boston', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 6)],
        state: 'CA',
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        diabetesType: diabetesTypes[Math.floor(Math.random() * diabetesTypes.length)],
        diagnosisDate: this.randomDate(2010, 2023),
        status: 'Active',
        medicalRecords: {
          glucose: this.generateGlucoseRecords(20),
          labs: this.generateLabRecords(10),
          medications: this.generateMedications(5),
          diagnoses: this.generateDiagnoses(),
          allergies: this.generateAllergies(2)
        }
      };
      patients.push(patient);
    }
    return patients;
  }

  /**
   * Generate glucose records (last 30 days)
   */
  generateGlucoseRecords(count = 20) {
    const records = [];
    const types = ['Fasting', 'Random', 'Postprandial', 'Bedtime'];
    
    for (let i = 0; i < count; i++) {
      records.push({
        glucoseValue: Math.floor(Math.random() * 150) + 80, // 80-230 mg/dL
        glucoseType: types[Math.floor(Math.random() * types.length)],
        recordedAt: this.randomDate(new Date(Date.now() - 30*24*60*60*1000), new Date()),
        notes: Math.random() > 0.7 ? 'After meals' : 'Before meals'
      });
    }
    return records;
  }

  /**
   * Generate lab results (HbA1c, creatinine, cholesterol, etc.)
   */
  generateLabRecords(count = 10) {
    const labs = [
      { testName: 'HbA1c', unit: '%', range: [5.7, 8.5], status: (val) => val < 5.7 ? 'Normal' : val < 7 ? 'Normal' : val < 8 ? 'High' : 'Critical' },
      { testName: 'Fasting Glucose', unit: 'mg/dL', range: [70, 200], status: (val) => val < 100 ? 'Normal' : val < 126 ? 'High' : 'Critical' },
      { testName: 'Creatinine', unit: 'mg/dL', range: [0.6, 1.5], status: (val) => val < 1.2 ? 'Normal' : 'High' },
      { testName: 'Total Cholesterol', unit: 'mg/dL', range: [100, 300], status: (val) => val < 200 ? 'Normal' : 'High' },
      { testName: 'LDL', unit: 'mg/dL', range: [50, 200], status: (val) => val < 100 ? 'Normal' : val < 130 ? 'High' : 'Critical' },
      { testName: 'HDL', unit: 'mg/dL', range: [30, 100], status: (val) => val > 40 ? 'Normal' : 'Low' },
      { testName: 'Triglycerides', unit: 'mg/dL', range: [50, 400], status: (val) => val < 150 ? 'Normal' : 'High' },
      { testName: 'BUN', unit: 'mg/dL', range: [7, 25], status: (val) => val >= 7 && val <= 20 ? 'Normal' : 'High' }
    ];

    const records = [];
    for (let i = 0; i < count; i++) {
      const lab = labs[Math.floor(Math.random() * labs.length)];
      const value = Math.floor(Math.random() * (lab.range[1] - lab.range[0])) + lab.range[0];
      
      records.push({
        testName: lab.testName,
        testCode: `LOINC-${Math.floor(Math.random() * 90000) + 10000}`,
        resultValue: value,
        unit: lab.unit,
        referenceRange: `${lab.range[0]}-${lab.range[1]}`,
        resultDate: this.randomDate(new Date(Date.now() - 90*24*60*60*1000), new Date()),
        status: lab.status(value)
      });
    }
    return records;
  }

  /**
   * Generate current medications
   */
  generateMedications(count = 5) {
    const medications = [
      { name: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', indication: 'Type 2 Diabetes' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', indication: 'Hypertension' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', indication: 'Cholesterol' },
      { name: 'Insulin Glargine', dosage: '20 units', frequency: 'Once daily', indication: 'Type 1 Diabetes' },
      { name: 'Glipizide', dosage: '5mg', frequency: 'Twice daily', indication: 'Type 2 Diabetes' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', indication: 'Cardiovascular protection' },
      { name: 'Losartan', dosage: '50mg', frequency: 'Once daily', indication: 'Hypertension' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', indication: 'Hypertension' },
      { name: 'Albuterol', dosage: '2 puffs', frequency: 'As needed', indication: 'Asthma' },
      { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', indication: 'GERD' }
    ];

    const records = [];
    const selectedMeds = medications.sort(() => Math.random() - 0.5).slice(0, count);
    
    selectedMeds.forEach(med => {
      records.push({
        medicationName: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        route: 'Oral',
        indication: med.indication,
        status: 'Active',
        startDate: this.randomDate(2020, 2024)
      });
    });
    return records;
  }

  /**
   * Generate diagnoses with ICD-10 codes
   */
  generateDiagnoses() {
    const diagnoses = [
      { name: 'Type 2 Diabetes Mellitus', code: 'E11.9', type: 'Primary' },
      { name: 'Essential Hypertension', code: 'I10', type: 'Secondary' },
      { name: 'Hyperlipidemia', code: 'E78.5', type: 'Secondary' },
      { name: 'Obesity', code: 'E66.9', type: 'Comorbidity' },
      { name: 'Chronic Kidney Disease', code: 'N18.3', type: 'Comorbidity' }
    ];

    return diagnoses.map(d => ({
      ...d,
      diagnosisType: d.type,
      icd10Code: d.code,
      status: 'Active'
    }));
  }

  /**
   * Generate allergies
   */
  generateAllergies(count = 2) {
    const allergies = [
      { allergen: 'Penicillin', reaction: 'Rash', severity: 'Moderate' },
      { allergen: 'Sulfonamides', reaction: 'Rash', severity: 'Mild' },
      { allergen: 'Latex', reaction: 'Contact dermatitis', severity: 'Mild' },
      { allergen: 'Shellfish', reaction: 'Anaphylaxis', severity: 'Severe' },
      { allergen: 'Peanuts', reaction: 'Anaphylaxis', severity: 'Severe' },
      { allergen: 'NSAIDs', reaction: 'Gastric ulcer', severity: 'Moderate' }
    ];

    return allergies.sort(() => Math.random() - 0.5).slice(0, count).map(a => ({
      allergen: a.allergen,
      reactionType: a.reaction,
      severity: a.severity

    }));
  }

  /**
   * Load patients into database
   */
  async seedDatabase(patientCount = 10) {
    const db = this.db;  // Capture db reference
    return new Promise((resolve, reject) => {
      try {
        const patients = this.generateSyntheticPatients(patientCount);
        let inserted = 0;
        let processed = 0;

        patients.forEach(patient => {
          // Insert patient
          db.run(
            `INSERT INTO patients (mrn, firstName, lastName, email, phone, dateOfBirth, gender, address, city, state, zipCode, diabetesType, diagnosisDate, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [patient.mrn, patient.firstName, patient.lastName, patient.email, patient.phone,
             patient.dateOfBirth, patient.gender, patient.address, patient.city, patient.state,
             patient.zipCode, patient.diabetesType, patient.diagnosisDate, patient.status],
            function(err) {
              if (err) {
                console.error('Error inserting patient:', err.message);
                processed++;
                if (processed === patients.length) {
                  resolve({ success: true, patientsInserted: inserted, message: `Seeded ${inserted} synthetic patients` });
                }
                return;
              }

              const patientId = this.lastID;

              // Insert glucose records
              patient.medicalRecords.glucose.forEach(g => {
                db.run(
                  `INSERT INTO glucose_records (patientId, glucoseValue, glucoseType, recordedAt, notes)
                   VALUES (?, ?, ?, ?, ?)`,
                  [patientId, g.glucoseValue, g.glucoseType, g.recordedAt, g.notes]
                );
              });

              // Insert lab records
              patient.medicalRecords.labs.forEach(l => {
                db.run(
                  `INSERT INTO lab_results (patientId, testName, testCode, resultValue, unit, referenceRange, resultDate, status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                  [patientId, l.testName, l.testCode, l.resultValue, l.unit, l.referenceRange, l.resultDate, l.status]
                );
              });

              // Insert medications
              patient.medicalRecords.medications.forEach(m => {
                db.run(
                  `INSERT INTO medications (patientId, medicationName, dosage, frequency, route, indication, status, startDate)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                  [patientId, m.medicationName, m.dosage, m.frequency, m.route, m.indication, m.status, m.startDate]
                );
              });

              // Insert diagnoses
              patient.medicalRecords.diagnoses.forEach(d => {
                db.run(
                  `INSERT INTO diagnoses (patientId, diagnosisName, icd10Code, diagnosisType, status)
                   VALUES (?, ?, ?, ?, ?)`,
                  [patientId, d.name, d.icd10Code, d.diagnosisType, d.status]
                );
              });

              // Insert allergies
              patient.medicalRecords.allergies.forEach(a => {
                db.run(
                  `INSERT INTO allergies (patientId, allergen, reactionType, severity)
                   VALUES (?, ?, ?, ?)`,
                  [patientId, a.allergen, a.reactionType, a.severity]
                );
              });

              inserted++;
              processed++;
              
              // Resolve when all patients processed
              if (processed === patients.length) {
                setTimeout(() => {
                  resolve({ success: true, patientsInserted: inserted, message: `Seeded ${inserted} synthetic patients` });
                }, 500);
              }
            }
          );
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Load from CSV file (Synthea format)
   */
  async loadFromCSV(filePath) {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          reject(new Error(`File not found: ${filePath}`));
          return;
        }

        const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
        const headers = lines[0].split(',');
        const records = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',');
          const record = {};
          headers.forEach((header, idx) => {
            record[header.trim()] = values[idx]?.trim();
          });
          records.push(record);
        }

        resolve(records);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Helper: Random date between two dates
   */
  randomDate(start, end) {
    if (typeof start === 'number' && typeof end === 'number') {
      // Year range provided
      const startDate = new Date(start, 0, 1);
      const endDate = new Date(end, 11, 31);
      return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())).toISOString().split('T')[0];
    }
    // Date range provided
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
  }
}

module.exports = DataLoader;
