import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ArrowRight, Lightbulb, BarChart3, Download, Users, Network, Settings, Globe, Shield, CheckSquare, ClipboardCheck, Zap, Target, Play, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/shared/Header';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import DomainCompetencyPanel from '@/components/executive/DomainCompetencyPanel';

const DOMAINS = [
{
  name: 'Professional Engagement',
  color: '#6B4C9A',
  icon: Users,
  description: 'Engage in the healthcare quality profession with a commitment to practicing ethically, enhancing one\'s competence and advancing the field.'
},
{
  name: 'Quality Leadership & Integration',
  color: '#003DA5',
  icon: Network,
  description: 'Advance the organization\'s commitment to healthcare quality through collaboration, learning opportunities and communication.'
},
{
  name: 'Performance & Process Improvement',
  color: '#00B5E2',
  icon: Settings,
  description: 'Use performance and process improvement, project management and change management methods to support quality initiatives.'
},
{
  name: 'Population Health & Care Transitions',
  color: '#8BC53F',
  icon: Globe,
  description: 'Evaluate and improve healthcare processes and care transitions to advance the efficient, effective and safe care of defined populations.'
},
{
  name: 'Health Data Analytics',
  color: '#F68B1F',
  icon: BarChart3,
  description: 'Leverage the organization\'s analytic environment to help guide data driven decision making and inform quality improvement initiatives.'
},
{
  name: 'Patient Safety',
  color: '#009CA6',
  icon: Shield,
  description: 'Cultivate a safe healthcare environment by promoting safe practices, nurturing a just culture and improving processes that detect, mitigate or prevent harm.'
},
{
  name: 'Regulatory & Accreditation',
  color: '#ED1C24',
  icon: CheckSquare,
  description: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with internal and external requirements.'
},
{
  name: 'Quality Review & Accountability',
  color: '#99154B',
  icon: ClipboardCheck,
  description: 'Direct activities that support compliance with voluntary, mandatory and contractual reporting requirements.'
}];


export default function OrganizationalFramework() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="Executive" />
      
      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 motion-reduce:opacity-100"
          aria-label="Breadcrumb">
          
          <Link to={createPageUrl('Home')} className="hover:text-[#0077AA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077AA] rounded">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#0077AA] font-medium" aria-current="page">Explore the Framework</span>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between motion-reduce:transform-none motion-reduce:opacity-100">
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#3D3D3D] mb-2">
              Healthcare Quality Competency Framework™
            </h1>
            <p className="text-gray-600 text-sm">The foundation of your professional development</p>
          </div>
          <Button className="bg-white border-2 border-[#0077AA] text-[#0077AA] hover:bg-blue-50 rounded-xl whitespace-nowrap ml-4 px-6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077AA]">
            <Download className="w-5 h-5 mr-2" aria-hidden="true" />
            Download Framework
          </Button>
        </motion.div>

        {/* Hero Section with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#009FE8] to-[#3D3D3D] rounded-3xl p-8 md:p-12 mb-10 relative overflow-hidden motion-reduce:transform-none motion-reduce:opacity-100">
          
          {/* Abstract Background Shapes — decorative */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <pattern id="dots-hero" width="50" height="50" patternUnits="userSpaceOnUse">
                  <circle cx="25" cy="25" r="1" fill="white" opacity="0.08" />
                </pattern>
              </defs>
              
              {/* Circles */}
              <circle cx="150" cy="100" r="120" fill="none" stroke="white" strokeWidth="1.5" opacity="0.1" />
              <circle cx="200" cy="150" r="80" fill="none" stroke="white" strokeWidth="1" opacity="0.08" />
              <circle cx="850" cy="80" r="150" fill="none" stroke="white" strokeWidth="1" opacity="0.12" />
              <circle cx="900" cy="280" r="100" fill="none" stroke="white" strokeWidth="1" opacity="0.1" />
              
              {/* Curved paths */}
              <path d="M 0 200 Q 250 100 500 200 T 1000 200" stroke="white" strokeWidth="2" fill="none" opacity="0.1" />
              <path d="M 0 300 Q 300 200 600 300 T 1000 300" stroke="white" strokeWidth="1.5" fill="none" opacity="0.08" />
              
              {/* Grid pattern */}
              <rect width="1000" height="400" fill="url(#dots-hero)" />
              
              {/* Diagonal lines */}
              <line x1="0" y1="0" x2="250" y2="400" stroke="white" strokeWidth="1" opacity="0.06" />
              <line x1="750" y1="0" x2="1000" y2="400" stroke="white" strokeWidth="1" opacity="0.06" />
            </svg>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div>
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png"
                alt="NAHQ logo"
                className="h-8 mb-6 brightness-0 invert" />
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                Healthcare Quality<br />Competency Framework™
              </h2>
              <p className="text-white leading-relaxed text-xs md:text-sm">The expert-created Framework provides a common vocabulary, knowledge and toolset, ensuring alignment across everyone who plays a role in quality and safety.</p>
            </div>

            {/* Right Stats */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">8</div>
                <div className="text-white text-sm font-medium">Domains</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">28</div>
                <div className="text-white text-sm font-medium">Competencies</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-white mb-2">600+</div>
                <div className="text-white text-sm font-medium">Skills</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Framework Diagram and Understanding Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid md:grid-cols-2 gap-12 mb-12 motion-reduce:transform-none motion-reduce:opacity-100">
          
          {/* Framework Graphic */}
          <div className="rounded-2xl overflow-hidden h-full flex items-center justify-center bg-white">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698e86d0da7ae0691d104f62/34e136195_Framework_FINAL1.png"
              alt="NAHQ Healthcare Quality Competency Framework"
              className="w-full h-full object-contain" />
            
          </div>

          {/* Understanding Section */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Lightbulb className="w-6 h-6 text-[#00A3E0]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#3D3D3D]">Understanding the Framework</h3>
            </div>
            
            <p className="text-sm text-gray-700 leading-relaxed mb-6">The NAHQ Healthcare Quality Competency Framework™ is the industry-standard, defining the quality and safety competencies, skills and behaviors required to advance quality and safety excellence across the healthcare continuum.</p>

            <ul className="space-y-4 list-none">
              <li className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-[#00A3E0] mt-1 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm text-[#3D3D3D]">
                  <strong>Developmental, Not Evaluative:</strong> <span className="text-gray-700">The framework is designed to help you grow — not to grade you. Use it to identify where you are and where you want to go.</span>
                </p>
              </li>

              <li className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-[#00A3E0] mt-1 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm text-[#3D3D3D]">
                  <strong>Grounded in Practice:</strong> <span className="text-gray-700">Built from the real work of healthcare quality professionals across settings, roles, and experience levels.</span>
                </p>
              </li>

              <li className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-[#00A3E0] mt-1 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm text-[#3D3D3D]">
                  <strong>A Common Language:</strong> <span className="text-gray-700">Shared vocabulary for quality professionals, leaders, and organizations to align on expectations and development.</span>
                </p>
              </li>

              <li className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-[#00A3E0] mt-1 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm text-[#3D3D3D]">
                  <strong>Career Pathways:</strong> <span className="text-gray-700">Maps a clear trajectory from Foundational to Advanced across all 8 domains, supporting intentional career growth.</span>
                </p>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* The 8 Domains */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 motion-reduce:transform-none motion-reduce:opacity-100">
          
          <h2 className="text-xl font-bold text-[#3D3D3D] mb-2">The 8 Domains</h2>
          <p className="text-gray-600 text-sm mb-8">Select any domain to explore its competencies and understand proficiency expectations at each level.</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOMAINS.map((domain, index) =>
            <motion.button
              key={domain.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              onClick={() => {
                setSelectedDomain(domain);
                setPanelOpen(true);
              }}
              aria-label={`Explore ${domain.name} domain`}
              className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-transparent cursor-pointer transition-all duration-300 group text-left w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077AA] motion-reduce:transform-none">
              
                <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 motion-reduce:transform-none"
                style={{ backgroundColor: `${domain.color}15` }}
                aria-hidden="true">
                
                  <domain.icon className="w-6 h-6" style={{ color: domain.color }} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-[#3D3D3D] text-sm mb-2 leading-tight">{domain.name}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{domain.description}</p>
                
                <div
                className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs font-medium transition-colors"
                style={{ color: domain.color }}
                aria-hidden="true">
                  Learn More
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform motion-reduce:transform-none" aria-hidden="true" />
                </div>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Skill Levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-[#009FE8] to-[#3D3D3D] rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden motion-reduce:transform-none motion-reduce:opacity-100">
          
          {/* Abstract Background Shapes — decorative */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              {/* Circles */}
              <circle cx="100" cy="80" r="80" fill="white" opacity="0.08" />
              <circle cx="1100" cy="200" r="120" fill="white" opacity="0.06" />
              <circle cx="600" cy="250" r="100" fill="white" opacity="0.05" />
              
              {/* Curved paths */}
              <path d="M -100 150 Q 300 50 600 150 T 1300 150" stroke="white" strokeWidth="2" fill="none" opacity="0.08" />
              <path d="M 0 250 Q 400 150 800 250" stroke="white" strokeWidth="1.5" fill="none" opacity="0.06" />
            </svg>
          </div>

          <div className="relative z-10">
            <h3 className="font-bold text-2xl text-white mb-6">Three Levels identified for each competency</h3>
            

            

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-white/40 text-white flex items-center justify-center text-sm font-bold" aria-hidden="true">1</span>
                  <h4 className="font-bold text-white text-base">Foundational</h4>
                </div>
                <p className="text-sm font-semibold text-[#FFED00] mb-4">I KNOW</p>
                <ul className="text-xs text-white space-y-2">
                  <li>• Working knowledge of concepts</li>
                  <li>• Complete tasks with guidance</li>
                  <li>• Discussing, Identifying, Participating</li>
                </ul>
              </div>

              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-white/40 text-white flex items-center justify-center text-sm font-bold" aria-hidden="true">2</span>
                  <h4 className="font-bold text-white text-base">Proficient</h4>
                </div>
                <p className="text-sm font-semibold text-[#FFED00] mb-4">I DO</p>
                <ul className="text-xs text-white space-y-2">
                  <li>• Deep understanding of concepts</li>
                  <li>• Work independently &amp; holistically</li>
                  <li>• Creating, Developing, Implementing</li>
                </ul>
              </div>

              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-white/40 text-white flex items-center justify-center text-sm font-bold" aria-hidden="true">3</span>
                  <h4 className="font-bold text-white text-base">Advanced</h4>
                </div>
                <p className="text-sm font-semibold text-[#FFED00] mb-4">I LEAD</p>
                <ul className="text-xs text-white space-y-2">
                  <li>• Nuanced, strategic understanding</li>
                  <li>• Assess competence of others</li>
                  <li>• Coaching, Advancing, Empowering</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>


      </main>

      {/* Domain Competency Panel */}
      <DomainCompetencyPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        type="domain"
        name={selectedDomain?.name} />
      

      <FloatingChatButton onClick={() => {}} aria-label="Open AI chat assistant" />
    </div>);

}