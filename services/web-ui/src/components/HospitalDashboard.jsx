import React, { useState, useEffect } from 'react';

export default function HospitalDashboard({ patients }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [patients]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/hospital/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="hospital-dashboard">
      <h1>Hospital Diabetes Management Portal</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p className="stat-number">{stats?.totalPatients || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Medical Records</h3>
          <p className="stat-number">{stats?.recordsCount || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Diabetes Types</h3>
          <ul>
            {stats?.diabetesTypes && Object.entries(stats.diabetesTypes).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="quick-actions">
        <a href="/patients/new" className="btn-primary">+ Add New Patient</a>
        <a href="/patients" className="btn-secondary">View All Patients</a>
      </div>

      <div className="recent-patients">
        <h2>Recent Patients</h2>
        {patients.slice(-5).reverse().map(patient => (
          <div key={patient.id} className="patient-card">
            <h3>{patient.name}</h3>
            <p>Type: {patient.diabetesType}</p>
            <p>Email: {patient.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
