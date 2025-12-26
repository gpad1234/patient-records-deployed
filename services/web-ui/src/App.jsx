import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import DiabetesRecords from './components/DiabetesRecords';
import MedicalRecords from './components/MedicalRecords';
import AdminDataSeeder from './components/AdminDataSeeder';
import HospitalDashboard from './components/HospitalDashboard';
import AIResearch from './components/AIResearch';
import AIPredictions from './components/AIPredictions';
import Navigation from './components/Navigation';

function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
    setLoading(false);
  };

  const addPatient = async (patientData) => {
    try {
      const response = await fetch(`/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });
      const newPatient = await response.json();
      setPatients([...patients, newPatient]);
      return newPatient;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  };

  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<HospitalDashboard patients={patients} />} />
          <Route path="/patients" element={<PatientList loading={loading} onRefresh={fetchPatients} />} />
          <Route path="/patients/new" element={<PatientForm onSubmit={addPatient} />} />
          <Route path="/patients/:id/diabetes" element={<DiabetesRecords />} />
          <Route path="/patients/:id/records" element={<MedicalRecords />} />
          <Route path="/admin/seed" element={<AdminDataSeeder />} />
          <Route path="/research/ai" element={<AIResearch />} />
          <Route path="/predictions/ai" element={<AIPredictions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
