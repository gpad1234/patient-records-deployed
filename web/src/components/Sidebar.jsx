import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav>
        <div className="nav-section-title">Menu</div>
        
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={onClose}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/patients"
          className={`nav-link ${isActive('/patients') ? 'active' : ''}`}
          onClick={onClose}
        >
          👥 Patients
        </Link>

        <Link
          to="/patients/new"
          className={`nav-link ${isActive('/patients/new') ? 'active' : ''}`}
          onClick={onClose}
        >
          ➕ Add Patient
        </Link>

        <div className="nav-section-title" style={{ marginTop: '20px' }}>Research</div>

        <Link
          to="/research"
          className={`nav-link ${isActive('/research') ? 'active' : ''}`}
          onClick={onClose}
        >
          🔬 AI Research
        </Link>

        <Link
          to="/data-loader"
          className={`nav-link ${isActive('/data-loader') ? 'active' : ''}`}
          onClick={onClose}
        >
          📊 Data Loader
        </Link>

        <div className="nav-section-title" style={{ marginTop: '20px' }}>Settings</div>

        <Link
          to="/settings"
          className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
          onClick={onClose}
        >
          ⚙️ Settings
        </Link>
      </nav>

      <div className="sidebar-footer">
        <p>Patient Records v1.0</p>
      </div>
    </aside>
  )
}
