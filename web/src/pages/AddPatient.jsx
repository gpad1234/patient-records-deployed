import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function AddPatient() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: '',
    medicalHistory: '',
    medications: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/patients', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // const result = await response.json()
      
      console.log('Adding patient:', formData)
      navigate('/patients')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/patients" style={{ color: '#2c3e50', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Patients
        </Link>
      </div>

      <div className="page-header">
        <h2>Add New Patient</h2>
        <p>Enter patient information</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: '0' }}>Personal Information</h3>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="555-0000"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: '0' }}>Medical Information</h3>
          </div>
          <div className="card-content">
            <div className="form-group">
              <label>Medical History</label>
              <textarea
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                placeholder="List any existing conditions, surgeries, or health issues"
              />
            </div>

            <div className="form-group">
              <label>Current Medications</label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                placeholder="List all current medications and dosages"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px', marginBottom: '20px' }}>
          <Link to="/patients" className="btn btn-secondary btn-block" style={{ justifyContent: 'center' }}>
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ justifyContent: 'center' }}
          >
            {loading ? 'Adding...' : 'Add Patient'}
          </button>
        </div>
      </form>
    </div>
  )
}
