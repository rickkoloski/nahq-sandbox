import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, MoreVertical } from 'lucide-react'
import { useAuth } from '../api/auth'

const ADMIN_NAV = [
  { path: '/admin', label: 'Home' },
  { path: '/executive-dashboard', label: 'Org Dashboard' },
  { path: '/individual-dashboard', label: 'User View' },
]

/**
 * Overflow menu items — alternative UI views retained for comparison.
 * Pattern: primary experience is in the main nav; alternatives live here
 * with documentation of what each demonstrates.
 */
const OVERFLOW_ITEMS = [
  {
    path: '/user-dashboard',
    label: 'Original Dashboard',
    description: 'This is the original scaffold participant dashboard. See IndividualDashboard for Tim\'s approved participant experience.',
  },
]

export function Header({ variant = 'admin' }: { variant?: 'admin' | 'accelerate' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [overflowOpen, setOverflowOpen] = useState(false)
  const overflowRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Close overflow on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setOverflowOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navItems = user?.primaryRole === 'admin' ? ADMIN_NAV : []

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/images/nahq-logo.png" alt="NAHQ" className="h-10 w-auto" />
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

        <div className="flex items-center gap-3">
          {user && (
            <>
              <span className="text-sm text-nahq-gray">
                {user.firstName} {user.lastName}
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">{user.primaryRole}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-nahq-gray hover:text-nahq-charcoal transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>

              {/* Overflow menu — alternative views */}
              <div className="relative" ref={overflowRef}>
                <button
                  onClick={() => setOverflowOpen(o => !o)}
                  aria-haspopup="menu"
                  aria-expanded={overflowOpen}
                  aria-label="More options"
                  className="p-1 rounded-md text-nahq-gray hover:text-nahq-charcoal hover:bg-gray-50 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                {overflowOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-64 py-1"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                      Alternative Views
                    </div>
                    {OVERFLOW_ITEMS.map(item => (
                      <button
                        key={item.path}
                        role="menuitem"
                        onClick={() => {
                          navigate(item.path + (location.search || ''))
                          setOverflowOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <p className="text-sm font-medium text-nahq-charcoal">{item.label}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{item.description}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
