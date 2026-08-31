import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import ErpModulePage from './pages/ErpModulePage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProjectFormPage from './pages/ProjectFormPage'
import ProjectListPage from './pages/ProjectListPage'
import VendorRegistrationPage from './pages/VendorRegistrationPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectListPage />} />
        <Route path="projects/new" element={<ProjectFormPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="projects/:id/edit" element={<ProjectFormPage />} />
        <Route path="erp/subcontract/vendor-registrations" element={<VendorRegistrationPage />} />
        <Route path="erp/:moduleKey" element={<ErpModulePage />} />
        <Route path="resources" element={<Navigate to="/erp/material" replace />} />
        <Route path="workforce" element={<Navigate to="/erp/hr" replace />} />
        <Route path="finance" element={<Navigate to="/erp/accounting" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
