import { Link } from 'react-router-dom'
import { Users, Target, BookOpen, Shield, Settings } from 'lucide-react'
import { Header } from '../components/Header'

const CARDS = [
  { icon: Users, title: 'Client & User Management', desc: 'Manage client organizations, invite users, assign roles, and control access across all sites', stat: '3 Clients · 100 Users', href: '/organizations', color: '#00A3E0' },
  { icon: Target, title: 'Benchmarks & Standards', desc: 'Define role benchmarks, peer groups, and governance standards', stat: '8 Domains', href: '/benchmarks', color: '#F68B1F' },
  { icon: BookOpen, title: 'Learning Governance', desc: 'Manage score-to-content mapping rules and LMS catalog', stat: '39 Courses', href: '/courses', color: '#8BC53F' },
  { icon: Shield, title: 'User Access & Permissions', desc: 'Manage user access, revoke accounts, and initiate password resets', stat: '100 Users', href: '/organizations', color: '#6B4C9A' },
  { icon: Settings, title: 'Platform Admins', desc: 'Invite and manage NAHQ staff who have admin access to this governance portal', stat: '1 Admin', href: '#', color: '#99154B' },
]

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero — matching Tim's gradient banner */}
        <div className="rounded-2xl p-10 mb-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E6F6FC 0%, #C5D7DD 100%)' }}>
          <div className="relative z-10">
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--cyan-primary)' }}>NAHQ</div>
            <h1 className="text-4xl font-light text-nahq-charcoal mb-2">
              Workforce Accelerator<br />Governance Portal
            </h1>
            <p className="text-nahq-gray max-w-xl">
              Manage organizations, configure benchmarks, govern learning pathways,
              and oversee the entire Workforce Accelerator ecosystem from one central hub.
            </p>
          </div>
          {/* Decorative circles — matching Tim's bg pattern */}
          <div className="absolute top-8 right-12 w-48 h-48 rounded-full bg-white/20" />
          <div className="absolute -bottom-8 right-32 w-32 h-32 rounded-full bg-white/15" />
        </div>

        {/* Dashboard Cards — matching Tim's 3+2 grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {CARDS.slice(0, 3).map(card => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          {CARDS.slice(3).map(card => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>
      </main>
    </div>
  )
}

function DashboardCard({ icon: Icon, title, desc, stat, href, color }: typeof CARDS[0]) {
  return (
    <Link
      to={href}
      className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-sm transition-all group"
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: color + '15' }}>
        <Icon size={24} style={{ color }} />
      </div>
      <h3 className="font-semibold text-nahq-charcoal mb-2 group-hover:text-cyan transition-colors">{title}</h3>
      <p className="text-sm text-nahq-gray mb-4">{desc}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color }}>{stat}</span>
        <span className="text-nahq-gray group-hover:text-cyan transition-colors">→</span>
      </div>
    </Link>
  )
}
