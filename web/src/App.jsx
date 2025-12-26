import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PatientList from './pages/PatientList'
import PatientDetail from './pages/PatientDetail'
import AddPatient from './pages/AddPatient'
import Research from './pages/Research'
import DataLoader from './pages/DataLoader'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/patients/new" element={<AddPatient />} />
          <Route path="/research" element={<Research />} />
          <Route path="/data-loader" element={<DataLoader />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
