import { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    autoBackup: true,
    notifications: true
  })
  const [saved, setSaved] = useState(false)

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    setSaved(false)
  }

  const handleSave = () => {
    // TODO: Save settings to API or localStorage
    localStorage.setItem('patientRecordsSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Manage application preferences</p>
      </div>

      {saved && (
        <div className="alert alert-success">
          ✓ Settings saved successfully
        </div>
      )}

      {/* General Settings */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: '0' }}>General</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Auto Backup */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>Auto Backup</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Automatically backup patient records</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={() => handleToggle('autoBackup')}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>

            {/* Notifications */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>Notifications</div>
                <div style={{ fontSize: '13px', color: '#666' }}>Enable application notifications</div>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button className="btn btn-primary" onClick={handleSave}>
            💾 Save Settings
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: '0' }}>About</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Application
              </div>
              <div style={{ fontSize: '14px' }}>Patient Records Management System</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                Version
              </div>
              <div style={{ fontSize: '14px' }}>1.0.0</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                License
              </div>
              <div style={{ fontSize: '14px' }}>MIT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
