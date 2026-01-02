import { Link } from 'react-router-dom'
import { Calendar, Bell, User } from 'lucide-react'

export default function Header({ onMenuClick }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <header className="app-header">
      <div className="header-brand">
        <button className="menu-toggle" onClick={onMenuClick} aria-label="Toggle menu">
          ☰
        </button>
        <div className="brand-copy">
          <div className="brand-mark">PR</div>
          <div>
            <h1>Patient Records</h1>
            <p>Your care team, organized.</p>
          </div>
        </div>
      </div>
      <div className="header-actions">
        <Link to="/appointments" className="header-pill">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Link>
        <button className="header-pill header-pill--outline">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </button>
        {user.firstName && (
          <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg border border-white/20">
            <User className="w-4 h-4 text-white" />
            <div className="text-sm">
              <div className="font-medium text-white">{user.firstName}</div>
              <div className="text-xs text-white/70 capitalize">{user.role}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
