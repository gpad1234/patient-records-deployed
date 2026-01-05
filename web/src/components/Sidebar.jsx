import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Calendar } from 'lucide-react'

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
    window.location.reload()
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* User Info */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-600 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

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

        <Link
          to="/appointments"
          className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}
          onClick={onClose}
        >
          📅 Appointments
        </Link>

        <Link
          to="/imaging"
          className={`nav-link ${isActive('/imaging') ? 'active' : ''}`}
          onClick={onClose}
        >
          🏥 Medical Imaging
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

        <button
          onClick={handleLogout}
          className="nav-link w-full text-left flex items-center gap-2 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>

      <div className="sidebar-footer">
        <p>Patient Records v1.0</p>
      </div>
    </aside>
  )
}
