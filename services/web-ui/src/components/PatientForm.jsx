import React, { useState } from 'react';

export default function PatientForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    mrn: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    diabetesType: 'Type 2',
    diagnosisDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      alert('Patient added successfully!');
      setFormData({
        mrn: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        diabetesType: 'Type 2',
        diagnosisDate: '',
      });
    } catch (err) {
      setError(err.message || 'Error adding patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-form">
      <h1>Register New Patient</h1>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            name="mrn"
            placeholder="Medical Record Number (optional)"
            value={formData.mrn}
            onChange={handleChange}
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select name="diabetesType" value={formData.diabetesType} onChange={handleChange}>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
            <option value="Gestational">Gestational</option>
          </select>
        </div>

        <input
          type="date"
          name="diagnosisDate"
          placeholder="Diagnosis Date"
          value={formData.diagnosisDate}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Register Patient'}
        </button>
      </form>
    </div>
  );
}
