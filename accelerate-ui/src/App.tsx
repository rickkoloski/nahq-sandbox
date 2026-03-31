import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './api/auth'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { UserDashboard } from './pages/UserDashboard'
import { IndividualHome } from './pages/IndividualHome'
import { IndividualDashboard } from './pages/IndividualDashboard'
import { ExecutiveDashboardV2 } from './pages/ExecutiveDashboardV2'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8 text-nahq-gray">Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.some(r => user.roles.includes(r))) {
    return <Navigate to="/" />
  }
  return <>{children}</>
}

function RoleBasedHome() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />

  switch (user.primaryRole) {
    case 'admin':
      return <Home />
    case 'executive':
      return <ExecutiveDashboardV2 />
    case 'participant':
      return <IndividualHome />
    default:
      return <Home />
  }
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><RoleBasedHome /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Home /></ProtectedRoute>} />
          <Route path="/executive-dashboard" element={<ProtectedRoute allowedRoles={['admin', 'executive']}><ExecutiveDashboardV2 /></ProtectedRoute>} />
          <Route path="/individual-dashboard" element={<ProtectedRoute><IndividualDashboard /></ProtectedRoute>} />
          <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
