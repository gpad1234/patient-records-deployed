import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

export default function PatientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPatient()
  }, [id])

  const fetchPatient = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/patients/${id}`)
      // const data = await response.json()
      // setPatient(data)

      // Mock data for development
      const mockPatients = {
        1: {
          id: 1,
          name: 'John Doe',
          dateOfBirth: '1980-05-15',
          email: 'john.doe@example.com',
          phone: '555-0101',
          address: '123 Main St, City, State 12345',
          medicalHistory: 'Hypertension, Type 2 Diabetes',
          medications: 'Lisinopril, Metformin'
        },
        2: {
          id: 2,
          name: 'Jane Smith',
          dateOfBirth: '1985-08-22',
          email: 'jane.smith@example.com',
          phone: '555-0102',
          address: '456 Oak Ave, Town, State 67890',
          medicalHistory: 'Asthma, Allergies',
          medications: 'Albuterol, Cetirizine'
        }
      }

      setPatient(mockPatients[id] || mockPatients[1])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this patient record?')) {
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/patients/${id}`, { method: 'DELETE' })
        navigate('/patients')
      } catch (err) {
        setError(err.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '12px', color: '#999' }}>Loading patient...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <Link to="/patients" className="btn btn-secondary">
          Back to Patients
        </Link>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Patient not found</div>
        <Link to="/patients" className="btn btn-secondary">
          Back to Patients
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/patients" style={{ color: '#2c3e50', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Patients
        </Link>
      </div>

      <div className="page-header">
        <h2>{patient.name}</h2>
        <p>Patient ID: {patient.id}</p>
      </div>

      {/* Contact Information */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: '0' }}>Contact Information</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Email
              </div>
              <div style={{ fontSize: '14px' }}>{patient.email}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Phone
              </div>
              <div style={{ fontSize: '14px' }}>{patient.phone}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Address
              </div>
              <div style={{ fontSize: '14px' }}>{patient.address}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: '0' }}>Medical Information</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Date of Birth
              </div>
              <div style={{ fontSize: '14px' }}>
                {new Date(patient.dateOfBirth).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Medical History
              </div>
              <div style={{ fontSize: '14px' }}>{patient.medicalHistory}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Current Medications
              </div>
              <div style={{ fontSize: '14px' }}>{patient.medications}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <button className="btn btn-secondary btn-block">
              ✏️ Edit
            </button>
            <button className="btn btn-danger btn-block" onClick={handleDelete}>
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
