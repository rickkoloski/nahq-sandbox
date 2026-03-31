import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Map, Target, Clock, Timer, ChevronDown, ChevronRight, BookOpen, Video, 
  Briefcase, Lock, Eye, ArrowRight, Sparkles, MessageCircle, Settings, 
  GitBranch, Download, Mail, Calendar, CheckCircle, Play, Users, Network,
  Globe, BarChart3, Shield, ClipboardCheck, CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/shared/Header';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChat from '@/components/results/AIChat';
import CoursePreviewModal from '@/components/roadmap/CoursePreviewModal';
import LearningLabsModal from '@/components/roadmap/LearningLabsModal';
import { Badge } from '@/components/ui/badge';

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

const LEARNING_LABS = [
  { 
    title: 'Healthcare Analytics Workshop', 
    date: 'Feb 20, 2026', 
    time: '2:00 PM EST',
    type: 'Live',
    domain: 'Health Data Analytics',
    description: 'Interactive workshop on real-world analytics applications',
    color: '#F68B1F'
  },
  { 
    title: 'Quality Leadership Strategies', 
    date: 'Mar 5, 2026', 
    time: '1:00 PM EST',
    type: 'On-Demand',
    domain: 'Quality Leadership',
    description: 'Strategies for leading quality initiatives in complex organizations',
    color: '#003DA5'
  },
  { 
    title: 'Patient Safety Best Practices', 
    date: 'Mar 12, 2026', 
    time: '3:00 PM EST',
    type: 'Live',
    domain: 'Patient Safety',
    description: 'Annual conference featuring leading patient safety experts',
    color: '#009CA6'
  },
  { 
    title: 'Performance Improvement Methods', 
    date: 'Mar 18, 2026', 
    time: '11:00 AM EST',
    type: 'On-Demand',
    domain: 'Performance Improvement',
    description: 'Practical approaches to process improvement and change management',
    color: '#00B5E2'
  },
  { 
    title: 'Population Health Strategies', 
    date: 'Apr 2, 2026', 
    time: '2:00 PM EST',
    type: 'Live',
    domain: 'Population Health',
    description: 'Managing care transitions and improving population outcomes',
    color: '#8BC53F'
  },
  { 
    title: 'Regulatory Compliance Update', 
    date: 'Apr 15, 2026', 
    time: '1:00 PM EST',
    type: 'Live',
    domain: 'Regulatory & Accreditation',
    description: 'Latest changes in healthcare regulations and accreditation standards',
    color: '#ED1C24'
  }
];

const ALL_DOMAINS_ROADMAP = [
  {
    id: 1,
    sequence: 1,
    domain: 'Health Data Analytics',
    priority: 'HIGH PRIORITY',
    color: '#F68B1F',
    icon: 'BarChart3',
    currentScore: 1.4,
    currentLevel: 'Foundational',
    targetScore: 1.7,
    targetLevel: 'Proficient',
    months: 'Months 1-4',
    courses: [
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
    ]
  },
  {
    id: 2,
    sequence: 2,
    domain: 'Performance Improvement',
    priority: 'Medium Priority',
    color: '#00B5E2',
    icon: 'Settings',
    currentScore: 1.7,
    currentLevel: 'Proficient',
    targetScore: 2.0,
    targetLevel: 'Proficient',
    months: 'Months 5-7',
    courses: [
      { 
        title: 'Lean Six Sigma Fundamentals', 
        duration: '8 hours', 
        status: 'locked', 
        targetDate: 'May 1, 2026',
        description: 'Apply proven methodologies to eliminate waste and reduce variation',
        format: 'Certification course'
      },
      { 
        title: 'Project Management for Quality', 
        duration: '5 hours', 
        status: 'locked', 
        targetDate: 'Jun 1, 2026',
        description: 'Lead successful quality improvement projects from planning to execution',
        format: 'Interactive case studies'
      },
      { 
        title: 'Change Management Workshop', 
        duration: '4 hours', 
        status: 'locked', 
        targetDate: 'Jul 15, 2026',
        description: 'Navigate organizational resistance and drive adoption of quality initiatives',
        format: 'Live workshop'
      }
    ]
  },
  {
    id: 3,
    sequence: 3,
    domain: 'Population Health',
    priority: 'Medium Priority',
    color: '#8BC53F',
    icon: 'Globe',
    currentScore: 1.5,
    currentLevel: 'Foundational',
    targetScore: 1.8,
    targetLevel: 'Proficient',
    months: 'Months 8-9',
    courses: [
      { 
        title: 'Population Health Management', 
        duration: '4 hours', 
        status: 'locked', 
        targetDate: 'Aug 1, 2026',
        description: 'Design and implement strategies to improve health outcomes for patient populations',
        format: 'Self-paced with assessments'
      },
      { 
        title: 'Care Transitions Best Practices', 
        duration: '3 hours', 
        status: 'locked', 
        targetDate: 'Sep 1, 2026',
        description: 'Reduce readmissions through effective care coordination and transitions',
        format: 'Case-based learning'
      }
    ]
  },
  {
    id: 4,
    sequence: 4,
    domain: 'Quality Leadership',
    priority: 'Maintenance',
    color: '#003DA5',
    icon: 'Network',
    currentScore: 2.1,
    currentLevel: 'Advanced',
    targetScore: 2.3,
    targetLevel: 'Advanced',
    months: 'Months 10-11',
    courses: [
      { 
        title: 'Advanced Strategic Leadership', 
        duration: '6 hours', 
        status: 'locked', 
        targetDate: 'Oct 1, 2026',
        description: 'Drive enterprise-wide quality transformation and build high-performing teams',
        format: 'Executive seminar'
      },
      { 
        title: 'Executive Quality Communication', 
        duration: '4 hours', 
        status: 'locked', 
        targetDate: 'Nov 1, 2026',
        description: 'Present quality data and recommendations to C-suite and board audiences',
        format: 'Interactive workshop'
      }
    ]
  },
  {
    id: 5,
    sequence: 5,
    domain: 'Patient Safety',
    priority: 'Maintenance',
    color: '#009CA6',
    icon: 'Shield',
    currentScore: 1.9,
    currentLevel: 'Proficient',
    targetScore: 2.1,
    targetLevel: 'Advanced',
    months: 'Month 12',
    courses: [
      { 
        title: 'Advanced Root Cause Analysis', 
        duration: '4 hours', 
        status: 'locked', 
        targetDate: 'Dec 1, 2026',
        description: 'Conduct comprehensive investigations to identify system failures and prevent recurrence',
        format: 'Case studies with simulation'
      },
      { 
        title: 'High Reliability Organizations', 
        duration: '5 hours', 
        status: 'locked', 
        targetDate: 'Dec 15, 2026',
        description: 'Build cultures and systems that consistently deliver safe, reliable care',
        format: 'Self-paced online'
      }
    ]
  },
  {
    id: 6,
    sequence: 6,
    domain: 'Regulatory & Accreditation',
    priority: 'Maintenance',
    color: '#ED1C24',
    icon: 'CheckSquare',
    currentScore: 1.8,
    currentLevel: 'Proficient',
    targetScore: 2.0,
    targetLevel: 'Proficient',
    months: 'As Needed',
    courses: [
      { 
        title: 'Regulatory Updates 2026', 
        duration: '2 hours', 
        status: 'locked',
        description: 'Stay current with latest CMS, Joint Commission, and state regulatory changes',
        format: 'Live webinar'
      },
      { 
        title: 'Survey Readiness Advanced', 
        duration: '3 hours', 
        status: 'locked',
        description: 'Prepare your organization for successful accreditation surveys',
        format: 'Mock survey simulation'
      }
    ]
  },
  {
    id: 7,
    sequence: 7,
    domain: 'Professional Engagement',
    priority: 'Ongoing',
    color: '#6B4C9A',
    icon: 'Users',
    currentScore: 1.9,
    currentLevel: 'Proficient',
    targetScore: 2.1,
    targetLevel: 'Advanced',
    months: 'Throughout Year',
    courses: [
      { 
        title: 'Ethics in Healthcare Quality', 
        duration: '2 hours', 
        status: 'locked',
        description: 'Navigate ethical dilemmas in quality measurement and improvement',
        format: 'Self-paced with scenarios'
      },
      { 
        title: 'Professional Development Planning', 
        duration: '3 hours', 
        status: 'locked',
        description: 'Design your long-term career advancement strategy in healthcare quality',
        format: 'Interactive workbook'
      }
    ]
  },
  {
    id: 8,
    sequence: 8,
    domain: 'Quality Review',
    priority: 'Ongoing',
    color: '#99154B',
    icon: 'ClipboardCheck',
    currentScore: 1.6,
    currentLevel: 'Foundational',
    targetScore: 1.8,
    targetLevel: 'Proficient',
    months: 'Throughout Year',
    courses: [
      { 
        title: 'Value-Based Care Models', 
        duration: '4 hours', 
        status: 'locked',
        description: 'Understand and implement quality measures for value-based reimbursement',
        format: 'Case-based learning'
      },
      { 
        title: 'Quality Measure Management', 
        duration: '3 hours', 
        status: 'locked',
        description: 'Select, track, and optimize performance on quality measures',
        format: 'Self-paced online'
      }
    ]
  }
];

function CourseItem({ course, domain, onPreview }) {
  return (
    <div 
      className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#00A3E0]/40 hover:shadow-md transition-all duration-300 p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#3D3D3D] mb-2">
            {course.title}
          </h4>
          
          {course.description && (
            <p className="text-sm leading-relaxed text-gray-600 mb-3">
              {course.description}
            </p>
          )}
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {course.targetDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Complete by {course.targetDate}
              </span>
            )}
            {course.format && (
              <>
                <span>•</span>
                <span>{course.format}</span>
              </>
            )}
          </div>
        </div>

        <Button 
          size="sm"
          variant="ghost"
          className="text-[#00A3E0] hover:text-[#0093c9] hover:bg-[#00A3E0]/5 flex-shrink-0"
          onClick={() => onPreview(course, domain)}
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const [expandedDomains, setExpandedDomains] = useState([1]);
  const [showChat, setShowChat] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showAllLabs, setShowAllLabs] = useState(false);

  const toggleDomain = (domainId) => {
    setExpandedDomains(prev => 
      prev.includes(domainId) 
        ? prev.filter(id => id !== domainId)
        : [...prev, domainId]
    );
  };

  const getIconComponent = (iconName) => {
    const icons = { Users, Network, Settings, Globe, BarChart3, Shield, CheckSquare, ClipboardCheck };
    return icons[iconName] || BookOpen;
  };

  const handleCoursePreview = (course, domain) => {
    setSelectedCourse(course);
    setSelectedDomain(domain);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="Roadmap" />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#00A3E0]/10 flex items-center justify-center">
              <Map className="w-6 h-6 text-[#00A3E0]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#3D3D3D]">
              Your Personalized Development Roadmap
            </h1>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-gray-600">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </motion.div>

        {/* Goal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#00A3E0] to-[#0093c9] rounded-2xl p-6 text-white mb-8 shadow-xl shadow-[#00A3E0]/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-3">
                Your Personalized Upskill Plan
              </h2>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                Based on your professional assessment, this learning pathway is designed to close your competency gaps and elevate your expertise across all 8 quality domains. The courses below are sequenced to build on your strengths while addressing your development opportunities.
              </p>
              
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm font-semibold mb-2 text-white">
                  AI-Recommended Priority Focus
                </p>
                <p className="text-white/95 text-sm leading-relaxed">
                  <strong>Health Data Analytics</strong> (Current: 1.4 Foundational → Target: 1.7 Proficient) — Strengthen your data literacy to complement your advanced leadership capabilities and amplify your strategic impact.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Learning Pathway - Full Width */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[#00A3E0]" />
            <h2 className="text-lg font-bold text-[#3D3D3D]">Your Learning Pathway</h2>
          </div>

            {ALL_DOMAINS_ROADMAP.map((domain, domainIndex) => {
              const IconComponent = getIconComponent(domain.icon);
              
              return (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + domainIndex * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  {/* Domain Header */}
                  <button
                    onClick={() => toggleDomain(domain.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-shrink-0">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${domain.color}15` }}
                        >
                          <IconComponent className="w-6 h-6" style={{ color: domain.color }} />
                        </div>
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h3 className="font-semibold text-base text-[#3D3D3D]">{domain.domain}</h3>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                            domain.priority === 'HIGH PRIORITY' ? 'bg-orange-100 text-orange-700' :
                            domain.priority.includes('Medium') ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {domain.priority}
                          </span>
                        </div>
                        
                        {/* Progress Goal */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">Current Assessment:</span>
                              <span className="font-semibold text-gray-900">{domain.currentScore.toFixed(1)} ({domain.currentLevel})</span>
                              <ArrowRight className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">Development Target:</span>
                              <span className="font-semibold text-gray-900">{domain.targetScore.toFixed(1)} ({domain.targetLevel})</span>
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
                              {domain.courses.length} courses recommended
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {expandedDomains.includes(domain.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Domain Content */}
                  <AnimatePresence>
                    {expandedDomains.includes(domain.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-5 space-y-3">
                          {domain.courses.map((course, courseIndex) => (
                            <CourseItem 
                              key={courseIndex} 
                              course={course} 
                              domain={domain}
                              onPreview={handleCoursePreview}
                            />
                          ))}
                        </div>
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

      {/* Learning Labs Modal */}
      <AnimatePresence>
        {showAllLabs && (
          <LearningLabsModal 
            labs={LEARNING_LABS}
            onClose={() => setShowAllLabs(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}