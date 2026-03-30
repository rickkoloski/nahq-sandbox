import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ArrowRight, Lightbulb, BarChart3, Download, Users, Network, Settings, Globe, Shield, CheckSquare, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/shared/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import DomainCompetencyPanel from '@/components/executive/DomainCompetencyPanel';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChat from '@/components/results/AIChat';

const DOMAINS = [
{ name: 'Professional Engagement', color: '#6B4C9A', icon: Users, description: "Engage in the healthcare quality profession with a commitment to practicing ethically, enhancing one's competence and advancing the field." },
{ name: 'Quality Leadership & Integration', color: '#003DA5', icon: Network, description: "Advance the organization's commitment to healthcare quality through collaboration, learning opportunities and communication." },
{ name: 'Performance & Process Improvement', color: '#00B5E2', icon: Settings, description: 'Use performance and process improvement, project management and change management methods to support quality initiatives.' },
{ name: 'Population Health & Care Transitions', color: '#8BC53F', icon: Globe, description: 'Evaluate and improve healthcare processes and care transitions to advance the efficient, effective and safe care of defined populations.' },
{ name: 'Health Data Analytics', color: '#F68B1F', icon: BarChart3, description: "Leverage the organization's analytic environment to help guide data driven decision making and inform quality improvement initiatives." },
{ name: 'Patient Safety', color: '#009CA6', icon: Shield, description: 'Cultivate a safe healthcare environment by promoting safe practices, nurturing a just culture and improving processes that detect, mitigate or prevent harm.' },
{ name: 'Regulatory & Accreditation', color: '#ED1C24', icon: CheckSquare, description: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with internal and external requirements.' },
{ name: 'Quality Review & Accountability', color: '#99154B', icon: ClipboardCheck, description: 'Direct activities that support compliance with voluntary, mandatory and contractual reporting requirements.' }];


export default function Framework() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelItem, setPanelItem] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const openDomainPanel = (domain) => {
    setPanelItem({ name: domain.name, type: 'domain' });
    setPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="Framework" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        <Breadcrumb items={[{ label: 'Explore the Framework' }]} />

        {/* Page Title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#3D3D3D] mb-2">
                Healthcare Quality Competency Framework™
              </h1>
              <p className="text-gray-500 text-sm">The foundation of your professional development</p>
            </div>
            <Button variant="outline" className="border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/10 px-6 shrink-0">
              <Download aria-hidden="true" className="w-5 h-5 mr-2" />
              Download Framework
            </Button>
          </div>
        </motion.div>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl mb-12 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}>
          
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <circle cx="85%" cy="-10%" r="220" fill="rgba(0,163,224,0.13)" />
            <circle cx="70%" cy="120%" r="180" fill="rgba(0,61,165,0.18)" />
            <circle cx="5%" cy="80%" r="140" fill="rgba(0,163,224,0.09)" />
            <ellipse cx="55%" cy="50%" rx="300" ry="120" fill="rgba(255,255,255,0.03)" transform="rotate(-20 55% 50%)" />
            <polygon points="80%,0 100%,0 100%,60%" fill="rgba(0,163,224,0.08)" />
            <polygon points="0,100% 30%,100% 0,40%" fill="rgba(61,61,61,0.15)" />
          </svg>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-10">
            <div className="flex-1">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png"
                alt="NAHQ"
                className="h-8 w-auto brightness-0 invert mb-5" />
              
              <h2 className="text-3xl font-bold text-white leading-tight mb-3">
                Healthcare Quality<br />Competency Framework™
              </h2>
              <p className="text-white/90 text-sm leading-relaxed max-w-sm mb-6">The expert-created Framework provides a common vocabulary, knowledge and toolset, ensuring alignment across everyone who plays a role in quality and safety.

              </p>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center gap-4 flex-wrap md:flex-nowrap">
              {[
              { value: '8', label: 'Domains' },
              { value: '28', label: 'Competencies' },
              { value: '600+', label: 'Skills' }].
              map(({ value, label }) =>
              <div key={label} className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6 text-center">
                  <p className="text-4xl font-bold text-white mb-1">{value}</p>
                  <p className="text-sm text-white/90 font-medium">{label}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Framework Graphic + Understanding */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center bg-white">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a395e7d11ca3f24d261e0b/184ef8726_Framework_FINAL1.png"
              alt="NAHQ Healthcare Quality Competency Framework"
              className="w-full h-full object-contain" />
            
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb aria-hidden="true" className="w-6 h-6 text-[#00A3E0]" />
              </div>
              <h2 className="text-lg font-bold text-[#3D3D3D]">Understanding the Framework</h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm">The NAHQ Healthcare Quality Competency Framework™ the industry-standard , defining the quality and safety competencies, skills and behaviors required to advance quality and safety excellence across the healthcare continuum.

            </p>

            <div className="space-y-3">
              {[
              { label: 'Developmental, Not Evaluative', desc: 'The framework is designed to help you grow – not grade you. Use it to identify where you are and where you want to go.' },
              { label: 'Grounded in Practice', desc: 'Built from the real work of healthcare quality professionals across settings, roles, and experience levels.' },
              { label: 'A Common Language', desc: 'Shared vocabulary for quality professionals, leaders, and organizations to align on expectations and development.' },
              { label: 'Career Pathways', desc: 'Maps a clear trajectory from Foundational to Advances across all 8 domains, supporting intentional career growth.' }].
              map(({ label, desc }) =>
              <div key={label} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-[#3D3D3D]">{label}: </span>
                    <span className="text-sm text-gray-500">{desc}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* The 8 Domains */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
          <h2 className="text-xl font-bold text-[#3D3D3D] mb-2">The 8 Domains</h2>
          <p className="text-gray-500 text-sm mb-6">Click on any domain to explore its competencies and understand proficiency expectations at each level.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOMAINS.map((domain, index) =>
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
              onClick={() => openDomainPanel(domain)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDomainPanel(domain)}
              role="button"
              tabIndex={0}
              aria-label={`Explore ${domain.name} domain`}
              className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-transparent cursor-pointer transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2">
              
                <div aria-hidden="true" className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${domain.color}15` }}>
                  <domain.icon className="w-6 h-6" style={{ color: domain.color }} />
                </div>
                <h3 className="font-semibold text-[#3D3D3D] text-sm mb-2 leading-tight">{domain.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{domain.description}</p>
                <div aria-hidden="true" className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: domain.color }}>
                  Learn More
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Three Levels of Progression */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl mb-12 overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}>
          <svg aria-hidden="true" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <circle cx="85%" cy="-10%" r="220" fill="rgba(0,163,224,0.13)" />
            <circle cx="5%" cy="80%" r="140" fill="rgba(0,163,224,0.09)" />
            <polygon points="80%,0 100%,0 100%,60%" fill="rgba(0,163,224,0.08)" />
          </svg>
          <div className="relative z-10 p-8">
            <h3 className="font-bold text-xl text-white mb-2">Three Levels identified for each competency</h3>
            

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div aria-hidden="true" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Foundational</h4>
                <p className="text-[#FFED00] text-xs font-semibold mb-3">I KNOW</p>
                <ul className="text-xs text-white/90 space-y-1.5">
                  <li>• Working knowledge of concepts</li>
                  <li>• Complete tasks with guidance</li>
                  <li>• Discussing, Identifying, Participating</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div aria-hidden="true" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Proficient</h4>
                <p className="text-[#FFED00] text-xs font-semibold mb-3">I DO</p>
                <ul className="text-xs text-white/90 space-y-1.5">
                  <li>• Deep understanding of concepts</li>
                  <li>• Work independently &amp; holistically</li>
                  <li>• Creating, Developing, Implementing</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div aria-hidden="true" className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">Advanced</h4>
                <p className="text-[#FFED00] text-xs font-semibold mb-3">I LEAD</p>
                <ul className="text-xs text-white/90 space-y-1.5">
                  <li>• Nuanced, strategic understanding</li>
                  <li>• Assess competence of others</li>
                  <li>• Coaching, Advancing, Empowering</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>



      </main>

      {/* Domain/Competency Side Panel */}
      {panelItem &&
      <DomainCompetencyPanel
        isOpen={panelOpen}
        onClose={() => {setPanelOpen(false);setPanelItem(null);}}
        type={panelItem.type}
        name={panelItem.name} />

      }

      <FloatingChatButton onClick={() => setShowChat(true)} />

      {showChat &&
      <AIChat onClose={() => setShowChat(false)} context="framework" />
      }
    </div>);

}