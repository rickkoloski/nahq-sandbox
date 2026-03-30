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
    name: 'Quality Leadership and Integration', 
    color: '#003DA5',
    icon: Network,
    description: 'Advance the organization\'s commitment to healthcare quality through collaboration, learning opportunities and communication.'
  },
  { 
    name: 'Performance and Process Improvement', 
    color: '#00B5E2',
    icon: Settings,
    description: 'Use performance and process improvement, project management and change management methods to support quality initiatives.'
  },
  { 
    name: 'Population Health and Care Transitions', 
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
    name: 'Regulatory and Accreditation', 
    color: '#ED1C24',
    icon: CheckSquare,
    description: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with internal and external requirements.'
  },
  { 
    name: 'Quality Review and Accountability', 
    color: '#99154B',
    icon: ClipboardCheck,
    description: 'Direct activities that support compliance with voluntary, mandatory and contractual reporting requirements.'
  },
];

export default function OrganizationalFramework() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="Executive" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to={createPageUrl('ExecutiveOverview')}>
            <Button variant="ghost" className="text-gray-600 hover:text-[#00A3E0] -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
        </motion.div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3D3D3D] mb-3">
                Healthcare Quality Competency Framework
              </h1>
              <p className="text-gray-500 text-lg">
                The foundation for building organizational capability
              </p>
            </div>
            <Button variant="outline" className="border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/10 px-6 shrink-0">
              <Download className="w-5 h-5 mr-2" />
              Download Framework
            </Button>
          </div>
        </motion.div>

        {/* Video and Understanding Section - Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Framework Graphic */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-full flex items-center justify-center bg-white">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/698e86d0da7ae0691d104f62/34e136195_Framework_FINAL1.png"
              alt="NAHQ Healthcare Quality Competency Framework"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Understanding Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#3D3D3D]">Understanding the Framework</h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-4 text-sm">
              The NAHQ Healthcare Quality Competency Framework is the industry-standard foundation for healthcare quality capabilities. It provides a common vocabulary, defines what must be present in high-functioning quality organizations, and offers career pathways for your team members to develop throughout their careers.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
              Your team members assess themselves against this framework to understand their current capabilities. These results help you make strategic decisions about workforce development investments, identify skill gaps, and track improvement over time.
            </p>

            <div className="grid grid-cols-3 gap-3 mt-auto">
              <div className="bg-[#00A3E0]/5 rounded-xl p-3 border border-[#00A3E0]/10">
                <div className="text-2xl font-bold text-[#00A3E0] mb-1">8</div>
                <div className="text-xs font-medium text-[#3D3D3D]">Domains</div>
                <div className="text-xs text-gray-500">Core areas of quality work</div>
              </div>
              <div className="bg-[#00B5E2]/5 rounded-xl p-3 border border-[#00B5E2]/10">
                <div className="text-2xl font-bold text-[#00B5E2] mb-1">28</div>
                <div className="text-xs font-medium text-[#3D3D3D]">Competencies</div>
                <div className="text-xs text-gray-500">Specific capabilities within domains</div>
              </div>
              <div className="bg-[#8BC53F]/5 rounded-xl p-3 border border-[#8BC53F]/10">
                <div className="text-2xl font-bold text-[#8BC53F] mb-1">649</div>
                <div className="text-xs font-medium text-[#3D3D3D]">Skills</div>
                <div className="text-xs text-gray-500">Required to achieve quality objectives</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The 8 Domains */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-[#3D3D3D] mb-4">The 8 Domains</h2>
          <p className="text-gray-500 mb-6">Click on any domain to explore its competencies and understand what capabilities are required at each level.</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOMAINS.map((domain, index) => (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                onClick={() => {
                 setSelectedDomain(domain);
                 setPanelOpen(true);
               }}
                className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-transparent cursor-pointer transition-all duration-300 group"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${domain.color}15` }}
                >
                  <domain.icon className="w-6 h-6" style={{ color: domain.color }} />
                </div>
                <h3 className="font-semibold text-[#3D3D3D] text-sm mb-2 leading-tight">{domain.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{domain.description}</p>
                
                <div 
                  className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1 text-xs font-medium transition-colors"
                  style={{ color: domain.color }}
                >
                  Learn More
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skill Levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-8 border border-gray-100 mb-12"
        >
          <h3 className="font-bold text-xl text-[#3D3D3D] mb-6">Three Levels of Professional Growth</h3>
          
          <p className="text-gray-600 text-sm mb-6">
            Every competency is stratified at three distinct levels. Team members can progress through these levels as they develop their capabilities:
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <h4 className="font-bold text-[#3D3D3D] text-sm">Foundational</h4>
              </div>
              <p className="text-xs font-semibold text-gray-600 mb-3">I KNOW</p>
              <ul className="text-xs text-gray-700 space-y-2">
                <li>• Working knowledge of concepts</li>
                <li>• Complete tasks with guidance</li>
                <li>• Discussing, Identifying, Participating</li>
              </ul>
            </div>

            <div className="bg-[#00A3E0]/5 border-2 border-[#00A3E0]/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                <h4 className="font-bold text-[#00A3E0] text-sm">Proficient</h4>
              </div>
              <p className="text-xs font-semibold text-[#00A3E0] mb-3">I DO</p>
              <ul className="text-xs text-gray-700 space-y-2">
                <li>• Deep understanding of concepts</li>
                <li>• Work independently & holistically</li>
                <li>• Creating, Developing, Implementing</li>
              </ul>
            </div>

            <div className="bg-[#FFED00]/10 border-2 border-[#FFED00]/40 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                <h4 className="font-bold text-[#3D3D3D] text-sm">Advanced</h4>
              </div>
              <p className="text-xs font-semibold text-gray-600 mb-3">I LEAD</p>
              <ul className="text-xs text-gray-700 space-y-2">
                <li>• Nuanced, strategic understanding</li>
                <li>• Assess competence of others</li>
                <li>• Coaching, Advancing, Empowering</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Using Results for Planning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#8BC53F]/5 to-transparent border-2 border-[#8BC53F]/20 rounded-2xl p-8 mb-12"
        >
          <h3 className="font-bold text-xl text-[#3D3D3D] mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#8BC53F]" />
            Using Assessment Results for Workforce Planning
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#3D3D3D] text-sm mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#8BC53F]" />
                Identify Development Priorities
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                See which domains and competencies represent your organization's greatest opportunities. Allocate training budget strategically.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#3D3D3D] text-sm mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#8BC53F]" />
                Benchmark Against Standards
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Compare your organizational capabilities to NAHQ standards and peer organizations to set realistic improvement targets.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#3D3D3D] text-sm mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8BC53F]" />
                Plan Role-Based Development
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Design targeted learning pathways for Directors, Managers, and Specialists based on role requirements and individual assessments.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#3D3D3D] text-sm mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#8BC53F]" />
                Track Progress Over Time
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Conduct reassessments to measure the impact of your training investments and validate organizational improvement.
              </p>
            </div>
          </div>
        </motion.div>


      </main>

      {/* Domain Competency Panel */}
      <DomainCompetencyPanel 
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        type="domain"
        name={selectedDomain?.name}
      />

      <FloatingChatButton onClick={() => {}} />
    </div>
  );
}