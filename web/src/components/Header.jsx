export default function Header({ onMenuClick }) {
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
        <button className="header-pill">Schedule</button>
        <button className="header-pill header-pill--outline">Notifications</button>
      </div>
    </header>
  )
}
