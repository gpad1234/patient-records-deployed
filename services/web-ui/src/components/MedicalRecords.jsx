import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function MedicalRecords() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('glucose');
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Form states for different record types
  const [glucose, setGlucose] = useState({ glucoseValue: '', glucoseType: 'Random', notes: '' });
  const [lab, setLab] = useState({ testName: '', resultValue: '', unit: '', status: 'Normal' });
  const [med, setMed] = useState({ medicationName: '', dosage: '', frequency: '', indication: '' });
  const [diagnosis, setDiagnosis] = useState({ diagnosisName: '', icd10Code: '', diagnosisType: 'Secondary' });
  const [allergy, setAllergy] = useState({ allergen: '', reactionType: '', severity: 'Mild' });

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await fetch(`${API_URL}/api/patients/${id}`);
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (type, data) => {
    try {
      const response = await fetch(`/api/patients/${id}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add record');
      await fetchPatient();
      // Reset form
      switch(type) {
        case 'glucose': setGlucose({ glucoseValue: '', glucoseType: 'Random', notes: '' }); break;
        case 'labs': setLab({ testName: '', resultValue: '', unit: '', status: 'Normal' }); break;
        case 'medications': setMed({ medicationName: '', dosage: '', frequency: '', indication: '' }); break;
        case 'diagnoses': setDiagnosis({ diagnosisName: '', icd10Code: '', diagnosisType: 'Secondary' }); break;
        case 'allergies': setAllergy({ allergen: '', reactionType: '', severity: 'Mild' }); break;
        default: break;
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (loading) return <div className="loading">Loading patient records...</div>;
  if (!patient) return <div className="error">Patient not found</div>;

  const records = patient.medicalRecords || {};

  return (
    <div className="medical-records">
      <div className="patient-header">
        <h1>{patient.firstName} {patient.lastName}</h1>
        <div className="patient-summary">
          <p><strong>MRN:</strong> {patient.mrn}</p>
          <p><strong>Type:</strong> {patient.diabetesType}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
          <p><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'glucose' ? 'active' : ''}`} onClick={() => setActiveTab('glucose')}>
          Glucose ({records.glucose?.length || 0})
        </button>
        <button className={`tab ${activeTab === 'labs' ? 'active' : ''}`} onClick={() => setActiveTab('labs')}>
          Lab Results ({records.labs?.length || 0})
        </button>
        <button className={`tab ${activeTab === 'medications' ? 'active' : ''}`} onClick={() => setActiveTab('medications')}>
          Medications ({records.medications?.length || 0})
        </button>
        <button className={`tab ${activeTab === 'diagnoses' ? 'active' : ''}`} onClick={() => setActiveTab('diagnoses')}>
          Diagnoses ({records.diagnoses?.length || 0})
        </button>
        <button className={`tab ${activeTab === 'allergies' ? 'active' : ''}`} onClick={() => setActiveTab('allergies')}>
          Allergies ({records.allergies?.length || 0})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'glucose' && (
          <div className="record-section">
            <h2>Glucose Records</h2>
            <form onSubmit={(e) => { e.preventDefault(); addRecord('glucose', glucose); }} className="record-form">
              <input
                type="number"
                placeholder="Glucose Value (mg/dL)"
                value={glucose.glucoseValue}
                onChange={(e) => setGlucose({...glucose, glucoseValue: e.target.value})}
                step="0.1"
                required
              />
              <select value={glucose.glucoseType} onChange={(e) => setGlucose({...glucose, glucoseType: e.target.value})}>
                <option value="Fasting">Fasting</option>
                <option value="Random">Random</option>
                <option value="Postprandial">Postprandial</option>
                <option value="Bedtime">Bedtime</option>
              </select>
              <input
                type="text"
                placeholder="Notes"
                value={glucose.notes}
                onChange={(e) => setGlucose({...glucose, notes: e.target.value})}
              />
              <button type="submit">Add Record</button>
            </form>

            <table className="records-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Glucose (mg/dL)</th>
                  <th>Type</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {(records.glucose || []).map(r => (
                  <tr key={r.id}>
                    <td>{new Date(r.recordedAt).toLocaleDateString()}</td>
                    <td>{r.glucoseValue}</td>
                    <td>{r.glucoseType}</td>
                    <td>{r.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="record-section">
            <h2>Lab Results</h2>
            <form onSubmit={(e) => { e.preventDefault(); addRecord('labs', lab); }} className="record-form">
              <input
                type="text"
                placeholder="Test Name (e.g., HbA1c, Creatinine)"
                value={lab.testName}
                onChange={(e) => setLab({...lab, testName: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Result Value"
                value={lab.resultValue}
                onChange={(e) => setLab({...lab, resultValue: e.target.value})}
                step="0.01"
                required
              />
              <input
                type="text"
                placeholder="Unit (e.g., %, mg/dL)"
                value={lab.unit}
                onChange={(e) => setLab({...lab, unit: e.target.value})}
              />
              <select value={lab.status} onChange={(e) => setLab({...lab, status: e.target.value})}>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <button type="submit">Add Lab Result</button>
            </form>

            <table className="records-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Test</th>
                  <th>Result</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(records.labs || []).map(r => (
                  <tr key={r.id}>
                    <td>{new Date(r.resultDate).toLocaleDateString()}</td>
                    <td>{r.testName}</td>
                    <td>{r.resultValue} {r.unit}</td>
                    <td><span className={`status ${r.status?.toLowerCase()}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="record-section">
            <h2>Current Medications</h2>
            <form onSubmit={(e) => { e.preventDefault(); addRecord('medications', med); }} className="record-form">
              <input
                type="text"
                placeholder="Medication Name"
                value={med.medicationName}
                onChange={(e) => setMed({...med, medicationName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Dosage (e.g., 500)"
                value={med.dosage}
                onChange={(e) => setMed({...med, dosage: e.target.value})}
              />
              <input
                type="text"
                placeholder="Frequency (e.g., Daily, BID)"
                value={med.frequency}
                onChange={(e) => setMed({...med, frequency: e.target.value})}
              />
              <input
                type="text"
                placeholder="Indication"
                value={med.indication}
                onChange={(e) => setMed({...med, indication: e.target.value})}
              />
              <button type="submit">Add Medication</button>
            </form>

            <table className="records-table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Indication</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(records.medications || []).map(m => (
                  <tr key={m.id}>
                    <td>{m.medicationName}</td>
                    <td>{m.dosage || '-'}</td>
                    <td>{m.frequency || '-'}</td>
                    <td>{m.indication || '-'}</td>
                    <td>{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'diagnoses' && (
          <div className="record-section">
            <h2>Diagnoses & Comorbidities</h2>
            <form onSubmit={(e) => { e.preventDefault(); addRecord('diagnoses', diagnosis); }} className="record-form">
              <input
                type="text"
                placeholder="Diagnosis Name"
                value={diagnosis.diagnosisName}
                onChange={(e) => setDiagnosis({...diagnosis, diagnosisName: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="ICD-10 Code (e.g., E11.9)"
                value={diagnosis.icd10Code}
                onChange={(e) => setDiagnosis({...diagnosis, icd10Code: e.target.value})}
              />
              <select value={diagnosis.diagnosisType} onChange={(e) => setDiagnosis({...diagnosis, diagnosisType: e.target.value})}>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Comorbidity">Comorbidity</option>
              </select>
              <button type="submit">Add Diagnosis</button>
            </form>

            <table className="records-table">
              <thead>
                <tr>
                  <th>Diagnosis</th>
                  <th>ICD-10</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(records.diagnoses || []).map(d => (
                  <tr key={d.id}>
                    <td>{d.diagnosisName}</td>
                    <td>{d.icd10Code || '-'}</td>
                    <td>{d.diagnosisType}</td>
                    <td>{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'allergies' && (
          <div className="record-section">
            <h2>Known Allergies</h2>
            <form onSubmit={(e) => { e.preventDefault(); addRecord('allergies', allergy); }} className="record-form">
              <input
                type="text"
                placeholder="Allergen"
                value={allergy.allergen}
                onChange={(e) => setAllergy({...allergy, allergen: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Reaction Type"
                value={allergy.reactionType}
                onChange={(e) => setAllergy({...allergy, reactionType: e.target.value})}
              />
              <select value={allergy.severity} onChange={(e) => setAllergy({...allergy, severity: e.target.value})}>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Life-threatening">Life-threatening</option>
              </select>
              <button type="submit">Add Allergy</button>
            </form>

            <div className="allergies-list">
              {(records.allergies || []).map(a => (
                <div key={a.id} className={`allergy-card ${a.severity?.toLowerCase()}`}>
                  <div className="allergen">{a.allergen}</div>
                  <div className="reaction">{a.reactionType}</div>
                  <div className="severity">Severity: {a.severity}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
