import { Link, useLocation } from 'react-router-dom'
import { LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/organizations', label: 'Organizations' },
  { path: '/benchmarks', label: 'Benchmarks' },
]

export function Header({ variant = 'admin' }: { variant?: 'admin' | 'accelerate' }) {
  const location = useLocation()

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-2xl font-bold" style={{ color: 'var(--cyan-primary)' }}>NAHQ</span>
          <span className="text-sm font-bold text-nahq-charcoal tracking-wider">
            {variant === 'admin' ? 'ADMIN' : 'Accelerate'}
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-cyan-light text-cyan font-medium'
                  : 'text-nahq-gray hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="text-sm text-nahq-gray">Admin</span>
          <button className="flex items-center gap-2 text-sm text-nahq-gray hover:text-nahq-charcoal transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
