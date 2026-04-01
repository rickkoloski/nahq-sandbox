import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Target, BookOpen, Shield, Settings } from 'lucide-react'
import { Header } from '../components/Header'
import { api } from '../api/client'
import type { PlatformStats } from '../types/api'

export function Home() {
  const [stats, setStats] = useState<PlatformStats | null>(null)

  useEffect(() => {
    api.platformStats().then(setStats).catch(() => {})
  }, [])

  const cards = [
    { icon: Users, title: 'Client & User Management', desc: 'Manage client organizations, invite users, assign roles, and control access across all sites', stat: stats ? `${stats.organizations} Clients · ${stats.users} Users` : 'Loading...', href: '/executive-dashboard', color: '#00A3E0' },
    { icon: Target, title: 'Benchmarks & Standards', desc: 'Define role benchmarks, peer groups, and governance standards', stat: stats ? `${stats.domains} Domains · ${stats.competencies} Competencies` : 'Loading...', href: '/executive-dashboard', color: '#F68B1F' },
    { icon: BookOpen, title: 'Learning Governance', desc: 'Manage score-to-content mapping rules and LMS catalog', stat: stats ? `${stats.courses} Courses` : 'Loading...', href: '/executive-dashboard', color: '#8BC53F' },
    { icon: Shield, title: 'User Access & Permissions', desc: 'Manage user access, revoke accounts, and initiate password resets', stat: stats ? `${stats.users} Users` : 'Loading...', href: '/executive-dashboard', color: '#6B4C9A' },
    { icon: Settings, title: 'Platform Admins', desc: 'Invite and manage NAHQ staff who have admin access to this governance portal', stat: '1 Admin', href: '#', color: '#99154B' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="rounded-2xl p-10 mb-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #E6F6FC 0%, #C5D7DD 100%)' }}>
          <div className="relative z-10">
            <img src="/images/nahq-logo.png" alt="NAHQ" className="h-10 w-auto mb-1" />
            <h1 className="text-4xl font-light text-nahq-charcoal mb-2">
              Workforce Accelerator<br />Governance Portal
            </h1>
            <p className="text-nahq-gray max-w-xl">
              Manage organizations, configure benchmarks, govern learning pathways,
              and oversee the entire Workforce Accelerator ecosystem from one central hub.
            </p>
          </div>
          <div className="absolute top-8 right-12 w-48 h-48 rounded-full bg-white/20" />
          <div className="absolute -bottom-8 right-32 w-32 h-32 rounded-full bg-white/15" />
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {cards.slice(0, 3).map(card => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          {cards.slice(3).map(card => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>
      </main>
    </div>
  )
}

function DashboardCard({ icon: Icon, title, desc, stat, href, color }: {
  icon: typeof Users, title: string, desc: string, stat: string, href: string, color: string
}) {
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
