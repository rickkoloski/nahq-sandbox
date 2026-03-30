import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle, Users, BarChart3, BookOpen, Shield, TrendingUp, Brain, Lightbulb, FileText, Clock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/shared/Header';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import ExecutiveAIChat from '@/components/executive/ExecutiveAIChat';
import { base44 } from '@/api/base44Client';

export default function ExecutiveOverview() {
  const [viewMode, setViewMode] = React.useState('executive'); // 'executive' or 'personal'
  const [chatOpen, setChatOpen] = React.useState(false);
  const userName = 'Sarah';

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Skip navigation link — first focusable element on page */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[#3D3D3D] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>
      <Header currentPage="Executive" />

      <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Personalized Welcome + View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between motion-reduce:transform-none motion-reduce:opacity-100">

          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-[#3D3D3D]">
              {getWelcomeMessage()}, {userName || 'Sarah'}
            </h1>
            <p className="text-gray-700 mt-2 max-w-2xl text-sm">
              Welcome to your Workforce Intelligence Platform. Here you can view assessment progress, workforce insights, and organizational alignment.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1" role="group" aria-label="View mode">
            <button
              onClick={() => setViewMode('personal')}
              aria-pressed={viewMode === 'personal'}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077AA] ${
                viewMode === 'personal'
                  ? 'bg-white text-[#0077AA] shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}>
              Personal
            </button>
            <button
              onClick={() => setViewMode('executive')}
              aria-pressed={viewMode === 'executive'}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0077AA] ${
                viewMode === 'executive'
                  ? 'bg-white text-[#0077AA] shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}>
              Executive
            </button>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10 motion-reduce:transform-none motion-reduce:opacity-100">

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#009FE8] to-[#3D3D3D] p-12 text-white min-h-56">
            {/* Abstract background shapes — decorative */}
            <div className="absolute inset-0 opacity-20 overflow-hidden" aria-hidden="true">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-2 border-white/40" />
              <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full border border-white/30" />
              <div className="absolute -bottom-32 right-1/3 w-96 h-96 rounded-full border border-white/20" />

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.8" opacity="0.08" />
                  </pattern>
                  <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1.5" fill="white" opacity="0.1" />
                  </pattern>
                </defs>
                <rect width="1000" height="300" fill="url(#grid)" />
                <rect width="1000" height="300" fill="url(#dots)" />
                <circle cx="100" cy="150" r="90" fill="none" stroke="white" strokeWidth="1.5" opacity="0.2" />
                <circle cx="150" cy="120" r="50" fill="none" stroke="white" strokeWidth="1" opacity="0.15" />
                <circle cx="850" cy="80" r="140" fill="none" stroke="white" strokeWidth="1" opacity="0.12" />
                <circle cx="900" cy="200" r="80" fill="none" stroke="white" strokeWidth="1" opacity="0.1" />
                <path d="M 0 180 Q 250 80 500 180 T 1000 180" stroke="white" strokeWidth="2" fill="none" opacity="0.15" />
                <path d="M 0 250 Q 300 150 600 250 T 1000 250" stroke="white" strokeWidth="1.5" fill="none" opacity="0.1" />
                <line x1="0" y1="0" x2="300" y2="300" stroke="white" strokeWidth="1" opacity="0.08" />
                <line x1="700" y1="0" x2="1000" y2="300" stroke="white" strokeWidth="1" opacity="0.08" />
                <polygon points="500,50 550,100 450,100" fill="none" stroke="white" strokeWidth="1" opacity="0.1" />
                <polygon points="100,250 150,280 50,280" fill="none" stroke="white" strokeWidth="1" opacity="0.08" />
              </svg>
            </div>

            <div className="relative z-10 max-w-3xl">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png"
                alt="NAHQ logo"
                className="w-16 h-auto mb-4 brightness-0 invert" />

              {/* Promotional heading — not part of document outline; using p+role to avoid skipping h2 → h4 */}
              <p className="text-4xl font-bold mb-3 leading-tight" aria-hidden="false">
                Understand the Level of Quality Work Being Performed
              </p>
              <p className="text-base text-white leading-relaxed max-w-2xl">
                Gain clarity into how quality work is structured across your workforce and how it aligns to the NAHQ standard.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Primary Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="motion-reduce:transform-none motion-reduce:opacity-100">

          <h2 className="text-xl font-bold text-[#3D3D3D] mb-6">Key Actions</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                number: '1',
                icon: BookOpen,
                title: 'Explore the Framework',
                description: 'Learn about the 8 domains and 28 competencies identified in the NAHQ Healthcare Quality Competency Framework™',
                action: 'Explore',
                href: createPageUrl('OrganizationalFramework'),
                color: '#009FE8',
                isPrimary: false,
                time: '10-15 minutes',
                hideInExecutive: false
              },
              {
                number: '2',
                icon: FileText,
                title: 'Take Your Own Assessment',
                description: 'Complete the assessment to understand the framework and model commitment to development',
                action: 'Start Assessment',
                href: createPageUrl('Assessment'),
                color: '#FFED00',
                isPrimary: true,
                time: '40-45 minutes',
                hideInExecutive: true
              },
              {
                number: '3',
                icon: CheckCircle,
                title: 'Assessment Tracking',
                description: 'Monitor cohort progress, track completion rates, and send reminders to participants',
                action: 'View Tracking',
                href: createPageUrl('AssessmentTracking'),
                color: '#6B4C9A',
                time: 'Ongoing',
                hideInExecutive: false
              },
              {
                number: '4',
                icon: BarChart3,
                title: 'View Organizational Results',
                description: 'See aggregated assessment data by domain, role, and site to identify development priorities',
                action: 'View Dashboard',
                href: createPageUrl('ExecutiveDashboard'),
                color: '#009FE8',
                time: 'Ongoing',
                hideInExecutive: false
              }
            ]
              .filter((card) => !(viewMode === 'executive' && card.hideInExecutive))
              .map((card, index) => ({ ...card, number: String(index + 1) }))
              .map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  className={`
                    relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col h-full motion-reduce:transform-none
                    ${card.isPrimary ? 'border-[#FFED00]' : 'border-gray-100'}
                  `}>

                  {/* Number badge — decorative, card title conveys identity */}
                  <div aria-hidden="true" className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#3D3D3D] text-white flex items-center justify-center font-bold text-sm">
                    {card.number}
                  </div>

                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${card.color}15` }}>
                    <card.icon
                      className="w-7 h-7"
                      aria-hidden="true"
                      style={{ color: card.color }} />
                  </div>

                  <h3 className="text-lg font-semibold text-[#3D3D3D] mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">{card.description}</p>

                  <div>
                    {/* Use <a> for navigation — never nest <a> inside <button> */}
                    <Link
                      to={card.href}
                      aria-label={`${card.action} — ${card.title}`}
                      className={`
                        w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0077AA]
                        ${card.isPrimary
                          ? 'bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D]'
                          : 'bg-transparent hover:bg-gray-50 text-[#0077AA] border-2 border-[#0077AA]'}
                      `}>
                      {card.action}
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Link>

                    <div className="flex items-center gap-1 text-gray-600 text-xs mt-4">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <span>{card.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

            {/* Locked "View Your Results" card — personal view only */}
            {viewMode === 'personal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                role="region"
                aria-label="View Your Results — available after assessment"
                className="relative bg-white rounded-2xl p-6 border-2 border-gray-100 flex flex-col h-full motion-reduce:transform-none">

                <div aria-hidden="true" className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-bold text-sm">
                  5
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gray-100">
                  <BarChart3 className="w-7 h-7 text-gray-400" aria-hidden="true" />
                </div>

                <h3 className="text-lg font-semibold text-[#3D3D3D] mb-2">View Your Results</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">
                  See your personalized results, identify development priorities, and start your custom upskilling plan.
                </p>

                <div>
                  <button
                    disabled
                    aria-disabled="true"
                    className="w-full flex items-center justify-center gap-2 rounded-md border-2 border-gray-200 text-gray-400 bg-transparent py-2 px-4 font-semibold text-sm cursor-not-allowed">
                    View My Dashboard
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <div className="flex items-center gap-1.5 text-gray-600 text-xs mt-4">
                    <Lock className="w-3 h-3" aria-hidden="true" />
                    <span>Available after completing assessment</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      <FloatingChatButton onClick={() => setChatOpen(true)} aria-label="Open AI chat assistant" />
      <ExecutiveAIChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}