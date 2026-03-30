import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, Clock, Globe, ClipboardList, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/shared/Header';
import AssessmentIntroModal from '@/components/individual/AssessmentIntroModal';

const userName = 'Sarah';

function getWelcomeMessage() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const STEPS = [
{
  number: '1',
  icon: Globe,
  title: 'Explore the Framework',
  description: 'Learn about the 8 domains and 28 competencies identified in the NAHQ Healthcare Quality Competency Framework\u2122 before you begin.',
  action: 'Explore Framework',
  href: createPageUrl('Framework'),
  color: '#00A3E0',
  bg: 'from-[#00A3E0]/8 to-[#00A3E0]/4',
  border: 'border-[#00A3E0]/30',
  time: '5–10 minutes',
  isPrimary: false
},
{
  number: '2',
  icon: ClipboardList,
  title: 'Take Your Assessment',
  description: 'Complete the self-assessment to understand your current competency levels across all domains.',
  action: 'Start Assessment',
  href: createPageUrl('Assessment'),
  color: '#FFED00',
  bg: 'bg-white',
  border: 'border-[#FFED00]',
  time: '30 minutes',
  isPrimary: true
},
{
  number: '3',
  icon: BarChart3,
  title: 'View Your Results',
  description: 'See your personalized results, identify development priorities, and start your custom upskilling plan.',
  action: 'View My Dashboard',
  href: createPageUrl('IndividualDashboard'),
  color: '#3D3D3D',
  bg: 'from-[#3D3D3D]/8 to-[#3D3D3D]/4',
  border: 'border-[#3D3D3D]/20',
  time: 'After assessment',
  isPrimary: false,
  locked: true
}];


export default function IndividualHome() {
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const navigate = useNavigate();

  const handleAssessmentClick = (e) => {
    e.preventDefault();
    setShowAssessmentModal(true);
  };

  const handleAssessmentContinue = () => {
    setShowAssessmentModal(false);
    navigate(createPageUrl('Assessment'));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="Individual" />
      <AssessmentIntroModal
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onContinue={handleAssessmentContinue} />
      

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          



          
          <h1 className="text-xl md:text-2xl font-bold text-[#3D3D3D]">
            {getWelcomeMessage()}, {userName}
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl text-sm">Welcome to your personal development journey. Follow the steps below to explore the NAHQ Competency Framework, complete your assessment, and unlock your personalized upskill plan.

          </p>
        </motion.div>

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          role="region"
          aria-label="NAHQ Workforce Accelerator Journey overview"
          className="rounded-2xl mb-12 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}>
          
          {/* Abstract background shapes */}
           <svg aria-hidden="true" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
             <circle cx="85%" cy="-10%" r="220" fill="rgba(255,255,255,0.08)" />
             <circle cx="70%" cy="120%" r="180" fill="rgba(255,255,255,0.06)" />
             <circle cx="5%" cy="80%" r="140" fill="rgba(255,255,255,0.05)" />
             <ellipse cx="55%" cy="50%" rx="300" ry="120" fill="rgba(255,255,255,0.04)" transform="rotate(-20 55% 50%)" />
             <polygon points="80%,0 100%,0 100%,60%" fill="rgba(255,255,255,0.05)" />
             <polygon points="0,100% 30%,100% 0,40%" fill="rgba(255,255,255,0.08)" />
           </svg>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-10">
            {/* Left: text */}
            <div className="flex-1">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png"
                alt="NAHQ"
                className="h-8 w-auto brightness-0 invert mb-5" />
              
              <h2 className="text-3xl font-bold text-white leading-tight mb-3">
                Your Workforce<br />Accelerator Journey
              </h2>
              <p className="text-white/90 text-sm leading-relaxed max-w-sm">Assess how your work today aligns with the needs of your role, and close gaps, building the skills and competencies required to deliver healthcare quality excellence.

              </p>
            </div>

            {/* Right: radial graphic with stats */}
            <div className="flex-shrink-0 flex items-center justify-center w-full md:w-72" aria-label="Framework overview: 8 domains, 28 competencies, 3 levels" role="img">
              <div className="relative w-64 h-64" aria-hidden="true">
                {/* Outer ring */}
                <svg aria-hidden="true" className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <circle cx="128" cy="128" r="85" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <circle cx="128" cy="128" r="60" fill="rgba(255,255,255,0.06)" />
                  {/* Arc segments */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                    const rad = angle * Math.PI / 180;
                    const x1 = 128 + 62 * Math.cos(rad);
                    const y1 = 128 + 62 * Math.sin(rad);
                    const x2 = 128 + 108 * Math.cos(rad);
                    const y2 = 128 + 108 * Math.sin(rad);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />;
                  })}
                  {/* Filled arc representing progress */}
                  <path
                    d="M 128 18 A 110 110 0 0 1 238 128 A 110 110 0 0 1 128 238 A 110 110 0 0 1 36 68"
                    fill="none"
                    stroke="rgba(0,163,224,0.5)"
                    strokeWidth="3"
                    strokeLinecap="round" />
                  
                  <circle cx="128" cy="128" r="42" fill="rgba(61,61,61,0.35)" />
                </svg>

                {/* Centre label */}
                <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-white text-3xl font-bold leading-none">8</p>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest mt-1">Domains</p>
                </div>

                {/* Floating stat bubbles — decorative, described in text */}
                {[
                { label: 'Competencies', value: '28', angle: -55, dist: 118 },
                { label: 'Avg Time', value: '45m', angle: 30, dist: 118 },
                { label: 'Pathways', value: '∞', angle: 140, dist: 112 },
                { label: 'Levels', value: '3', angle: 210, dist: 118 }].
                map(({ label, value, angle, dist }) => {
                  const rad = angle * Math.PI / 180;
                  const cx = 128 + dist * Math.cos(rad);
                  const cy = 128 + dist * Math.sin(rad);
                  const left = `${cx / 256 * 100}%`;
                  const top = `${cy / 256 * 100}%`;
                  return (
                    <div
                      key={label}
                      aria-hidden="true"
                      className="absolute -translate-x-1/2 -translate-y-1/2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-center"
                      style={{ left, top }}>
                      
                      <p className="text-white font-bold text-sm leading-none">{value}</p>
                      <p className="text-white/60 text-[9px] mt-0.5 leading-none">{label}</p>
                    </div>);

                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3-step journey */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-xl font-bold text-[#3D3D3D] mb-6">Your Journey</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, index) =>
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col h-full ${step.isPrimary ? step.bg : `bg-gradient-to-br ${step.bg}`} ${step.border} ${step.locked ? 'opacity-60' : ''}`}>
              
                {/* Number badge */}
                <div
                aria-hidden="true"
                className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: step.color, color: step.isPrimary ? '#3D3D3D' : '#ffffff' }}>
                  {step.number}
                </div>

                {/* Icon */}
                <div aria-hidden="true" className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${step.color}22` }}>
                  <step.icon className="w-7 h-7" style={{ color: step.isPrimary ? '#3D3D3D' : step.color }} />
                </div>

                <h3 className="text-lg font-semibold text-[#3D3D3D] mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{step.description}</p>

                <div>
                  {step.locked ?
                <Button
                  disabled
                  aria-disabled="true"
                  aria-label={`${step.action} — complete the assessment first`}
                  className="w-full font-semibold bg-transparent text-gray-400 border border-gray-200 cursor-not-allowed">
                      {step.action}
                      <ArrowRight aria-hidden="true" className="w-4 h-4 ml-2" />
                    </Button> :
                step.isPrimary ?
                <Button
                  onClick={handleAssessmentClick}
                  className="w-full font-bold"
                  style={{ backgroundColor: step.color, color: step.isPrimary ? '#3D3D3D' : '#ffffff' }}>
                      {step.action}
                      <ArrowRight aria-hidden="true" className="w-4 h-4 ml-2" />
                    </Button> :
                <Link to={step.href}>
                      <Button
                    className="w-full font-bold"
                    style={{ backgroundColor: step.color, color: step.isPrimary ? '#3D3D3D' : '#ffffff' }}>
                        {step.action}
                        <ArrowRight aria-hidden="true" className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                }

                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-4">
                    <Clock aria-hidden="true" className="w-3 h-3" />
                    <span>{step.time}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>);

}