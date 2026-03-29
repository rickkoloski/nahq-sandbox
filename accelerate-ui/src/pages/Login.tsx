import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../api/auth'

const DEMO_ACCOUNTS = [
  { email: 'admin@nahq.org', label: 'NAHQ Administrator', role: 'Admin', desc: 'Full platform access — manage orgs, seed data, view all dashboards' },
  { email: 'sarah.chen@tgh.org', label: 'Sarah Chen', role: 'Executive', desc: 'Tampa General Hospital — org dashboard, workforce insights, AI reports' },
  { email: 'michael.reeves@tgh.org', label: 'Michael Reeves', role: 'Participant', desc: 'Tampa General Hospital — individual assessment, gap analysis, upskill plan' },
]

export function Login() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (loginEmail: string) => {
    setError('')
    setSubmitting(true)
    const success = await login(loginEmail)
    setSubmitting(false)
    if (success) {
      navigate('/')
    } else {
      setError('Account not found. Try one of the demo accounts below.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-light text-nahq-charcoal mb-2">Admin Sign In</h1>
          <p className="text-nahq-gray mb-8">Access the NAHQ Governance Portal.</p>

          <button
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 text-sm hover:bg-gray-50 transition-colors mb-4"
            onClick={() => handleLogin('admin@nahq.org')}
          >
            <svg width="20" height="20" viewBox="0 0 21 21"><path fill="#f25022" d="M0 0h10v10H0z"/><path fill="#7fba00" d="M11 0h10v10H11z"/><path fill="#00a4ef" d="M0 11h10v10H0z"/><path fill="#ffb900" d="M11 11h10v10H11z"/></svg>
            Sign in with Microsoft
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-nahq-gray">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(email) }}>
            <label className="block text-sm font-medium text-nahq-charcoal mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@nahq.org"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm mb-4 focus:outline-none focus:border-cyan"
            />

            {error && <p className="text-red text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !email}
              className="w-full py-3 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--cyan-primary)' }}
            >
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-nahq-gray mt-6 text-center">
            Need access? Contact your NAHQ administrator
          </p>

          {/* Demo accounts */}
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h3 className="text-xs font-semibold text-nahq-gray tracking-wider mb-3">DEMO ACCOUNTS</h3>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map(acct => (
                <button
                  key={acct.email}
                  onClick={() => handleLogin(acct.email)}
                  className="w-full text-left border border-gray-200 rounded-lg p-3 hover:border-cyan hover:bg-cyan-light/30 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-nahq-charcoal">{acct.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-nahq-gray">{acct.role}</span>
                  </div>
                  <div className="text-xs text-nahq-gray mt-1">{acct.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side — branding panel (matching Tim's login design) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00A3E0 0%, #0077B6 100%)' }}>
        <div className="text-center text-white relative z-10">
          <div className="text-4xl font-bold mb-4">NAHQ<sup className="text-lg">®</sup></div>
          <p className="text-sm tracking-wider opacity-80 mb-8">National Association for Healthcare Quality</p>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-left max-w-xs mx-auto">
            <div className="text-xs tracking-wider opacity-70 mb-3">PARTICIPATION OVERVIEW</div>
            {['Core Quality', 'Clinical Bridge', 'Senior Leadership', 'Frontline Care'].map((name, i) => (
              <div key={name} className="flex justify-between items-center mb-2">
                <span className="text-sm opacity-90">{name}</span>
                <span className="text-sm font-medium">{[87, 74, 91, 62][i]}%</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-light mt-8 mb-2">Workforce Intelligence at Scale</h2>
          <p className="text-sm opacity-80 max-w-xs mx-auto">
            Track assessment participation, benchmark performance, and competency
            gaps across all your client organizations in one place.
          </p>
        </div>
        <div className="absolute top-16 right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-20 left-12 w-48 h-48 rounded-full bg-white/5" />
      </div>
    </div>
  )
}
