import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="app-layout">
      <Header onMenuClick={toggleSidebar} />
      <div className="app-content">
        <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <div className="main-view">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
