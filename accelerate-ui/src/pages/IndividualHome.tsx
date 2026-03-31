/**
 * Ported from Tim's Base44 prototype: Individual Experience v03 / IndividualHome.jsx
 *
 * Preserved: layout, animations, hero banner, radial SVG, 3-step journey cards, color tokens
 * Replaced: createPageUrl → React Router paths, @/utils → local imports, userName → auth context
 * Removed: Base44 SDK dependency, AssessmentIntroModal (not yet implemented)
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Globe, ClipboardList, BarChart3 } from 'lucide-react'
import { useAuth } from '../api/auth'

function getWelcomeMessage() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const STEPS = [
  {
    number: '1',
    icon: Globe,
    title: 'Explore the Framework',
    description: 'Learn about the 8 domains and 29 competencies identified in the NAHQ Healthcare Quality Competency Framework™ before you begin.',
    action: 'Explore Framework',
    href: '/individual-dashboard',
    color: '#00A3E0',
    bg: 'from-[#00A3E0]/8 to-[#00A3E0]/4',
    border: 'border-[#00A3E0]/30',
    time: '5–10 minutes',
    isPrimary: false,
    locked: false,
  },
  {
    number: '2',
    icon: ClipboardList,
    title: 'Take Your Assessment',
    description: 'Complete the self-assessment to understand your current competency levels across all domains.',
    action: 'Start Assessment',
    href: '/individual-dashboard',
    color: '#FFED00',
    bg: 'bg-white',
    border: 'border-[#FFED00]',
    time: '30 minutes',
    isPrimary: true,
    locked: false,
  },
  {
    number: '3',
    icon: BarChart3,
    title: 'View Your Results',
    description: 'See your personalized results, identify development priorities, and start your custom upskilling plan.',
    action: 'View My Dashboard',
    href: '/individual-dashboard',
    color: '#3D3D3D',
    bg: 'from-[#3D3D3D]/8 to-[#3D3D3D]/4',
    border: 'border-[#3D3D3D]/20',
    time: 'After assessment',
    isPrimary: false,
    locked: false,
  },
]

export function IndividualHome() {
  const { user, logout } = useAuth()
  const firstName = user?.firstName || 'there'

  return (
    <div className="min-h-screen bg-white">
      {/* Header — ported from Tim's shared/Header.jsx */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/nahq-logo.png" alt="NAHQ" className="h-10 w-auto" />
              <span className="hidden sm:block text-sm font-semibold text-[#3D3D3D] border-l border-gray-300 pl-3">
                Accelerate
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00A3E0]/10 flex items-center justify-center">
                <span className="text-sm font-medium text-[#00A3E0]">{firstName[0]}</span>
              </div>
              <span className="hidden sm:block font-medium text-sm text-gray-700">{user?.firstName} {user?.lastName}</span>
              <button onClick={() => { logout(); window.location.href = '/login' }} className="ml-2 text-gray-400 hover:text-gray-600 text-sm">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">

        {/* Welcome — from Tim's prototype */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-[#3D3D3D]">
            {getWelcomeMessage()}, {firstName}
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl text-sm">
            Welcome to your personal development journey. Follow the steps below to explore the
            NAHQ Competency Framework, complete your assessment, and unlock your personalized upskill plan.
          </p>
        </motion.div>

        {/* Hero banner — Tim's gradient + radial SVG, preserved exactly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          role="region"
          aria-label="NAHQ Workforce Accelerator Journey overview"
          className="rounded-2xl mb-12 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}
        >
          {/* Abstract background shapes — Tim's SVG */}
          {/* Decorative background shapes — CSS positioned to avoid SVG % warnings */}
          <div className="absolute top-[-10%] right-[5%] w-[440px] h-[440px] rounded-full bg-white/[0.08]" />
          <div className="absolute bottom-[-20%] left-[60%] w-[360px] h-[360px] rounded-full bg-white/[0.06]" />
          <div className="absolute top-[30%] left-[2%] w-[280px] h-[280px] rounded-full bg-white/[0.05]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-10">
            {/* Left: text */}
            <div className="flex-1">
              <img src="/images/nahq-logo.png" alt="NAHQ" className="h-8 w-auto mb-5" />
              <h2 className="text-3xl font-bold text-white leading-tight mb-3">
                Your Workforce<br />Accelerator Journey
              </h2>
              <p className="text-white/90 text-sm leading-relaxed max-w-sm">
                Assess how your work today aligns with the needs of your role, and close gaps,
                building the skills and competencies required to deliver healthcare quality excellence.
              </p>
            </div>

            {/* Right: radial graphic with stats — Tim's SVG, preserved exactly */}
            <div className="flex-shrink-0 flex items-center justify-center w-full md:w-72"
                 aria-label="Framework overview: 8 domains, 29 competencies, 3 levels" role="img">
              <div className="relative w-64 h-64" aria-hidden="true">
                <svg aria-hidden="true" className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <circle cx="128" cy="128" r="85" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <circle cx="128" cy="128" r="60" fill="rgba(255,255,255,0.06)" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                    const rad = angle * Math.PI / 180
                    const x1 = 128 + 62 * Math.cos(rad)
                    const y1 = 128 + 62 * Math.sin(rad)
                    const x2 = 128 + 108 * Math.cos(rad)
                    const y2 = 128 + 108 * Math.sin(rad)
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  })}
                  <path
                    d="M 128 18 A 110 110 0 0 1 238 128 A 110 110 0 0 1 128 238 A 110 110 0 0 1 36 68"
                    fill="none" stroke="rgba(0,163,224,0.5)" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="128" cy="128" r="42" fill="rgba(61,61,61,0.35)" />
                </svg>

                {/* Centre label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-white text-3xl font-bold leading-none">8</p>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest mt-1">Domains</p>
                </div>

                {/* Floating stat bubbles — Tim's design */}
                {[
                  { label: 'Competencies', value: '29', angle: -55, dist: 118 },
                  { label: 'Avg Time', value: '45m', angle: 30, dist: 118 },
                  { label: 'Pathways', value: '∞', angle: 140, dist: 112 },
                  { label: 'Levels', value: '3', angle: 210, dist: 118 },
                ].map(({ label, value, angle, dist }) => {
                  const rad = angle * Math.PI / 180
                  const cx = 128 + dist * Math.cos(rad)
                  const cy = 128 + dist * Math.sin(rad)
                  const left = `${cx / 256 * 100}%`
                  const top = `${cy / 256 * 100}%`
                  return (
                    <div key={label}
                      className="absolute -translate-x-1/2 -translate-y-1/2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-center"
                      style={{ left, top }}>
                      <p className="text-white font-bold text-sm leading-none">{value}</p>
                      <p className="text-white/60 text-[9px] mt-0.5 leading-none">{label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3-step journey — Tim's card design, preserved */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-bold text-[#3D3D3D] mb-6">Your Journey</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className={`relative rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col h-full ${
                  step.isPrimary ? step.bg : `bg-gradient-to-br ${step.bg}`
                } ${step.border} ${step.locked ? 'opacity-60' : ''}`}
              >
                {/* Number badge */}
                <div
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: step.color, color: step.isPrimary ? '#3D3D3D' : '#ffffff' }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: `${step.color}22` }}>
                  <step.icon className="w-7 h-7" style={{ color: step.isPrimary ? '#3D3D3D' : step.color }} />
                </div>

                <h3 className="text-lg font-semibold text-[#3D3D3D] mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{step.description}</p>

                <div>
                  <Link to={step.href}>
                    <button
                      className="w-full py-2.5 px-4 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: step.color, color: step.isPrimary ? '#3D3D3D' : '#ffffff' }}
                    >
                      {step.action}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-4">
                    <Clock className="w-3 h-3" />
                    <span>{step.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
