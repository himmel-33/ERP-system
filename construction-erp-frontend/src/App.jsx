import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import PlaceholderPage from './pages/PlaceholderPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProjectFormPage from './pages/ProjectFormPage'
import ProjectListPage from './pages/ProjectListPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/projects" replace />} />
        <Route path="projects" element={<ProjectListPage />} />
        <Route path="projects/new" element={<ProjectFormPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="projects/:id/edit" element={<ProjectFormPage />} />
        <Route path="dashboard" element={<PlaceholderPage title="대시보드" />} />
        <Route path="resources" element={<PlaceholderPage title="자원/재료 관리" />} />
        <Route path="workforce" element={<PlaceholderPage title="인력 관리" />} />
        <Route path="finance" element={<PlaceholderPage title="재무/회계" />} />
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Route>
    </Routes>
  )
}

export default App
