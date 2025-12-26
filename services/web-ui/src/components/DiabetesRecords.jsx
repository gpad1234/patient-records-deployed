import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function DiabetesRecords() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    glucose: '',
    bloodPressure: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`/api/patients/${id}`);
      const data = await response.json();
      setPatient(data);
      setRecords(data.records || []);
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/patients/${id}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
      const record = await response.json();
      setRecords([...records, record]);
      setNewRecord({ glucose: '', bloodPressure: '', notes: '' });
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="diabetes-records">
      <h1>{patient.name} - Diabetes Records</h1>
      <div className="patient-info">
        <p><strong>Type:</strong> {patient.diabetesType}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Phone:</strong> {patient.phone}</p>
      </div>

      <div className="add-record">
        <h2>Add New Record</h2>
        <form onSubmit={handleAddRecord}>
          <input
            type="number"
            placeholder="Glucose Level (mg/dL)"
            value={newRecord.glucose}
            onChange={(e) => setNewRecord({ ...newRecord, glucose: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Blood Pressure (e.g., 120/80)"
            value={newRecord.bloodPressure}
            onChange={(e) => setNewRecord({ ...newRecord, bloodPressure: e.target.value })}
          />
          <textarea
            placeholder="Notes"
            value={newRecord.notes}
            onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
          />
          <button type="submit">Add Record</button>
        </form>
      </div>

      <div className="records-list">
        <h2>Medical Records ({records.length})</h2>
        {records.length === 0 ? (
          <p>No records yet</p>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Glucose</th>
                <th>Blood Pressure</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id}>
                  <td>{new Date(record.recordDate).toLocaleDateString()}</td>
                  <td>{record.glucose} mg/dL</td>
                  <td>{record.bloodPressure}</td>
                  <td>{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
