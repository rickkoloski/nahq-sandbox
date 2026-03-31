import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Trophy, Calendar, MessageCircle, ArrowRight, Download, Users, Share2, 
  Flag, TrendingUp, AlertTriangle, CheckCircle, Bot, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/shared/Header';
import FrameworkWheel from '@/components/shared/FrameworkWheel';
import DomainCard from '@/components/shared/DomainCard';
import DomainDetailModal from '@/components/shared/DomainDetailModal';
import { Network, Settings, Globe, BarChart3, Shield, CheckSquare, ClipboardCheck, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChat from '@/components/results/AIChat';
import PeerComparisonModal from '@/components/results/PeerComparisonModal';
import OverallScoreModal from '@/components/results/OverallScoreModal';
import ProfileBreakdownModal from '@/components/results/ProfileBreakdownModal';

const SAMPLE_RESULTS = {
  overallScore: 1.8,
  overallBenchmark: 2.0,
  peerAverage: 1.7,
  percentile: 47,
  completionDate: 'January 27, 2026',
  position: 'Director of Quality',
  previousAssessments: [
    { date: 'January 27, 2025', overallScore: 1.6 }
  ],
  domains: [
    { name: 'Professional Engagement', score: 2.1, level: 'Advanced', percentile: 65, color: '#6B4C9A', benchmark: 2.0, peerAverage: 1.8 },
    { name: 'Quality Leadership and Integration', score: 2.1, level: 'Advanced', percentile: 78, color: '#003DA5', isStrength: true, benchmark: 2.2, peerAverage: 1.9 },
    { name: 'Performance and Process Improvement', score: 1.7, level: 'Proficient', percentile: 52, color: '#00B5E2', benchmark: 2.1, peerAverage: 1.7 },
    { name: 'Population Health and Care Transitions', score: 1.5, level: 'Foundational', percentile: 38, color: '#8BC53F', benchmark: 1.8, peerAverage: 1.6 },
    { name: 'Health Data Analytics', score: 1.4, level: 'Foundational', percentile: 31, color: '#F68B1F', isGap: true, benchmark: 2.0, peerAverage: 1.6 },
    { name: 'Patient Safety', score: 1.9, level: 'Proficient', percentile: 65, color: '#009CA6', isStrength: true, benchmark: 2.1, peerAverage: 1.8 },
    { name: 'Regulatory and Accreditation', score: 1.8, level: 'Proficient', percentile: 60, color: '#ED1C24', isStrength: true, benchmark: 2.0, peerAverage: 1.7 },
    { name: 'Quality Review and Accountability', score: 1.6, level: 'Proficient', percentile: 48, color: '#99154B', benchmark: 1.9, peerAverage: 1.6 }
  ]
};

export default function Results() {
  const [showChat, setShowChat] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [showPeerComparison, setShowPeerComparison] = useState(false);
  const [showOverallScoreModal, setShowOverallScoreModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHistoricalResults, setShowHistoricalResults] = useState(false);

  const strengths = SAMPLE_RESULTS.domains.filter(d => d.isStrength);
  const gaps = SAMPLE_RESULTS.domains.filter(d => d.isGap);

  const DOMAIN_ICONS = {
    'Professional Engagement': Users,
    'Quality Leadership and Integration': Network,
    'Performance and Process Improvement': Settings,
    'Population Health and Care Transitions': Globe,
    'Health Data Analytics': BarChart3,
    'Patient Safety': Shield,
    'Regulatory and Accreditation': CheckSquare,
    'Quality Review and Accountability': ClipboardCheck,
  };

  const DOMAIN_DATA = {
    'Professional Engagement': {
      description: 'Engage in the healthcare quality profession with a commitment to practicing ethically, enhancing one\'s competence and advancing the field.',
      competencies: [
        { name: 'Integrate ethical standards into healthcare quality practice', score: 2.2, benchmark: 2.0, average: 1.9 },
        { name: 'Engage in lifelong learning as a healthcare quality professional', score: 2.1, benchmark: 2.1, average: 1.8 },
        { name: 'Participate in activities that advance the healthcare quality profession', score: 2.0, benchmark: 1.9, average: 1.7 }
      ],
      courses: [
        { title: 'Ethics in Healthcare Quality', duration: '2 hours' },
        { title: 'Professional Development Planning', duration: '3 hours' },
        { title: 'Healthcare Quality Leadership', duration: '4 hours' }
      ]
    },
    'Quality Leadership and Integration': {
      description: 'Advance the organization\'s commitment to healthcare quality through collaboration, learning opportunities and communication.',
      competencies: [
        { name: 'Direct the quality infrastructure to achieve organizational objectives', score: 2.3, benchmark: 2.2, average: 2.0 },
        { name: 'Apply procedures to regulate the use of privileged or confidential information', score: 2.1, benchmark: 2.2, average: 1.9 },
        { name: 'Implement processes to promote stakeholder engagement and interprofessional teamwork', score: 2.0, benchmark: 2.3, average: 1.9 },
        { name: 'Create learning opportunities to advance healthcare quality throughout the organization', score: 2.2, benchmark: 2.1, average: 1.8 },
        { name: 'Communicate effectively with different audiences to achieve quality goals', score: 2.1, benchmark: 2.2, average: 1.9 }
      ],
      courses: [
        { title: 'Strategic Quality Leadership', duration: '6 hours' },
        { title: 'Building Quality Infrastructure', duration: '4 hours' },
        { title: 'Stakeholder Engagement Strategies', duration: '3 hours' }
      ]
    },
    'Performance and Process Improvement': {
      description: 'Use performance and process improvement, project management and change management methods to support operational and clinical quality initiatives.',
      competencies: [
        { name: 'Implement standard performance and process improvement (PPI) methods', score: 1.8, benchmark: 2.1, average: 1.7 },
        { name: 'Apply project management methods', score: 1.7, benchmark: 2.0, average: 1.6 },
        { name: 'Use change management principles and tools', score: 1.6, benchmark: 2.2, average: 1.8 }
      ],
      courses: [
        { title: 'Lean Six Sigma for Healthcare', duration: '8 hours' },
        { title: 'Project Management Essentials', duration: '5 hours' },
        { title: 'Change Management in Healthcare', duration: '4 hours' }
      ]
    },
    'Population Health and Care Transitions': {
      description: 'Evaluate and improve healthcare processes and care transitions to advance the efficient, effective and safe care of defined populations.',
      competencies: [
        { name: 'Integrate population health management strategies into quality work', score: 1.6, benchmark: 1.8, average: 1.6 },
        { name: 'Apply a holistic approach to improvement', score: 1.5, benchmark: 1.7, average: 1.5 },
        { name: 'Collaborate with stakeholders to improve care processes and transitions', score: 1.4, benchmark: 1.9, average: 1.7 }
      ],
      courses: [
        { title: 'Population Health Fundamentals', duration: '4 hours' },
        { title: 'Care Transition Best Practices', duration: '3 hours' },
        { title: 'Social Determinants of Health', duration: '3 hours' }
      ]
    },
    'Health Data Analytics': {
      description: 'Leverage the organization\'s analytic environment to help guide data driven decision making and inform quality improvement initiatives.',
      competencies: [
        { name: 'Apply procedures for the governance of data assets', score: 1.5, benchmark: 2.0, average: 1.6 },
        { name: 'Design data collection plans for key metrics and performance indicators', score: 1.4, benchmark: 2.1, average: 1.7 },
        { name: 'Acquire data from source systems', score: 1.3, benchmark: 1.9, average: 1.5 },
        { name: 'Integrate data from internal and external electronic data systems', score: 1.4, benchmark: 2.0, average: 1.6 },
        { name: 'Use statistical and visualization methods', score: 1.4, benchmark: 2.1, average: 1.6 }
      ],
      courses: [
        { title: 'Healthcare Analytics Fundamentals', duration: '6 hours' },
        { title: 'Data Visualization for Quality', duration: '4 hours' },
        { title: 'Statistical Process Control', duration: '5 hours' }
      ]
    },
    'Patient Safety': {
      description: 'Cultivate a safe healthcare environment by promoting safe practices, nurturing a just culture and improving processes that detect, mitigate or prevent harm.',
      competencies: [
        { name: 'Assess the organization\'s patient safety culture', score: 2.0, benchmark: 2.1, average: 1.8 },
        { name: 'Apply safety science principles and methods in healthcare quality work', score: 1.9, benchmark: 2.2, average: 1.9 },
        { name: 'Use organizational procedures to identify and report patient safety risks and events', score: 1.8, benchmark: 2.0, average: 1.7 },
        { name: 'Collaborate with stakeholders to analyze patient safety risks and events', score: 1.9, benchmark: 2.1, average: 1.8 }
      ],
      courses: [
        { title: 'Patient Safety Culture Assessment', duration: '3 hours' },
        { title: 'Root Cause Analysis', duration: '4 hours' },
        { title: 'High Reliability Organizations', duration: '5 hours' }
      ]
    },
    'Regulatory and Accreditation': {
      description: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with internal and external requirements.',
      competencies: [
        { name: 'Operationalize processes to support compliance with regulations and standards', score: 1.9, benchmark: 2.0, average: 1.7 },
        { name: 'Facilitate continuous survey readiness activities', score: 1.8, benchmark: 2.1, average: 1.8 },
        { name: 'Guide the organization through survey processes and findings', score: 1.7, benchmark: 1.9, average: 1.6 }
      ],
      courses: [
        { title: 'Regulatory Compliance Essentials', duration: '4 hours' },
        { title: 'Survey Readiness Preparation', duration: '3 hours' },
        { title: 'CMS Conditions of Participation', duration: '5 hours' }
      ]
    },
    'Quality Review and Accountability': {
      description: 'Direct activities that support compliance with voluntary, mandatory and contractual reporting requirements for data acquisition, analysis, reporting and improvement.',
      competencies: [
        { name: 'Relate current and emerging payment models to healthcare quality work', score: 1.7, benchmark: 1.9, average: 1.6 },
        { name: 'Conduct the activities to execute measure requirements', score: 1.6, benchmark: 2.0, average: 1.7 },
        { name: 'Implement processes to facilitate practitioner performance review activities', score: 1.5, benchmark: 1.8, average: 1.5 }
      ],
      courses: [
        { title: 'Value-Based Care Models', duration: '4 hours' },
        { title: 'Quality Measure Management', duration: '3 hours' },
        { title: 'Peer Review Processes', duration: '3 hours' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="Results" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFED00]/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#FFED00]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#3D3D3D]">
                Your Professional Assessment Results
              </h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                Completed: {SAMPLE_RESULTS.completionDate}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="text-gray-600">
                <Download className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="text-gray-600"
                onClick={() => setShowPeerComparison(true)}
              >
                <Users className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-gray-600">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
            {SAMPLE_RESULTS.previousAssessments?.length > 0 && (
              <select 
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 font-medium hover:border-[#00A3E0] focus:border-[#00A3E0] focus:ring-2 focus:ring-[#00A3E0]/20 outline-none cursor-pointer transition-all"
                defaultValue="current"
              >
                <option value="current">Current Assessment ({SAMPLE_RESULTS.completionDate})</option>
                {SAMPLE_RESULTS.previousAssessments.map((assessment, index) => (
                  <option key={index} value={assessment.date}>
                    Previous ({assessment.date})
                  </option>
                ))}
              </select>
            )}
          </div>
        </motion.div>

        {/* AI Assessment Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] rounded-2xl p-6 text-white shadow-xl shadow-[#00A3E0]/20 mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">Professional Assessment Results</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Hi Sarah! I've analyzed all 29 of your competency responses. Here's what your Professional Assessment reveals about your quality expertise.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {/* Overall Score with Benchmark */}
            <button
              onClick={() => setShowOverallScoreModal(true)}
              className="bg-white/10 backdrop-blur rounded-xl p-5 hover:bg-white/20 transition-all cursor-pointer text-left md:col-span-2"
            >
              <p className="text-white/90 text-xs font-semibold uppercase tracking-wide mb-4">Your Score</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-white/70 text-xs mb-2">Your Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{SAMPLE_RESULTS.overallScore}</span>
                    <span className="text-white/50 text-lg">/3.0</span>
                  </div>
                  <p className="text-white/80 text-sm mt-1">Proficient level</p>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <p className="text-white/70 text-xs mb-2">NAHQ Benchmark</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{SAMPLE_RESULTS.overallBenchmark}</span>
                    <span className="text-white/50 text-lg">/3.0</span>
                  </div>
                  <p className="text-white/80 text-sm mt-1">{SAMPLE_RESULTS.position}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">Gap to Benchmark</span>
                  <span className={`text-lg font-bold ${SAMPLE_RESULTS.overallScore >= SAMPLE_RESULTS.overallBenchmark ? 'text-[#FFED00]' : 'text-white'}`}>
                    {SAMPLE_RESULTS.overallScore >= SAMPLE_RESULTS.overallBenchmark ? '✓ Exceeds' : `-${(SAMPLE_RESULTS.overallBenchmark - SAMPLE_RESULTS.overallScore).toFixed(1)}`}
                  </span>
                </div>
              </div>
            </button>

            {/* Peer Ranking */}
            <button
              onClick={() => setShowPeerComparison(true)}
              className="bg-white/10 backdrop-blur rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Peer Ranking</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-white">{SAMPLE_RESULTS.percentile}th</span>
              </div>
              <p className="text-white/80 text-sm">Percentile</p>
            </button>

            {/* Profile Summary */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="bg-white/10 backdrop-blur rounded-xl p-4 hover:bg-white/20 transition-all cursor-pointer text-left"
            >
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Profile</p>
              <div className="space-y-1">
                <p className="text-sm text-white/90">✓ {strengths.length} Advanced/High Proficient</p>
                <p className="text-sm text-white/90">✓ 4 Proficient domains</p>
                <p className="text-sm text-white/90">→ {gaps.length} Growth opportunity</p>
              </div>
            </button>
          </div>

          {/* Key Insights */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-5 mb-6">
            <h4 className="font-semibold text-white mb-3">Key Insights from Your Assessment</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#FFED00] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/90 leading-relaxed">
                  <strong>Strategic Leadership Strength:</strong> Your Quality Leadership score (2.1) places you at Advanced level—in the 78th percentile for professionals in your role.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#FFED00] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/90 leading-relaxed">
                  <strong>Patient Safety Excellence:</strong> Your strong foundation in Patient Safety (1.9) and Regulatory Compliance (1.8) demonstrates operational expertise.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[#FFED00] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-white/90 leading-relaxed">
                  <strong>Analytics Growth Opportunity:</strong> Your Health Data Analytics score (1.4) represents your biggest opportunity to amplify your leadership impact.
                </p>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={createPageUrl('PlanGeneration')} className="flex-1">
              <Button className="w-full bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-bold text-base py-6 shadow-lg">
                <Flag className="w-5 h-5 mr-2" />
                Get My Personalized Development Plan
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              onClick={() => setShowChat(true)}
              className="bg-white/20 hover:bg-white/30 text-white font-semibold py-6 px-6 backdrop-blur border border-white/30"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Questions
            </Button>
          </div>
        </motion.div>



        {/* Domain Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#3D3D3D] text-lg">Domain Breakdown</h3>
            <p className="text-sm text-gray-500">Click any domain to see details</p>
          </div>

          <div className="space-y-3">
            {SAMPLE_RESULTS.domains.map((domain, index) => {
              const Icon = DOMAIN_ICONS[domain.name] || Users;
              const data = DOMAIN_DATA[domain.name] || {};
              const isExpanded = expandedDomain === domain.name;

              return (
                <motion.div
                  key={domain.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="border border-gray-200 rounded-xl overflow-hidden"
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpandedDomain(isExpanded ? null : domain.name)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${domain.color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: domain.color }} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-[#3D3D3D] mb-1">{domain.name}</h4>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-bold" style={{ color: domain.color }}>
                            {domain.score.toFixed(1)}
                          </span>
                          <span className="text-gray-500">{domain.level}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{domain.percentile}th percentile</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {domain.score >= domain.benchmark ? (
                        <span className="px-3 py-1 bg-[#8BC53F]/10 text-[#6B9C2F] text-xs font-semibold rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Strength
                        </span>
                      ) : domain.score >= domain.benchmark - 0.2 ? (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Meets Target
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Growth Opportunity
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 bg-gray-50"
                      >
                        <div className="p-6 space-y-6">
                          {/* Your Score Section */}
                          <div 
                            className="rounded-xl p-5 border-2"
                            style={{ 
                              backgroundColor: `${domain.color}05`,
                              borderColor: `${domain.color}30`
                            }}
                          >
                            <h4 className="font-semibold text-[#3D3D3D] mb-4">Your Score</h4>
                            
                            {/* Score Display */}
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="text-center">
                                <p className="text-xs text-gray-600 mb-2">Your Score</p>
                                <div className="flex items-baseline justify-center gap-1">
                                  <span className="text-2xl font-bold" style={{ color: domain.color }}>
                                    {domain.score.toFixed(1)}
                                  </span>
                                  <span className="text-gray-400 text-sm">/ 3.0</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{domain.level}</p>
                              </div>
                              
                              <div className="text-center border-x border-gray-200">
                                <p className="text-xs text-gray-600 mb-2">NAHQ - {SAMPLE_RESULTS.position} Standard</p>
                                <div className="flex items-baseline justify-center gap-1">
                                  <span className="text-2xl font-bold text-gray-900">
                                    {domain.benchmark.toFixed(1)}
                                  </span>
                                  <span className="text-gray-400 text-sm">/ 3.0</span>
                                </div>
                                <p className={`text-xs font-medium mt-1 ${domain.score >= domain.benchmark ? 'text-green-600' : 'text-orange-600'}`}>
                                  {domain.score >= domain.benchmark ? 'Exceeds' : 'Below'} Benchmark
                                </p>
                              </div>
                              
                              <div className="text-center">
                                <p className="text-xs text-gray-600 mb-2">Peer Percentile</p>
                                <div className="text-2xl font-bold" style={{ color: domain.color }}>
                                  {domain.percentile}th
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Among peers</p>
                              </div>
                            </div>
                            
                            {/* Visual Score Bar */}
                            <div className="space-y-2 mb-4">
                              <div className="relative h-12 bg-white rounded-lg">
                                {/* Scale markers */}
                                <div className="absolute inset-0 flex">
                                  <div className="flex-1 border-r border-gray-200"></div>
                                  <div className="flex-1 border-r border-gray-200"></div>
                                  <div className="flex-1"></div>
                                </div>
                                
                                {/* Peer Average marker */}
                                <div 
                                  className="absolute top-0 bottom-0 w-1 bg-gray-400 z-10 shadow-sm"
                                  style={{ left: `${(domain.peerAverage / 3) * 100}%` }}
                                >
                                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-400 text-white text-xs rounded whitespace-nowrap font-semibold shadow-sm">
                                    Avg: {domain.peerAverage.toFixed(1)}
                                  </div>
                                </div>
                                
                                {/* NAHQ Role Benchmark marker */}
                                <div 
                                  className="absolute top-0 bottom-0 w-1 bg-[#FFED00] z-10 shadow-sm"
                                  style={{ left: `${(domain.benchmark / 3) * 100}%` }}
                                >
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#FFED00] text-[#3D3D3D] text-xs rounded whitespace-nowrap font-semibold shadow-sm">
                                    Benchmark: {domain.benchmark.toFixed(1)}
                                  </div>
                                </div>
                                
                                {/* Your score bar */}
                                <div 
                                  className="absolute top-0 bottom-0 left-0 rounded-lg transition-all"
                                  style={{ 
                                    width: `${(domain.score / 3) * 100}%`,
                                    backgroundColor: `${domain.color}40`
                                  }}
                                />
                                
                                {/* Your score marker */}
                                <div 
                                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group"
                                  style={{ left: `${(domain.score / 3) * 100}%` }}
                                >
                                  <div className="relative">
                                    <div 
                                      className="w-7 h-7 rounded-full border-3 border-white shadow-lg flex items-center justify-center cursor-pointer"
                                      style={{ backgroundColor: domain.color }}
                                    >
                                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                    </div>
                                    <div 
                                      className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs font-bold text-white whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                      style={{ backgroundColor: domain.color }}
                                    >
                                      You: {domain.score.toFixed(1)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 pt-8">
                                <span>1.0<br/>Foundational</span>
                                <span>2.0<br/>Proficient</span>
                                <span>3.0<br/>Advanced</span>
                              </div>
                              <div className="flex justify-center gap-4 pt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                  <span>NAHQ Average (n=6,434)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-3 h-3 rounded-full bg-[#FFED00]"></div>
                                  <span>NAHQ Role Benchmark</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* AI Performance Summary */}
                            <div className="bg-gradient-to-br from-[#00A3E0]/5 via-[#00B5E2]/5 to-transparent rounded-lg p-4 border border-[#00A3E0]/20">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center flex-shrink-0">
                                  <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-[#3D3D3D] mb-1">AI Analysis: Your {domain.name} Performance</h4>
                                  <p className="text-xs text-gray-500">Personalized insights based on your assessment</p>
                                </div>
                              </div>
                              <div className="ml-11 space-y-3">
                                {(() => {
                                  const strengths = data.competencies?.filter(c => c.score >= c.benchmark) || [];
                                  const meetsTarget = data.competencies?.filter(c => c.score >= c.benchmark - 0.2 && c.score < c.benchmark) || [];
                                  const growthOpps = data.competencies?.filter(c => c.score < c.benchmark - 0.2) || [];
                                  const gap = domain.benchmark - domain.score;
                                  
                                  return (
                                    <>
                                      {/* Overall Performance */}
                                      <div className="text-xs text-gray-700 leading-relaxed">
                                        <strong className="text-[#3D3D3D]">Overall Assessment:</strong>{' '}
                                        {domain.score >= domain.benchmark 
                                          ? `Your score of ${domain.score.toFixed(1)} exceeds the NAHQ Role Benchmark of ${domain.benchmark.toFixed(1)} for ${SAMPLE_RESULTS.position}, placing you in the ${domain.percentile}th percentile among peers. This demonstrates strong competency in ${domain.name.toLowerCase()}.`
                                          : gap <= 0.2
                                          ? `Your score of ${domain.score.toFixed(1)} is approaching the NAHQ Role Benchmark of ${domain.benchmark.toFixed(1)} for ${SAMPLE_RESULTS.position}. You're performing above the participant average (${domain.peerAverage.toFixed(1)}) and just ${gap.toFixed(1)} points from benchmark.`
                                          : `Your score of ${domain.score.toFixed(1)} indicates a development opportunity in ${domain.name.toLowerCase()}. The NAHQ Role Benchmark for ${SAMPLE_RESULTS.position} is ${domain.benchmark.toFixed(1)} (gap of ${gap.toFixed(1)}), while the participant average is ${domain.peerAverage.toFixed(1)}.`
                                        }
                                      </div>
                                      
                                      {/* Competency Breakdown Insights */}
                                      {strengths.length > 0 && (
                                        <div className="text-xs text-gray-700 leading-relaxed">
                                          <strong className="text-[#6B9C2F]">✓ Strengths ({strengths.length}):</strong>{' '}
                                          {strengths.length === 1 
                                            ? `You excel at "${strengths[0].name.toLowerCase()}" (${strengths[0].score.toFixed(1)}), which is ${(strengths[0].score - strengths[0].benchmark).toFixed(1)} points above benchmark.`
                                            : `You're performing above benchmark in ${strengths.length} competencies, with your highest score in "${strengths.sort((a, b) => (b.score - b.benchmark) - (a.score - a.benchmark))[0].name.toLowerCase()}" (${strengths[0].score.toFixed(1)}). These strengths position you well for leadership responsibilities.`
                                          }
                                        </div>
                                      )}
                                      
                                      {meetsTarget.length > 0 && (
                                        <div className="text-xs text-gray-700 leading-relaxed">
                                          <strong className="text-gray-700">→ Meeting Target ({meetsTarget.length}):</strong>{' '}
                                          {meetsTarget.length === 1
                                            ? `"${meetsTarget[0].name}" is approaching benchmark. A small improvement of ${Math.abs(meetsTarget[0].score - meetsTarget[0].benchmark).toFixed(1)} points would push you above target.`
                                            : `${meetsTarget.length} competencies are close to benchmark. These areas show solid foundation with room for refinement.`
                                          }
                                        </div>
                                      )}
                                      
                                      {growthOpps.length > 0 && (
                                        <div className="text-xs text-gray-700 leading-relaxed">
                                          <strong className="text-amber-700">⚠ Growth Opportunities ({growthOpps.length}):</strong>{' '}
                                          {growthOpps.length === 1
                                            ? `"${growthOpps[0].name}" shows the largest gap (${Math.abs(growthOpps[0].score - growthOpps[0].benchmark).toFixed(1)} points below benchmark). Focused development here would have significant impact on your overall domain score.`
                                            : `${growthOpps.length} competencies need development. Your priority should be "${growthOpps.sort((a, b) => (a.score - a.benchmark) - (b.score - b.benchmark))[0].name.toLowerCase()}" with a gap of ${Math.abs(growthOpps[0].score - growthOpps[0].benchmark).toFixed(1)} points—this represents your biggest opportunity for improvement.`
                                          }
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <h4 className="font-semibold text-[#3D3D3D] mb-2">About This Domain</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{data.description}</p>
                          </div>

                          {/* Competencies */}
                          <div>
                            <h4 className="font-semibold text-[#3D3D3D] mb-3">Competency Breakdown</h4>
                            
                            {(() => {
                              const strengths = data.competencies?.filter(c => c.score >= c.benchmark) || [];
                              const meetsTarget = data.competencies?.filter(c => c.score >= c.benchmark - 0.2 && c.score < c.benchmark) || [];
                              const growthOpportunities = data.competencies?.filter(c => c.score < c.benchmark - 0.2) || [];
                              
                              return (
                                <div className="space-y-6">
                                  <style>{`
                                    .competency-table { table-layout: fixed; }
                                    .competency-table th:nth-child(1),
                                    .competency-table td:nth-child(1) { width: 45%; }
                                    .competency-table th:nth-child(2),
                                    .competency-table td:nth-child(2) { width: 13%; }
                                    .competency-table th:nth-child(3),
                                    .competency-table td:nth-child(3) { width: 15%; }
                                    .competency-table th:nth-child(4),
                                    .competency-table td:nth-child(4) { width: 15%; }
                                    .competency-table th:nth-child(5),
                                    .competency-table td:nth-child(5) { width: 12%; }
                                  `}</style>
                                  
                                  {strengths.length > 0 && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="w-4 h-4 text-[#6B9C2F]" />
                                        <h5 className="font-semibold text-[#6B9C2F] text-sm">Strengths ({strengths.length})</h5>
                                      </div>
                                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="competency-table w-full text-sm">
                                          <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Competency</th>
                                              <th className="text-center py-3 px-3 font-semibold text-gray-700">Your Score</th>
                                              <th className="text-center py-3 px-3 font-semibold text-white bg-[#00A3E0] rounded-t-lg">
                                                NAHQ Benchmark
                                              </th>
                                              <th className="text-center py-3 px-3 font-semibold text-gray-700">Participant Avg</th>
                                              <th className="text-center py-3 px-3 font-semibold text-gray-700">Gap</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {strengths.map((comp, i) => (
                                              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-700">{comp.name}</td>
                                                <td className="py-3 px-3 text-center font-bold" style={{ color: domain.color }}>
                                                  {comp.score.toFixed(1)}
                                                </td>
                                                <td className={`py-3 px-3 text-center font-bold text-[#00A3E0] bg-[#00A3E0]/5 border-l-2 border-r-2 border-[#00A3E0]/30 ${i === strengths.length - 1 ? 'rounded-b-lg' : ''}`}>
                                                  {comp.benchmark.toFixed(1)}
                                                </td>
                                                <td className="py-3 px-3 text-center text-gray-600">
                                                  {comp.average.toFixed(1)}
                                                </td>
                                                <td className="py-3 px-3 text-center font-semibold text-[#6B9C2F]">
                                                  +{(comp.score - comp.benchmark).toFixed(1)}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {meetsTarget.length > 0 && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="w-4 h-4 text-gray-600" />
                                        <h5 className="font-semibold text-gray-700 text-sm">Meets Target ({meetsTarget.length})</h5>
                                      </div>
                                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="competency-table w-full text-sm">
                                          <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Competency</th>
                                              <th className="text-center py-3 px-3 font-semibold text-gray-700">Your Score</th>
                                              <th className="text-center py-3 px-3 font-semibold text-white bg-[#00A3E0] rounded-t-lg">
                                                NAHQ Benchmark
                                              </th>
                                              <th className="text-center py-3 px-3 font-semibold text-gray-700">Participant Avg</th>
                                              <th className="text-center py-3 px-3 font-semibold text-gray-700">Gap</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {meetsTarget.map((comp, i) => (
                                              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-700">{comp.name}</td>
                                                <td className="py-3 px-3 text-center font-bold" style={{ color: domain.color }}>
                                                  {comp.score.toFixed(1)}
                                                </td>
                                                <td className={`py-3 px-3 text-center font-bold text-[#00A3E0] bg-[#00A3E0]/5 border-l-2 border-r-2 border-[#00A3E0]/30 ${i === meetsTarget.length - 1 ? 'rounded-b-lg' : ''}`}>
                                                  {comp.benchmark.toFixed(1)}
                                                </td>
                                                <td className="py-3 px-3 text-center text-gray-600">
                                                  {comp.average.toFixed(1)}
                                                </td>
                                                <td className="py-3 px-3 text-center font-semibold text-gray-600">
                                                  {(comp.score - comp.benchmark).toFixed(1)}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {growthOpportunities.length > 0 && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-4 h-4 text-amber-600" />
                                        <h5 className="font-semibold text-amber-700 text-sm">Growth Opportunities ({growthOpportunities.length})</h5>
                                      </div>
                                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="competency-table w-full text-sm">
                                          <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                              <th className="text-left py-3 px-4 font-semibold text-gray-700">Competency</th>
                                              <th className="text-center py-3 px-3 font-semibold text-gray-700">Your Score</th>
                                              <th className="text-center py-3 px-3 font-semibold text-white bg-[#00A3E0] rounded-t-lg">
                                                NAHQ Benchmark
                                              </th>
                                              <th className="text-center py-3 px-3 font-semibold text-gray-700">Participant Avg</th>
                                              <th className="text-center py-3 px-3 font-semibold text-gray-700">Gap</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {growthOpportunities.map((comp, i) => (
                                              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-gray-700">{comp.name}</td>
                                                <td className="py-3 px-3 text-center font-bold" style={{ color: domain.color }}>
                                                  {comp.score.toFixed(1)}
                                                </td>
                                                <td className={`py-3 px-3 text-center font-bold text-[#00A3E0] bg-[#00A3E0]/5 border-l-2 border-r-2 border-[#00A3E0]/30 ${i === growthOpportunities.length - 1 ? 'rounded-b-lg' : ''}`}>
                                                  {comp.benchmark.toFixed(1)}
                                                </td>
                                                <td className="py-3 px-3 text-center text-gray-600">
                                                  {comp.average.toFixed(1)}
                                                </td>
                                                <td className="py-3 px-3 text-center font-semibold text-amber-600">
                                                  {(comp.score - comp.benchmark).toFixed(1)}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <Button className="w-full bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold">
                              Start Learning
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>


      </main>

      {/* Floating Chat Button */}
      <FloatingChatButton onClick={() => setShowChat(true)} />

      {/* AI Chat Modal */}
      {showChat && (
        <AIChat 
          onClose={() => setShowChat(false)} 
          results={SAMPLE_RESULTS}
        />
      )}



      {/* Peer Comparison Modal */}
      <AnimatePresence>
        {showPeerComparison && (
          <PeerComparisonModal 
            results={SAMPLE_RESULTS}
            onClose={() => setShowPeerComparison(false)} 
          />
        )}
      </AnimatePresence>

      {/* Overall Score Modal */}
      <AnimatePresence>
        {showOverallScoreModal && (
          <OverallScoreModal 
            results={SAMPLE_RESULTS}
            onClose={() => setShowOverallScoreModal(false)} 
          />
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <ProfileBreakdownModal 
            results={SAMPLE_RESULTS}
            onClose={() => setShowProfileModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}