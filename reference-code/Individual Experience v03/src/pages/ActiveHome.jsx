import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Trophy, Calendar, MessageCircle, ArrowRight, Download, Users, Share2, 
  Flag, TrendingUp, AlertTriangle, CheckCircle, Bot, ChevronDown, ChevronRight,
  Clock, Play, Eye, Video, BookOpen, Award, BarChart3, RefreshCw, Network,
  Settings, Globe, Shield, CheckSquare, ClipboardCheck, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/shared/Header';
import FrameworkWheel from '@/components/shared/FrameworkWheel';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChat from '@/components/results/AIChat';
import PeerComparisonModal from '@/components/results/PeerComparisonModal';
import OverallScoreModal from '@/components/results/OverallScoreModal';
import ProfileBreakdownModal from '@/components/results/ProfileBreakdownModal';
import CoursePreviewModal from '@/components/roadmap/CoursePreviewModal';

const SAMPLE_RESULTS = {
  overallScore: 1.8,
  overallBenchmark: 2.0,
  peerAverage: 1.7,
  percentile: 47,
  completionDate: 'January 27, 2026',
  position: 'Director of Quality',
  lastAssessmentDate: 'January 27, 2026',
  nextReassessmentDue: 'July 27, 2026',
  daysUntilReassessment: 179,
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

const LEARNING_LABS = [
  { 
    title: 'Healthcare Analytics Workshop', 
    date: 'Feb 20, 2026', 
    time: '2:00 PM EST',
    type: 'Live',
    domain: 'Health Data Analytics',
    color: '#F68B1F',
    recommended: true
  },
  { 
    title: 'Quality Leadership Strategies', 
    date: 'Mar 5, 2026', 
    time: '1:00 PM EST',
    type: 'On-Demand',
    domain: 'Quality Leadership',
    color: '#003DA5',
    recommended: false
  },
  { 
    title: 'Patient Safety Best Practices', 
    date: 'Mar 12, 2026', 
    time: '3:00 PM EST',
    type: 'Live',
    domain: 'Patient Safety',
    color: '#009CA6',
    recommended: true
  }
];

const RECOMMENDED_COURSES = [
  {
    title: 'Advanced Data Visualization',
    duration: '4 hours',
    reason: 'Professionals with your profile who took this course improved their Analytics score by 0.3 on average',
    popularity: '89% completion rate among similar users',
    domain: 'Health Data Analytics',
    color: '#F68B1F'
  },
  {
    title: 'Healthcare Quality Metrics',
    duration: '5 hours',
    reason: 'Highly recommended for Quality Managers focusing on analytics development',
    popularity: 'Taken by 234 professionals with similar profiles',
    domain: 'Quality Review',
    color: '#99154B'
  },
  {
    title: 'Strategic Performance Improvement',
    duration: '6 hours',
    reason: 'Combines your leadership strength with performance improvement skills',
    popularity: '92% would recommend to peers',
    domain: 'Performance Improvement',
    color: '#00B5E2'
  }
];

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

export default function ActiveHome() {
  const [showChat, setShowChat] = useState(false);
  const [chatContext, setChatContext] = useState('default');
  const [showPeerComparison, setShowPeerComparison] = useState(false);
  const [showOverallScoreModal, setShowOverallScoreModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState('Health Data Analytics');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const handleCourseClick = (courseTitle, domainName) => {
    // Find domain data
    const domainData = {
      'Health Data Analytics': {
        domain: 'Health Data Analytics',
        color: '#F68B1F',
        currentScore: 1.4,
        currentLevel: 'Foundational',
        targetScore: 1.7,
        targetLevel: 'Proficient',
      },
      'Performance Improvement': {
        domain: 'Performance Improvement',
        color: '#00B5E2',
        currentScore: 1.7,
        currentLevel: 'Proficient',
        targetScore: 2.0,
        targetLevel: 'Proficient',
      },
      'Population Health': {
        domain: 'Population Health',
        color: '#8BC53F',
        currentScore: 1.5,
        currentLevel: 'Foundational',
        targetScore: 1.8,
        targetLevel: 'Proficient',
      }
    };

    // Find course data
    const coursesData = {
      'HQ Principles: Data-Driven Decisions': {
        title: 'HQ Principles: Data-Driven Decisions',
        duration: '2 hours',
        targetDate: 'Feb 15, 2026',
        description: 'Learn core principles of using data to drive quality improvement decisions',
        format: 'Self-paced online'
      },
      'Introduction to Healthcare Analytics': {
        title: 'Introduction to Healthcare Analytics',
        duration: '8 hours',
        targetDate: 'Mar 1, 2026',
        description: 'Master fundamental analytics techniques for healthcare quality measurement',
        format: 'Interactive modules with exercises'
      },
      'Lean Six Sigma Fundamentals': {
        title: 'Lean Six Sigma Fundamentals',
        duration: '8 hours',
        targetDate: 'May 1, 2026',
        description: 'Apply proven methodologies to eliminate waste and reduce variation',
        format: 'Certification course'
      }
    };

    setSelectedCourse(coursesData[courseTitle] || { title: courseTitle });
    setSelectedDomain(domainData[domainName]);
    setShowCourseModal(true);
  };

  const strengths = SAMPLE_RESULTS.domains.filter(d => d.isStrength);
  const gaps = SAMPLE_RESULTS.domains.filter(d => d.isGap);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="Home" />
      
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
                Welcome back, Sarah! 👋
              </h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                Last assessment: {SAMPLE_RESULTS.completionDate}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-gray-600">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-600"
              onClick={() => setShowPeerComparison(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Compare
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Reassessment Notification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#FFED00]/10 to-[#FFED00]/5 border-2 border-[#FFED00]/30 rounded-2xl p-5 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFED00]/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-[#3D3D3D]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#3D3D3D] mb-2 flex items-center gap-2">
                <span>📊 Your Reassessment is Ready</span>
              </h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                It's been 6 months since your last assessment. Retake it now to track your progress, see how your competencies have evolved, and update your development plan based on new skills you've gained.
              </p>
              <div className="flex gap-2">
                <Link to={createPageUrl('Assessment')}>
                  <Button size="sm" className="bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Take Reassessment Now
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" className="text-gray-600">
                  Remind Me Later
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional Assessment Results Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] rounded-2xl p-6 text-white shadow-xl shadow-[#00A3E0]/20 mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">Your Professional Assessment Profile</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Your current assessment shows strong leadership capabilities with a focused growth opportunity in analytics.
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

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={createPageUrl('Results')} className="flex-1">
              <Button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-6 backdrop-blur border border-white/30">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Full Results & Domain Breakdown
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Development Plan Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-[#00A3E0]" />
              <h3 className="font-bold text-[#3D3D3D] text-lg">Your Development Plan Progress</h3>
            </div>
            <Link to={createPageUrl('Roadmap')}>
              <Button variant="ghost" size="sm" className="text-[#00A3E0]">
                Full Roadmap
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Gap Analysis */}
          <div className="bg-white rounded-xl border-2 border-[#F68B1F]/30 p-5 mb-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F68B1F] to-[#e07a15] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#F68B1F]/20">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#3D3D3D] mb-1">Top Opportunity Area</h4>
                <p className="text-sm text-gray-600">Based on your role and applied behavior gaps</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1.5">Domain</p>
                <p className="font-bold text-[#F68B1F]">Health Data Analytics</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1.5">Current Level</p>
                <p className="font-semibold text-gray-700">1.4 (Foundational)</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1.5">Role Expectation</p>
                <p className="font-semibold text-gray-700">2.0 (Proficient)</p>
              </div>
            </div>
          </div>

          {/* Personalized Development Context */}
          <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/30 rounded-xl border border-blue-100 p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00A3E0]/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#3D3D3D] mb-1 flex items-center gap-2">
                  <span>AI Analysis</span>
                  <span className="text-xs px-2 py-0.5 bg-[#00A3E0]/10 text-[#00A3E0] rounded-full font-medium">Personalized</span>
                </h4>
                <p className="text-xs text-gray-500 mb-3">Based on your assessment results and career goals</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white/60 rounded-lg p-3 border border-blue-100/50">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Your personalized plan includes courses, workshops, and professional development opportunities mapped directly to closing your Analytics gap. These resources are designed to help you grow from <strong className="text-[#3D3D3D]">Foundational (1.4)</strong> to <strong className="text-[#3D3D3D]">Proficient (1.7)</strong> while building on your existing leadership strengths.
                </p>
              </div>
              
              <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200/50">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-[#3D3D3D]">💡 Note:</strong> The benchmarks shown are context for your role, not performance judgments. Your development plan is personalized to your current level, experience, and career goals—focused on building competency over time.
                </p>
              </div>
              
              <Button 
                size="sm"
                variant="outline"
                onClick={() => {
                  setChatContext('adjust_plan');
                  setShowChat(true);
                }}
                className="w-full border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/5"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Discuss with AI Guide
              </Button>
            </div>
          </div>
        </motion.div>



        {/* Your Learning Pathway */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#00A3E0]" />
              <h2 className="text-lg font-bold text-[#3D3D3D]">Your Learning Pathway</h2>
            </div>
            <Link to={createPageUrl('Roadmap')}>
              <Button variant="ghost" size="sm" className="text-[#00A3E0]">
                View Full Roadmap
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {/* Health Data Analytics - High Priority */}
            <motion.div
              initial={false}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setExpandedDomain(expandedDomain === 'Health Data Analytics' ? null : 'Health Data Analytics')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: '#F68B1F15' }}
                    >
                      <BarChart3 className="w-6 h-6" style={{ color: '#F68B1F' }} />
                    </div>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-base text-[#3D3D3D]">Health Data Analytics</h3>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 bg-orange-100 text-orange-700">
                        HIGH PRIORITY
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Current Assessment:</span>
                          <span className="font-semibold text-gray-900">1.4 (Foundational)</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Development Target:</span>
                          <span className="font-semibold text-gray-900">1.7 (Proficient)</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Complete the recommended courses below to develop toward your target level
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          4 courses recommended
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedDomain === 'Health Data Analytics' ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedDomain === 'Health Data Analytics' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-5 space-y-3">
                      <button
                        onClick={() => handleCourseClick('HQ Principles: Data-Driven Decisions', 'Health Data Analytics')}
                        className="w-full bg-white rounded-xl border-2 border-gray-200 hover:border-[#00A3E0]/40 hover:shadow-md transition-all duration-300 p-5 text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#3D3D3D] mb-2">
                              HQ Principles: Data-Driven Decisions
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-600 mb-3">
                              Learn core principles of using data to drive quality improvement decisions
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Complete by Feb 15, 2026
                              </span>
                              <span>•</span>
                              <span>Self-paced online</span>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            variant="ghost"
                            className="text-[#00A3E0] hover:text-[#0093c9] hover:bg-[#00A3E0]/5 flex-shrink-0"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Button>
                        </div>
                      </button>

                      <button
                        onClick={() => handleCourseClick('Introduction to Healthcare Analytics', 'Health Data Analytics')}
                        className="w-full bg-white rounded-xl border-2 border-gray-200 hover:border-[#00A3E0]/40 hover:shadow-md transition-all duration-300 p-5 text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#3D3D3D] mb-2">
                              Introduction to Healthcare Analytics
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-600 mb-3">
                              Master fundamental analytics techniques for healthcare quality measurement
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Complete by Mar 1, 2026
                              </span>
                              <span>•</span>
                              <span>Interactive modules with exercises</span>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            variant="ghost"
                            className="text-[#00A3E0] hover:text-[#0093c9] hover:bg-[#00A3E0]/5 flex-shrink-0"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Button>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Performance Improvement */}
            <motion.div
              initial={false}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setExpandedDomain(expandedDomain === 'Performance Improvement' ? null : 'Performance Improvement')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: '#00B5E215' }}
                    >
                      <Settings className="w-6 h-6" style={{ color: '#00B5E2' }} />
                    </div>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-base text-[#3D3D3D]">Performance Improvement</h3>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 bg-blue-100 text-blue-700">
                        Medium Priority
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Current Assessment:</span>
                          <span className="font-semibold text-gray-900">1.7 (Proficient)</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Development Target:</span>
                          <span className="font-semibold text-gray-900">2.0 (Proficient)</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Complete the recommended courses below to develop toward your target level
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          3 courses recommended
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedDomain === 'Performance Improvement' ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedDomain === 'Performance Improvement' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-5 space-y-3">
                      <button
                        onClick={() => handleCourseClick('Lean Six Sigma Fundamentals', 'Performance Improvement')}
                        className="w-full bg-white rounded-xl border-2 border-gray-200 hover:border-[#00A3E0]/40 hover:shadow-md transition-all duration-300 p-5 text-left"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#3D3D3D] mb-2">
                              Lean Six Sigma Fundamentals
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-600 mb-3">
                              Apply proven methodologies to eliminate waste and reduce variation
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Complete by May 1, 2026
                              </span>
                              <span>•</span>
                              <span>Certification course</span>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            variant="ghost"
                            className="text-[#00A3E0] hover:text-[#0093c9] hover:bg-[#00A3E0]/5 flex-shrink-0"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4 ml-1.5" />
                          </Button>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Population Health */}
            <motion.div
              initial={false}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setExpandedDomain(expandedDomain === 'Population Health' ? null : 'Population Health')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: '#8BC53F15' }}
                    >
                      <Globe className="w-6 h-6" style={{ color: '#8BC53F' }} />
                    </div>
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-base text-[#3D3D3D]">Population Health</h3>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 bg-blue-100 text-blue-700">
                        Medium Priority
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Current Assessment:</span>
                          <span className="font-semibold text-gray-900">1.5 (Foundational)</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Development Target:</span>
                          <span className="font-semibold text-gray-900">1.8 (Proficient)</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Complete the recommended courses below to develop toward your target level
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          2 courses recommended
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {expandedDomain === 'Population Health' ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Floating Chat Button */}
      <FloatingChatButton onClick={() => setShowChat(true)} />

      {/* AI Chat Modal */}
      {showChat && (
        <AIChat 
          onClose={() => {
            setShowChat(false);
            setChatContext('default');
          }}
          context={chatContext}
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

      {/* Course Preview Modal */}
      <AnimatePresence>
        {showCourseModal && selectedCourse && (
          <CoursePreviewModal
            course={selectedCourse}
            domain={selectedDomain}
            onClose={() => {
              setShowCourseModal(false);
              setSelectedCourse(null);
              setSelectedDomain(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}