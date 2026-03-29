import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { ExecutiveDashboard } from './pages/ExecutiveDashboard'
import { UserDashboard } from './pages/UserDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
