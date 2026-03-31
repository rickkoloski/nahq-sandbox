import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle, Users, BarChart3, BookOpen, Shield, TrendingUp, Brain, Lightbulb, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/shared/Header';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import { base44 } from '@/api/base44Client';

export default function ExecutiveOverview() {
  const userName = 'Sarah';

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="Executive" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Personalized Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D3D3D]">
            {getWelcomeMessage()}, {userName || 'Sarah'}
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl text-lg">
            Welcome to your Workforce Intelligence Platform. Get quick access to assessment progress, organizational insights, and team management.
          </p>
        </motion.div>

        {/* Framework Info - Secondary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-12 border border-gray-200 mb-12 mt-12"
        >
          <div className="flex flex-col md:flex-row items-center md:items-center gap-12">
            <div className="flex-shrink-0">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698e86d0da7ae0691d104f62/426bc3e1a_Framework_FINAL.png"
                alt="NAHQ Healthcare Quality Competency Framework"
                className="w-40 h-40"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-bold text-[#3D3D3D] mb-2">Explore the NAHQ Framework</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your assessments are based on the NAHQ Healthcare Quality Competency Framework: 8 domains, 28 competencies, evaluated developmental (not evaluative).
              </p>
              <Link to={createPageUrl('OrganizationalFramework')}>
                <Button className="border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/5 font-semibold" variant="outline" size="sm">
                  Learn More
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Primary Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-[#3D3D3D] mb-6">Key Actions</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: '1',
                icon: FileText,
                title: 'Take Your Own Assessment',
                description: 'Complete the assessment first to understand the framework and model commitment to development',
                action: 'Start Assessment',
                href: createPageUrl('Assessment'),
                color: '#FFED00',
                isPrimary: true,
                time: '40-45 minutes'
              },
              {
                number: '2',
                icon: CheckCircle,
                title: 'Assessment Tracking',
                description: 'Monitor cohort progress, track completion rates, and send reminders to participants who haven\'t completed their assessments',
                action: 'View Tracking',
                href: createPageUrl('AssessmentTracking'),
                color: '#6B4C9A',
                time: 'Ongoing'
              },
              {
                number: '3',
                icon: BarChart3,
                title: 'View Organizational Results',
                description: 'See aggregated assessment data by domain, role, and site to identify development priorities',
                action: 'View Dashboard',
                href: createPageUrl('ExecutiveDashboard'),
                color: '#00A3E0',
                time: 'Ongoing'
              },
              {
                number: '4',
                icon: Users,
                title: 'Manage User Accounts',
                description: 'View your organization\'s team members and request new user invitations from NAHQ',
                action: 'Manage Users',
                href: createPageUrl('ManageUsers'),
                color: '#F68B1F',
                time: 'As needed'
              }
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className={`
                  relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col h-full
                  ${card.isPrimary ? 'border-[#FFED00]' : 'border-gray-100'}
                `}
              >
                {/* Number badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#3D3D3D] text-white flex items-center justify-center font-bold text-sm">
                  {card.number}
                </div>

                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <card.icon 
                    className="w-7 h-7" 
                    style={{ color: card.color }}
                  />
                </div>

                <h3 className="text-lg font-semibold text-[#3D3D3D] mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{card.description}</p>

                <div>
                  <Link to={card.href}>
                    <Button 
                      className={`
                        w-full font-semibold
                        ${card.isPrimary 
                          ? 'bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D]' 
                          : 'bg-transparent hover:bg-gray-50 text-[#00A3E0] border border-[#00A3E0]'
                        }
                      `}
                    >
                      {card.action}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-4">
                    <Clock className="w-3 h-3" />
                    {card.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <FloatingChatButton onClick={() => {}} />
    </div>
  );
}