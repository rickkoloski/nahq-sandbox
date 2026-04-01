/**
 * Framework exploration page — explains the NAHQ Healthcare Quality Competency Framework.
 * Linked from IndividualHome Step 1 ("Explore the Framework").
 * Informational only — no API data needed.
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Lightbulb,
  BarChart3,
  Users,
  Settings,
  Globe,
  Shield,
  CheckSquare,
  ClipboardCheck,
  Network,
} from 'lucide-react'
import { Header } from '../components/Header'

const DOMAINS = [
  { name: 'Professional Engagement', color: '#00A3E0', icon: Users, description: 'Engage in the healthcare quality profession with a commitment to practicing ethically, enhancing competence and advancing the field.' },
  { name: 'Quality Leadership and Integration', color: '#003DA5', icon: Network, description: 'Advance the organization\'s commitment to healthcare quality through collaboration, learning opportunities and communication.' },
  { name: 'Performance and Process Improvement', color: '#00B5E2', icon: Settings, description: 'Use performance and process improvement, project management and change management methods to support quality initiatives.' },
  { name: 'Population Health and Care Transitions', color: '#8BC53F', icon: Globe, description: 'Evaluate and improve healthcare processes and care transitions to advance the efficient, effective and safe care of defined populations.' },
  { name: 'Health Data Analytics', color: '#F68B1F', icon: BarChart3, description: 'Leverage the organization\'s analytic environment to help guide data driven decision making and inform quality improvement initiatives.' },
  { name: 'Patient Safety', color: '#ED1C24', icon: Shield, description: 'Cultivate a safe healthcare environment by promoting safe practices, nurturing a just culture and improving processes that detect, mitigate or prevent harm.' },
  { name: 'Regulatory and Accreditation', color: '#6B4C9A', icon: CheckSquare, description: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with internal and external requirements.' },
  { name: 'Quality Review and Accountability', color: '#99154B', icon: ClipboardCheck, description: 'Direct activities that support compliance with voluntary, mandatory and contractual reporting requirements.' },
]

export function Framework() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#00A3E0]">Home</Link>
          <span className="mx-1.5">&rsaquo;</span>
          <span className="text-[#3D3D3D] font-semibold">Explore the Framework</span>
        </nav>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-xl md:text-2xl font-bold text-[#3D3D3D] mb-2">Healthcare Quality Competency Framework&trade;</h1>
          <p className="text-gray-500 text-sm">The foundation of your professional development</p>
        </motion.div>

        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl mb-12 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}>
          {/* Decorative shapes */}
          <div className="absolute top-[-10%] right-[5%] w-[300px] h-[300px] rounded-full bg-white/[0.08]" />
          <div className="absolute bottom-[-20%] left-[60%] w-[240px] h-[240px] rounded-full bg-white/[0.06]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-10">
            <div className="flex-1">
              <img src="/images/nahq-logo.png" alt="NAHQ" className="h-8 w-auto mb-5" />
              <h2 className="text-3xl font-bold text-white leading-tight mb-3">Healthcare Quality<br />Competency Framework&trade;</h2>
              <p className="text-white/90 text-sm leading-relaxed max-w-sm">
                The expert-created Framework provides a common vocabulary, knowledge and toolset,
                ensuring alignment across everyone who plays a role in quality and safety.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
              {[
                { value: '8', label: 'Domains' },
                { value: '28', label: 'Competencies' },
                { value: '600+', label: 'Skills' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6 text-center">
                  <p className="text-4xl font-bold text-white mb-1">{value}</p>
                  <p className="text-sm text-white/90 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Understanding Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#00A3E0]/10 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-[#00A3E0]" />
            </div>
            <h2 className="text-lg font-bold text-[#3D3D3D]">Understanding the Framework</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mb-5">
            The NAHQ Healthcare Quality Competency Framework&trade; is the industry standard, defining the quality
            and safety competencies, skills and behaviors required to advance quality and safety excellence
            across the healthcare continuum.
          </p>
          <div className="space-y-3">
            {[
              { label: 'Developmental, Not Evaluative', desc: 'The framework is designed to help you grow — not grade you. Use it to identify where you are and where you want to go.' },
              { label: 'Grounded in Practice', desc: 'Built from the real work of healthcare quality professionals across settings, roles, and experience levels.' },
              { label: 'A Common Language', desc: 'Shared vocabulary for quality professionals, leaders, and organizations to align on expectations and development.' },
              { label: 'Career Pathways', desc: 'Maps a clear trajectory from Foundational to Advanced across all 8 domains, supporting intentional career growth.' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] mt-2 flex-shrink-0" />
                <div>
                  <span className="text-sm font-semibold text-[#3D3D3D]">{label}: </span>
                  <span className="text-sm text-gray-500">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 8 Domain Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
          <h2 className="text-xl font-bold text-[#3D3D3D] mb-2">The 8 Domains</h2>
          <p className="text-gray-500 text-sm mb-6">Click on any domain to explore its competencies and understand proficiency expectations at each level.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOMAINS.map((domain, index) => (
              <Link key={domain.name} to={`/domain-detail?domain=${encodeURIComponent(domain.name)}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-transparent cursor-pointer transition-all duration-300 group h-full"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${domain.color}15` }}>
                  <domain.icon className="w-6 h-6" style={{ color: domain.color }} />
                </div>
                <h3 className="font-semibold text-[#3D3D3D] text-sm mb-2 leading-tight">{domain.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{domain.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs font-medium"
                  style={{ color: domain.color }}>
                  Learn More
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Three Levels */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl mb-12 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}>
          <div className="absolute top-[-10%] right-[5%] w-[300px] h-[300px] rounded-full bg-white/[0.08]" />
          <div className="relative z-10 p-8">
            <h3 className="font-bold text-xl text-white mb-6">Three Levels identified for each competency</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { level: '1', name: 'Foundational', desc: 'Entry-level understanding and application. You can describe the concept and perform basic tasks with guidance.' },
                { level: '2', name: 'Proficient', desc: 'Independent application with depth. You can analyze situations, lead initiatives, and mentor others.' },
                { level: '3', name: 'Advanced', desc: 'Strategic leadership and innovation. You drive organizational change, set direction, and advance the field.' },
              ].map(({ level, name, desc }) => (
                <div key={name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-sm">{level}</span>
                  </div>
                  <h4 className="text-white font-bold mb-2">{name}</h4>
                  <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  )
}
