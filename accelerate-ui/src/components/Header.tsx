import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../api/auth'

const ADMIN_NAV = [
  { path: '/admin', label: 'Home' },
  { path: '/executive-dashboard?orgId=1', label: 'Org Dashboard' },
  { path: '/user-dashboard?userId=2', label: 'User View' },
]

export function Header({ variant = 'admin' }: { variant?: 'admin' | 'accelerate' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = user?.primaryRole === 'admin' ? ADMIN_NAV : []

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-2xl font-bold" style={{ color: 'var(--cyan-primary)' }}>NAHQ</span>
          <span className="text-sm font-bold text-nahq-charcoal tracking-wider">
            {variant === 'admin' ? 'ADMIN' : 'Accelerate'}
          </span>
        </Link>

        {navItems.length > 0 && (
          <nav className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === item.path.split('?')[0]
                    ? 'bg-cyan-light text-cyan font-medium'
                    : 'text-nahq-gray hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-sm text-nahq-gray">
                {user.firstName} {user.lastName}
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">{user.primaryRole}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-nahq-gray hover:text-nahq-charcoal transition-colors"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
