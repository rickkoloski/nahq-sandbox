import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  BarChart3, Users, Network, Settings, Globe, Shield, CheckSquare, ClipboardCheck,
  ChevronDown, ChevronRight, BookOpen, Calendar, ArrowRight, Target, Download, Share2,
  Bot, MessageCircle, CheckCircle, TrendingUp, ChevronUp, Info, Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Header from '@/components/shared/Header';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChat from '@/components/results/AIChat';
import CoursePreviewModal from '@/components/roadmap/CoursePreviewModal';
import AIAnalysisSummary from '@/components/results/AIAnalysisSummary';

const DOMAIN_ICONS = {
  'Professional Engagement': Users,
  'Quality Leadership': Network,
  'Performance Improvement': Settings,
  'Population Health': Globe,
  'Health Data Analytics': BarChart3,
  'Patient Safety': Shield,
  'Regulatory & Accreditation': CheckSquare,
  'Quality Review': ClipboardCheck,
};

const ASSESSMENT_HISTORY = [
  {
    id: 'jan2026',
    label: 'January 27, 2026',
    completionDate: 'January 27, 2026',
    overallScore: 1.8,
    overallBenchmark: 2.0,
    percentile: 47
  },
  {
    id: 'jul2025',
    label: 'July 15, 2025',
    completionDate: 'July 15, 2025',
    overallScore: 1.6,
    overallBenchmark: 2.0,
    percentile: 38
  },
  {
    id: 'jan2025',
    label: 'January 10, 2025',
    completionDate: 'January 10, 2025',
    overallScore: 1.5,
    overallBenchmark: 2.0,
    percentile: 32
  }
];

const SAMPLE_RESULTS = {
  overallScore: 1.8,
  overallBenchmark: 2.0,
  percentile: 47,
  position: 'Director of Quality',
  completionDate: 'January 27, 2026',
  domains: [
    { 
      name: 'Professional Engagement', 
      score: 2.1, 
      level: 'Advanced', 
      percentile: 65, 
      color: '#6B4C9A', 
      benchmark: 2.0,
      currentLevel: 'Proficient',
      targetScore: 2.1,
      targetLevel: 'Advanced',
      priority: 'Ongoing'
    },
    { 
      name: 'Quality Leadership', 
      score: 2.1, 
      level: 'Advanced', 
      percentile: 78, 
      color: '#003DA5', 
      benchmark: 2.2,
      currentLevel: 'Advanced',
      targetScore: 2.3,
      targetLevel: 'Advanced',
      priority: 'Maintenance',
      isStrength: true
    },
    { 
      name: 'Performance Improvement', 
      score: 1.7, 
      level: 'Proficient', 
      percentile: 52, 
      color: '#00B5E2', 
      benchmark: 2.1,
      currentLevel: 'Proficient',
      targetScore: 2.0,
      targetLevel: 'Proficient',
      priority: 'Medium Priority'
    },
    { 
      name: 'Population Health', 
      score: 1.5, 
      level: 'Foundational', 
      percentile: 38, 
      color: '#8BC53F', 
      benchmark: 1.8,
      currentLevel: 'Foundational',
      targetScore: 1.8,
      targetLevel: 'Proficient',
      priority: 'Medium Priority'
    },
    { 
      name: 'Health Data Analytics', 
      score: 1.4, 
      level: 'Foundational', 
      percentile: 31, 
      color: '#F68B1F', 
      benchmark: 2.0,
      currentLevel: 'Foundational',
      targetScore: 1.7,
      targetLevel: 'Proficient',
      priority: 'HIGH PRIORITY',
      isGap: true
    },
    { 
      name: 'Patient Safety', 
      score: 1.9, 
      level: 'Proficient', 
      percentile: 65, 
      color: '#009CA6', 
      benchmark: 2.1,
      currentLevel: 'Proficient',
      targetScore: 2.1,
      targetLevel: 'Advanced',
      priority: 'Maintenance',
      isStrength: true
    },
    { 
      name: 'Regulatory & Accreditation', 
      score: 1.8, 
      level: 'Proficient', 
      percentile: 60, 
      color: '#ED1C24', 
      benchmark: 2.0,
      currentLevel: 'Proficient',
      targetScore: 2.0,
      targetLevel: 'Proficient',
      priority: 'Maintenance',
      isStrength: true
    },
    { 
      name: 'Quality Review', 
      score: 1.6, 
      level: 'Proficient', 
      percentile: 48, 
      color: '#99154B', 
      benchmark: 1.9,
      currentLevel: 'Foundational',
      targetScore: 1.8,
      targetLevel: 'Proficient',
      priority: 'Ongoing'
    }
  ]
};

const DOMAIN_DATA = {
  'Health Data Analytics': {
    description: 'Leverage the organization\'s analytic environment to help guide data driven decision making and inform quality improvement initiatives.',
    competencies: [
      { name: 'Apply procedures for the governance of data assets', score: 1.5, benchmark: 2.0, average: 1.6 },
      { name: 'Design data collection plans for key metrics and performance indicators', score: 1.4, benchmark: 2.1, average: 1.7 },
      { name: 'Acquire data from source systems', score: 1.3, benchmark: 1.9, average: 1.5 },
      { name: 'Integrate data from internal and external electronic data systems', score: 1.4, benchmark: 2.0, average: 1.6 },
      { name: 'Use statistical and visualization methods', score: 1.4, benchmark: 2.1, average: 1.6 }
    ]
  },
  'Performance Improvement': {
    description: 'Use performance and process improvement, project management and change management methods to support operational and clinical quality initiatives.',
    competencies: [
      { name: 'Implement standard performance and process improvement (PPI) methods', score: 1.8, benchmark: 2.1, average: 1.7 },
      { name: 'Apply project management methods', score: 1.7, benchmark: 2.0, average: 1.6 },
      { name: 'Use change management principles and tools', score: 1.6, benchmark: 2.2, average: 1.8 }
    ]
  },
  'Population Health': {
    description: 'Evaluate and improve healthcare processes and care transitions to advance the efficient, effective and safe care of defined populations.',
    competencies: [
      { name: 'Integrate population health management strategies into quality work', score: 1.6, benchmark: 1.8, average: 1.6 },
      { name: 'Apply a holistic approach to improvement', score: 1.5, benchmark: 1.7, average: 1.5 },
      { name: 'Collaborate with stakeholders to improve care processes and transitions', score: 1.4, benchmark: 1.9, average: 1.7 }
    ]
  },
  'Quality Leadership': {
    description: 'Advance the organization\'s commitment to healthcare quality through collaboration, learning opportunities and communication.',
    competencies: [
      { name: 'Direct the quality infrastructure to achieve organizational objectives', score: 2.3, benchmark: 2.2, average: 2.0 },
      { name: 'Apply procedures to regulate the use of privileged or confidential information', score: 2.1, benchmark: 2.2, average: 1.9 },
      { name: 'Implement processes to promote stakeholder engagement and interprofessional teamwork', score: 2.0, benchmark: 2.3, average: 1.9 }
    ]
  },
  'Patient Safety': {
    description: 'Cultivate a safe healthcare environment by promoting safe practices, nurturing a just culture and improving processes that detect, mitigate or prevent harm.',
    competencies: [
      { name: 'Assess the organization\'s patient safety culture', score: 2.0, benchmark: 2.1, average: 1.8 },
      { name: 'Apply safety science principles and methods in healthcare quality work', score: 1.9, benchmark: 2.2, average: 1.9 },
      { name: 'Use organizational procedures to identify and report patient safety risks and events', score: 1.8, benchmark: 2.0, average: 1.7 }
    ]
  },
  'Regulatory & Accreditation': {
    description: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with internal and external requirements.',
    competencies: [
      { name: 'Operationalize processes to support compliance with regulations and standards', score: 1.9, benchmark: 2.0, average: 1.7 },
      { name: 'Facilitate continuous survey readiness activities', score: 1.8, benchmark: 2.1, average: 1.8 },
      { name: 'Guide the organization through survey processes and findings', score: 1.7, benchmark: 1.9, average: 1.6 }
    ]
  },
  'Professional Engagement': {
    description: 'Engage in the healthcare quality profession with a commitment to practicing ethically, enhancing one\'s competence and advancing the field.',
    competencies: [
      { name: 'Integrate ethical standards into healthcare quality practice', score: 2.2, benchmark: 2.0, average: 1.9 },
      { name: 'Engage in lifelong learning as a healthcare quality professional', score: 2.1, benchmark: 2.1, average: 1.8 },
      { name: 'Participate in activities that advance the healthcare quality profession', score: 2.0, benchmark: 1.9, average: 1.7 }
    ]
  },
  'Quality Review': {
    description: 'Direct activities that support compliance with voluntary, mandatory and contractual reporting requirements for data acquisition, analysis, reporting and improvement.',
    competencies: [
      { name: 'Relate current and emerging payment models to healthcare quality work', score: 1.7, benchmark: 1.9, average: 1.6 },
      { name: 'Conduct the activities to execute measure requirements', score: 1.6, benchmark: 2.0, average: 1.7 },
      { name: 'Implement processes to facilitate practitioner performance review activities', score: 1.5, benchmark: 1.8, average: 1.5 }
    ]
  }
};

const DOMAIN_COURSES = {
  'Health Data Analytics': [
    { 
      title: 'Health Data Analytics Micro-Credential', 
      duration: '10 hours (approx)', 
      description: 'Learn how to collect, consolidate, validate and organize data from multiple sources, and add critical data visualization tools and techniques.',
      format: 'Self-paced online', 
      isMicrocredential: true, 
      link: 'https://nahq.org/products/nahq-micro-credentials-health-data-analytics/'
    },
    { 
      title: 'HQ Principles: Data-Driven Decisions', 
      duration: '2 hours', 
      targetDate: 'Feb 15, 2026',
      description: 'Learn core principles of using data to drive quality improvement decisions',
      format: 'Self-paced online'
    },
    { 
      title: 'Introduction to Healthcare Analytics', 
      duration: '8 hours', 
      targetDate: 'Mar 1, 2026',
      description: 'Master fundamental analytics techniques for healthcare quality measurement',
      format: 'Interactive modules with exercises'
    },
    { 
      title: 'Statistical Process Control', 
      duration: '5 hours', 
      targetDate: 'Feb 28, 2026',
      description: 'Apply statistical methods to monitor and improve healthcare processes',
      format: 'Interactive course with practice exercises'
    },
    { 
      title: 'Data Visualization for Quality', 
      duration: '6 hours', 
      targetDate: 'Apr 15, 2026',
      description: 'Create compelling visualizations that communicate quality data effectively',
      format: 'Hands-on workshop'
    }
  ],
  'Performance Improvement': [
    { 
      title: 'Performance and Process Improvement Micro-Credential', 
      duration: '10 hours (approx)', 
      description: 'Gain the confidence to manage change, lead projects effectively, and foster a culture of continuous improvement for safer, more efficient, and patient-centered care.',
      format: 'Scenario-based online', 
      isMicrocredential: true, 
      link: 'https://nahq.org/products/nahq-micro-credentials-performance-process-improvement/'
    },
    { 
      title: 'Lean Six Sigma Fundamentals', 
      duration: '8 hours', 
      targetDate: 'May 1, 2026',
      description: 'Apply proven methodologies to eliminate waste and reduce variation',
      format: 'Certification course'
    },
    { 
      title: 'Project Management for Quality', 
      duration: '5 hours', 
      targetDate: 'Jun 1, 2026',
      description: 'Lead successful quality improvement projects from planning to execution',
      format: 'Interactive case studies'
    },
    { 
      title: 'Change Management Workshop', 
      duration: '4 hours', 
      targetDate: 'Jul 15, 2026',
      description: 'Navigate organizational resistance and drive adoption of quality initiatives',
      format: 'Live workshop'
    }
  ],
  'Population Health': [
    { 
      title: 'Population Health Management', 
      duration: '4 hours', 
      targetDate: 'Aug 1, 2026',
      description: 'Design and implement strategies to improve health outcomes for patient populations',
      format: 'Self-paced with assessments'
    },
    { 
      title: 'Care Transitions Best Practices', 
      duration: '3 hours', 
      targetDate: 'Sep 1, 2026',
      description: 'Reduce readmissions through effective care coordination and transitions',
      format: 'Case-based learning'
    }
  ],
  'Quality Leadership': [
    { 
      title: 'Advanced Strategic Leadership', 
      duration: '6 hours', 
      targetDate: 'Oct 1, 2026',
      description: 'Drive enterprise-wide quality transformation and build high-performing teams',
      format: 'Executive seminar'
    },
    { 
      title: 'Executive Quality Communication', 
      duration: '4 hours', 
      targetDate: 'Nov 1, 2026',
      description: 'Present quality data and recommendations to C-suite and board audiences',
      format: 'Interactive workshop'
    }
  ],
  'Patient Safety': [
    { 
      title: 'Advanced Root Cause Analysis', 
      duration: '4 hours', 
      targetDate: 'Dec 1, 2026',
      description: 'Conduct comprehensive investigations to identify system failures and prevent recurrence',
      format: 'Case studies with simulation'
    },
    { 
      title: 'High Reliability Organizations', 
      duration: '5 hours', 
      targetDate: 'Dec 15, 2026',
      description: 'Build cultures and systems that consistently deliver safe, reliable care',
      format: 'Self-paced online'
    }
  ],
  'Regulatory & Accreditation': [
    { 
      title: 'Regulatory and Accreditation Micro-Credential', 
      duration: '8 hours (approx)', 
      description: 'Learn how to guide your organization through the complex regulatory landscape to implement and monitor compliance, steer quality initiatives, and safeguard patient well-being.',
      format: 'Interactive online modules', 
      isMicrocredential: true, 
      link: 'https://nahq.org/products/nahq-micro-credentials-regulatory-and-accreditation/'
    },
    { 
      title: 'Regulatory Updates 2026', 
      duration: '2 hours',
      description: 'Stay current with latest CMS, Joint Commission, and state regulatory changes',
      format: 'Live webinar'
    },
    { 
      title: 'Survey Readiness Advanced', 
      duration: '3 hours',
      description: 'Prepare your organization for successful accreditation surveys',
      format: 'Mock survey simulation'
    }
  ],
  'Professional Engagement': [
    { 
      title: 'Ethics in Healthcare Quality', 
      duration: '2 hours',
      description: 'Navigate ethical dilemmas in quality measurement and improvement',
      format: 'Self-paced with scenarios'
    },
    { 
      title: 'Professional Development Planning', 
      duration: '3 hours',
      description: 'Design your long-term career advancement strategy in healthcare quality',
      format: 'Interactive workbook'
    }
  ],
  'Quality Review': [
    { 
      title: 'Value-Based Care Models', 
      duration: '4 hours',
      description: 'Understand and implement quality measures for value-based reimbursement',
      format: 'Case-based learning'
    },
    { 
      title: 'Quality Measure Management', 
      duration: '3 hours',
      description: 'Select, track, and optimize performance on quality measures',
      format: 'Self-paced online'
    }
  ]
};

export default function AssessmentOption2() {
  const [expandedDomains, setExpandedDomains] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [activeTab, setActiveTab] = useState({});
  const [selectedAssessment, setSelectedAssessment] = useState('jan2026');

  const toggleDomain = (domainName) => {
    setExpandedDomains(prev => 
      prev.includes(domainName) 
        ? prev.filter(name => name !== domainName)
        : [...prev, domainName]
    );
  };

  const handleCourseClick = (course, domain) => {
    setSelectedCourse(course);
    setSelectedDomain({
      ...domain,
      domain: domain.name,
      currentScore: domain.score,
      currentLevel: domain.level,
      targetScore: domain.benchmark,
      targetLevel: domain.score >= domain.benchmark ? 'Advanced' : 'Proficient',
      color: domain.color
    });
  };

  const getIconComponent = (domainName) => {
    return DOMAIN_ICONS[domainName] || BookOpen;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="Assessment Option 2" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#3D3D3D] mb-2">
                Your Professional Assessment Results & Upskill Plan
              </h1>
              <p className="text-sm text-gray-600">
                Completed {SAMPLE_RESULTS.completionDate} • {SAMPLE_RESULTS.position}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="text-gray-600">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="text-gray-600">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
              {ASSESSMENT_HISTORY.length > 1 && (
                <select 
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 font-medium hover:border-[#00A3E0] focus:border-[#00A3E0] focus:ring-2 focus:ring-[#00A3E0]/20 outline-none cursor-pointer transition-all"
                  value={selectedAssessment}
                  onChange={(e) => setSelectedAssessment(e.target.value)}
                >
                  {ASSESSMENT_HISTORY.map((assessment) => (
                    <option key={assessment.id} value={assessment.id}>
                      {assessment.label === SAMPLE_RESULTS.completionDate ? `Current Assessment (${assessment.label})` : `Previous (${assessment.label})`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </motion.div>

        {/* Overall Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#00A3E0] to-[#0093c9] rounded-lg p-6 mb-8 shadow-lg shadow-[#00A3E0]/20"
        >
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-xs text-white/70 mb-2 uppercase tracking-wide">Overall Score</p>
              <p className="text-4xl font-bold text-white mb-1">{SAMPLE_RESULTS.overallScore}</p>
              <p className="text-sm text-white/80">out of 3.0</p>
            </div>
            <div className="text-center border-l border-r border-white/20">
              <p className="text-xs text-white/70 mb-2 uppercase tracking-wide">NAHQ Role Benchmark</p>
              <p className="text-4xl font-bold text-white mb-1">{SAMPLE_RESULTS.overallBenchmark}</p>
              <p className="text-sm text-white/80">{SAMPLE_RESULTS.position}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-white/70 mb-2 uppercase tracking-wide">Peer Ranking</p>
              <p className="text-4xl font-bold text-white mb-1">{SAMPLE_RESULTS.percentile}th</p>
              <p className="text-sm text-white/80">Percentile</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white mb-2">
                  AI Assessment Overview
                </p>
                <p className="text-sm text-white/95 leading-relaxed mb-3">
                  Your profile shows strong <strong>advanced-level competencies in Quality Leadership (2.1)</strong> and solid performance in Patient Safety and Regulatory domains. At the {SAMPLE_RESULTS.percentile}th percentile overall, you're positioned in the middle range for {SAMPLE_RESULTS.position} roles within the NAHQ framework.
                </p>
                <p className="text-sm text-white/95 leading-relaxed">
                  <strong>Priority Focus:</strong> Health Data Analytics (1.4 → 1.7) — Closing this foundational gap will complement your leadership strengths and position you for advancement to senior quality leadership roles.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Domain Results with Courses */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#3D3D3D] mb-4">Domain Results & Learning Pathways</h2>

          {[...SAMPLE_RESULTS.domains]
            .sort((a, b) => {
              const priorityOrder = { 'HIGH PRIORITY': 0, 'Medium Priority': 1, 'Ongoing': 2, 'Maintenance': 3 };
              const aPriority = priorityOrder[a.priority] !== undefined ? priorityOrder[a.priority] : 99;
              const bPriority = priorityOrder[b.priority] !== undefined ? priorityOrder[b.priority] : 99;
              return aPriority - bPriority;
            })
            .map((domain, index) => {
            const IconComponent = getIconComponent(domain.name);
            const courses = DOMAIN_COURSES[domain.name] || [];
            const domainData = DOMAIN_DATA[domain.name] || {};
            const hasGap = domain.score < domain.benchmark;
            const isExpanded = expandedDomains.includes(domain.name);

            return (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-white rounded-lg border-2 border-gray-200 hover:border-[#00A3E0]/50 transition-all overflow-hidden"
              >
                {/* Domain Header */}
                <button
                  onClick={() => toggleDomain(domain.name)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${domain.color}15` }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: domain.color }} />
                      </div>
                    </div>
                    
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-[#3D3D3D]">{domain.name}</h3>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="text-gray-400 hover:text-[#00A3E0] transition-colors">
                                  <Info className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs bg-[#3D3D3D] text-white p-3">
                                <p className="text-xs leading-relaxed">{domainData.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded font-semibold flex-shrink-0 ${
                          domain.priority === 'HIGH PRIORITY' ? 'bg-[#FFED00] text-[#3D3D3D]' :
                          domain.priority?.includes('Medium') ? 'bg-[#00A3E0]/10 text-[#00A3E0]' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {domain.priority}
                        </span>
                      </div>
                      
                      {/* Score Comparison */}
                      <div className="grid grid-cols-3 gap-6 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Your Score</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold" style={{ color: domain.color }}>
                              {domain.score.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-400">/ 3.0</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{domain.level}</p>
                        </div>
                        
                        <div className="border-l border-gray-200 pl-6">
                          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">NAHQ Role Benchmark</p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-bold text-[#3D3D3D]">
                              {domain.benchmark.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-400">/ 3.0</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">{SAMPLE_RESULTS.position}</p>
                        </div>

                        <div className="border-l border-gray-200 pl-6">
                          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Status</p>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-bold ${hasGap ? 'text-[#3D3D3D]' : 'text-green-600'}`}>
                              {hasGap ? `${(domain.benchmark - domain.score).toFixed(1)}` : '✓'}
                            </span>
                          </div>
                          <p className={`text-xs font-medium mt-0.5 ${hasGap ? 'text-gray-600' : 'text-green-600'}`}>
                            {hasGap ? 'Gap to close' : 'Meeting target'}
                          </p>
                        </div>
                      </div>
                      
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          {courses.length} course{courses.length !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {domain.percentile}th percentile
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t-2 border-gray-200"
                    >
                      <Tabs 
                        defaultValue="overview" 
                        value={activeTab[domain.name] || "overview"}
                        onValueChange={(value) => setActiveTab(prev => ({ ...prev, [domain.name]: value }))}
                        className="w-full"
                      >
                        <div className="bg-gray-50 px-6 pt-4 pb-0">
                          <TabsList className="w-full justify-start bg-transparent border-0 p-0 h-auto gap-2">
                            <TabsTrigger 
                              value="overview" 
                              className="rounded-t border-0 bg-transparent text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#00A3E0] data-[state=active]:border-b-2 data-[state=active]:border-[#00A3E0] font-semibold px-4 py-2 text-sm transition-all"
                            >
                              Overview
                            </TabsTrigger>
                            <TabsTrigger 
                              value="competencies" 
                              className="rounded-t border-0 bg-transparent text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#00A3E0] data-[state=active]:border-b-2 data-[state=active]:border-[#00A3E0] font-semibold px-4 py-2 text-sm transition-all"
                            >
                              Your Results
                            </TabsTrigger>
                            <TabsTrigger 
                              value="courses" 
                              className="rounded-t border-0 bg-transparent text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#00A3E0] data-[state=active]:border-b-2 data-[state=active]:border-[#00A3E0] font-semibold px-4 py-2 text-sm transition-all"
                            >
                              Recommended Courses
                            </TabsTrigger>
                          </TabsList>
                        </div>

                        <TabsContent value="overview" className="p-6 m-0">
                          {/* AI Analysis Summary */}
                          <AIAnalysisSummary 
                            results={SAMPLE_RESULTS} 
                            domainName={domain.name}
                            onViewCourses={() => setActiveTab(prev => ({ ...prev, [domain.name]: 'courses' }))}
                          />
                        </TabsContent>

                        <TabsContent value="competencies" className="p-6 m-0 space-y-6 bg-white">
                        {/* Score Section with Visual Bar */}
                        <div className="rounded-lg p-5 border-2 border-gray-200 bg-gray-50">
                          <h4 className="font-bold text-[#3D3D3D] mb-4">Score Summary</h4>
                          
                          {/* Score Display Grid */}
                          <div className="grid grid-cols-3 gap-6 mb-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Your Score</p>
                              <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold" style={{ color: domain.color }}>
                                  {domain.score.toFixed(1)}
                                </span>
                                <span className="text-gray-400 text-sm">/ 3.0</span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{domain.level}</p>
                            </div>
                            
                            <div className="text-center border-x border-gray-200">
                              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">NAHQ Role Benchmark</p>
                              <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-[#3D3D3D]">
                                  {domain.benchmark.toFixed(1)}
                                </span>
                                <span className="text-gray-400 text-sm">/ 3.0</span>
                              </div>
                              <p className={`text-xs font-medium mt-1 ${domain.score >= domain.benchmark ? 'text-green-600' : 'text-gray-600'}`}>
                                {domain.score >= domain.benchmark ? 'Meeting target' : 'Gap to close'}
                              </p>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Percentile</p>
                              <div className="text-3xl font-bold" style={{ color: domain.color }}>
                                {domain.percentile}th
                              </div>
                              <p className="text-xs text-gray-600 mt-1">Among peers</p>
                            </div>
                          </div>
                          
                          {/* Visual Score Bar */}
                          <div className="space-y-2 mb-4">
                            <div className="relative h-10 bg-white rounded border border-gray-200">
                              {/* Scale markers */}
                              <div className="absolute inset-0 flex">
                                <div className="flex-1 border-r border-gray-200"></div>
                                <div className="flex-1 border-r border-gray-200"></div>
                                <div className="flex-1"></div>
                              </div>
                              
                              {/* NAHQ Role Benchmark marker */}
                              <div 
                                className="absolute top-0 bottom-0 w-0.5 bg-[#FFED00] z-10"
                                style={{ left: `${(domain.benchmark / 3) * 100}%` }}
                              >
                                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#FFED00] text-[#3D3D3D] text-xs rounded whitespace-nowrap font-bold">
                                  {domain.benchmark.toFixed(1)}
                                </div>
                              </div>
                              
                              {/* Participant Average marker */}
                              {(() => {
                                const avgScore = domainData.competencies 
                                  ? domainData.competencies.reduce((sum, c) => sum + c.average, 0) / domainData.competencies.length 
                                  : 0;
                                return avgScore > 0 && (
                                  <div 
                                    className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                                    style={{ left: `${(avgScore / 3) * 100}%` }}
                                  >
                                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-400 text-white text-xs rounded whitespace-nowrap font-bold">
                                      {avgScore.toFixed(1)}
                                    </div>
                                  </div>
                                );
                              })()}
                              
                              {/* Your score bar */}
                              <div 
                                className="absolute top-0 bottom-0 left-0 rounded transition-all bg-[#00A3E0]/20"
                                style={{ 
                                  width: `${(domain.score / 3) * 100}%`
                                }}
                              />
                              
                              {/* Your score marker */}
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group"
                                style={{ left: `${(domain.score / 3) * 100}%` }}
                              >
                                <div className="w-6 h-6 rounded-full bg-[#00A3E0] border-2 border-white shadow-md flex items-center justify-center cursor-pointer">
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                </div>
                                {/* Tooltip on hover */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-[#3D3D3D] text-white text-xs rounded whitespace-nowrap font-semibold pointer-events-none">
                                  Your Score: {domain.score.toFixed(1)}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 pt-6">
                              <span>1.0<br/>Foundational</span>
                              <span>2.0<br/>Proficient</span>
                              <span>3.0<br/>Advanced</span>
                            </div>
                            
                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-[#00A3E0] border-2 border-white shadow-sm"></div>
                                <span className="text-xs text-gray-600">Your Score</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-[#FFED00]"></div>
                                <span className="text-xs text-gray-600">NAHQ Role Benchmark</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-gray-400"></div>
                                <span className="text-xs text-gray-600">NAHQ Participant Avg</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Competencies Breakdown */}
                        {domainData.competencies && (
                          <div>
                            <h4 className="font-bold text-[#3D3D3D] mb-4">Competency Breakdown</h4>
                            
                            {(() => {
                              const strengths = domainData.competencies?.filter(c => c.score >= c.benchmark) || [];
                              const meetsTarget = domainData.competencies?.filter(c => c.score >= c.benchmark - 0.2 && c.score < c.benchmark) || [];
                              const growthOpportunities = domainData.competencies?.filter(c => c.score < c.benchmark - 0.2) || [];
                              
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
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <h5 className="font-bold text-[#3D3D3D] text-sm">Strengths ({strengths.length})</h5>
                                      </div>
                                      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
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
                                        <CheckCircle className="w-4 h-4 text-[#00A3E0]" />
                                        <h5 className="font-bold text-[#3D3D3D] text-sm">Meets Target ({meetsTarget.length})</h5>
                                      </div>
                                      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
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
                                        <TrendingUp className="w-4 h-4 text-[#3D3D3D]" />
                                        <h5 className="font-bold text-[#3D3D3D] text-sm">Growth Opportunities ({growthOpportunities.length})</h5>
                                      </div>
                                      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
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
                        )}
                        </TabsContent>

                        <TabsContent value="courses" className="p-6 m-0 bg-white">
                        {/* Your AI Recommended Upskill Plan */}
                        <div>
                          <h4 className="font-bold text-[#3D3D3D] mb-4">Learning Pathway</h4>
                          
                          {courses.length > 0 ? (
                            <div className="space-y-6">
                              {(() => {
                                const regularCourses = courses.filter(c => !c.isMicrocredential);
                                const microCredentials = courses.filter(c => c.isMicrocredential);
                                
                                return (
                                  <>
                                    {regularCourses.length > 0 && (
                                      <div className="space-y-3">
                                        {regularCourses.map((course, courseIndex) => (
                                          <div
                                            key={courseIndex}
                                            className="w-full bg-white rounded-lg border-2 border-gray-200 hover:border-[#00A3E0] transition-all duration-200 p-5 text-left"
                                          >
                                            <button
                                              onClick={() => handleCourseClick(course, domain)}
                                              className="w-full flex items-start justify-between gap-4"
                                            >
                                              <div className="flex-1 min-w-0 text-left">
                                                <h4 className="font-bold text-[#3D3D3D] mb-2">
                                                  {course.title}
                                                </h4>
                                                <p className="text-sm leading-relaxed text-gray-600 mb-3">
                                                  {course.description}
                                                </p>
                                                {course.targetDate && (
                                                  <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1.5">
                                                      <Calendar className="w-3.5 h-3.5" />
                                                      Complete by {course.targetDate}
                                                    </span>
                                                  </div>
                                                )}
                                              </div>
                                              <Button 
                                                size="sm"
                                                className="bg-[#00A3E0] hover:bg-[#0093c9] text-white flex-shrink-0"
                                              >
                                                View Details
                                                <ArrowRight className="w-4 h-4 ml-1.5" />
                                              </Button>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {microCredentials.length > 0 && (
                                      <div>
                                        <h5 className="font-bold text-[#3D3D3D] mb-3 flex items-center gap-2">
                                          <Trophy className="w-4 h-4 text-[#FFED00]" />
                                          Other Recommended Opportunities
                                        </h5>
                                        <div className="space-y-3">
                                          {microCredentials.map((course, courseIndex) => (
                                            <div
                                              key={courseIndex}
                                              className="w-full bg-white rounded-lg border-2 border-[#FFED00] shadow-md shadow-[#FFED00]/30 transition-all duration-200 p-5 text-left"
                                            >
                                              <div className="flex items-center gap-2 mb-3 text-sm text-[#3D3D3D] font-bold bg-[#FFED00]/20 rounded-full px-3 py-1 w-fit">
                                                <Trophy className="w-4 h-4" /> NAHQ Micro-Credential
                                              </div>
                                              <button
                                                onClick={() => window.open(course.link, '_blank')}
                                                className="w-full flex items-start justify-between gap-4"
                                              >
                                                <div className="flex-1 min-w-0 text-left">
                                                  <h4 className="font-bold text-[#3D3D3D] mb-2">
                                                    {course.title}
                                                  </h4>
                                                  <p className="text-sm leading-relaxed text-gray-600 mb-3">
                                                    {course.description}
                                                  </p>
                                                </div>
                                                <Button 
                                                  size="sm"
                                                  className="bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] flex-shrink-0 font-semibold"
                                                >
                                                  Learn More
                                                  <ArrowRight className="w-4 h-4 ml-1.5" />
                                                </Button>
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">
                              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No courses recommended for this domain at this time</p>
                            </div>
                          )}
                        </div>
                        </TabsContent>
                      </Tabs>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
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

      {/* Course Preview Modal */}
      {selectedCourse && (
        <CoursePreviewModal 
          course={selectedCourse}
          domain={selectedDomain}
          onClose={() => {
            setSelectedCourse(null);
            setSelectedDomain(null);
          }}
        />
      )}
    </div>
  );
}