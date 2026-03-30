import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, BookOpen, Target, TrendingUp, CheckCircle, Calendar, Play, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ReactMarkdown from 'react-markdown';

const COURSE_DETAILS = {
  'HQ Principles: Data-Driven Decisions': {
    overview: 'Learn the foundational principles of using data to drive quality improvement decisions in healthcare organizations.',
    modules: [
      'Understanding Healthcare Data Sources',
      'Basic Statistical Concepts for Quality',
      'Creating Meaningful Quality Metrics',
      'Presenting Data to Stakeholders'
    ],
    learningOutcomes: [
      'Identify key data sources for quality metrics',
      'Calculate and interpret basic quality measures',
      'Create visual representations of quality data',
      'Make evidence-based recommendations'
    ],
    prerequisites: 'None - suitable for all quality professionals',
    format: 'Self-paced online course with interactive exercises',
    aiInsight: {
      whyNow: "Based on your assessment results, this course addresses your Analytics gap (currently 1.4 - Foundational) while leveraging your strong Leadership foundation (2.1 - Advanced). You're ready to start building data literacy to complement your strategic skills.",
      buildingOn: "This is your first course in the Analytics pathway. Your strong communication and leadership skills position you perfectly to learn how to incorporate data into your decision-making.",
      strategic: [
        "Closes Your Biggest Gap: You excel at strategy but need to strengthen data literacy",
        "Builds on Your Strengths: You'll learn to present data insights to leadership—something you already excel at",
        "Immediate ROI: The skills translate directly to your current role as Quality Director",
        "Quick Win: At just 2 hours, you'll gain confidence fast and see immediate results"
      ],
      afterCourse: "Transform from \"I need to ask my analyst\" to \"Let me show you what the data says.\" You'll be able to identify key data sources, calculate basic quality measures, create visual representations of quality data, and make evidence-based recommendations with confidence."
    }
  },
  'Introduction to Healthcare Analytics': {
    overview: 'Comprehensive introduction to healthcare analytics, covering data collection, analysis methods, and practical applications in quality improvement.',
    modules: [
      'Healthcare Data Ecosystem',
      'Data Quality and Governance',
      'Statistical Analysis Fundamentals',
      'Analytics Tools and Platforms',
      'Case Studies and Applications',
      'Building Your First Analytics Project'
    ],
    learningOutcomes: [
      'Design comprehensive data collection plans',
      'Apply statistical methods to healthcare data',
      'Use analytics software for quality improvement',
      'Present findings to diverse audiences'
    ],
    prerequisites: 'HQ Principles: Data-Driven Decisions or equivalent knowledge',
    format: '8-hour online course with hands-on projects',
    aiInsight: {
      whyNow: "This is the pivotal course that moves you from Foundational (1.4) to Proficient (1.7) in Analytics. With your strong leadership foundation (2.1) and completion of HQ Principles, you're perfectly positioned to take this next step in your development journey.",
      buildingOn: "Building directly on HQ Principles: Data-Driven Decisions, you'll now apply those foundational concepts to real healthcare datasets. You've learned the \"what\" and \"why\" of data—now you'll master the \"how\" with hands-on practice.",
      strategic: [
        "Career Accelerator: Analytics + Leadership = VP/Chief Quality Officer profile",
        "Hands-On Learning: Work with real healthcare datasets from organizations like yours",
        "Fills Critical Gap: Stop relying on others for data insights and analysis",
        "Strategic Timing: Completes Phase 1 of your Analytics pathway (Months 1-3)"
      ],
      afterCourse: "Independently extract data from healthcare systems, design comprehensive data collection plans, apply statistical methods to quality data, use analytics software confidently, and present findings to diverse audiences. You'll move from consumer of analytics to creator of insights."
    }
  },
  'Data Visualization for Quality': {
    overview: 'Master the art and science of creating compelling visualizations that drive quality improvement decisions and engage stakeholders.',
    modules: [
      'Principles of Effective Data Visualization',
      'Choosing the Right Chart Type',
      'Dashboard Design for Quality Metrics',
      'Interactive Visualizations',
      'Storytelling with Data'
    ],
    learningOutcomes: [
      'Create professional quality dashboards',
      'Select appropriate visualization methods',
      'Design for different audiences',
      'Tell compelling stories with data'
    ],
    prerequisites: 'Introduction to Healthcare Analytics',
    format: '6-hour online course with design projects',
    aiInsight: {
      whyNow: "Your Communication strength (Quality Leadership 2.1 - Advanced) combined with newly acquired Analytics skills creates the perfect foundation for mastering data visualization. This course amplifies your impact by adding stunning visuals to your already strong communication abilities.",
      buildingOn: "Building on Introduction to Healthcare Analytics, you'll take the data extraction and analysis skills you've learned and transform them into compelling visual stories. You've learned to find insights—now you'll learn to make them unforgettable.",
      strategic: [
        "Leverages Your Strength: You're already great at communication—now add stunning visuals",
        "Executive Presence: Present to C-suite with confidence and clarity",
        "Competitive Advantage: Most quality professionals can analyze OR present—you'll do both",
        "Fast Results: Your stakeholders will immediately notice the difference in your presentations"
      ],
      afterCourse: "Create professional quality dashboards that drive action, select the perfect visualization for any data type, design compelling presentations for different audiences (clinical, executive, board), tell stories with data that inspire change, and build interactive dashboards that engage stakeholders. You'll become the go-to person for quality data insights in your organization."
    }
  }
};

export default function CoursePreviewModal({ course, domain, onClose }) {
  if (!course) return null;
  
  const details = COURSE_DETAILS[course.title] || {
    overview: 'Comprehensive course designed to enhance your professional competencies.',
    modules: ['Module 1', 'Module 2', 'Module 3'],
    learningOutcomes: ['Enhanced skills', 'Practical application', 'Professional growth'],
    prerequisites: 'Basic understanding of quality principles',
    format: 'Self-paced online learning',
    aiInsight: {
      whyNow: 'This course aligns with your current development needs and builds on your existing competencies.',
      buildingOn: 'This course integrates with your learning pathway and previous coursework.',
      strategic: [
        'Addresses identified skill gaps',
        'Builds on your professional strengths',
        'Aligns with your career goals'
      ],
      afterCourse: 'You will gain enhanced skills and be able to apply new concepts in your professional role.'
    }
  };

  const isLocked = course.status === 'locked';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-[#00A3E0]/10 text-[#00A3E0] text-xs font-semibold rounded-full">
                  {domain?.domain || 'Course'}
                </span>
                {isLocked && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Prerequisite Required
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-[#3D3D3D]">{course.title}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Your Assessment Score & Course Rationale */}
            <div 
              className="rounded-xl p-5 border-2"
              style={{ 
                backgroundColor: `${domain?.color || '#00A3E0'}05`,
                borderColor: `${domain?.color || '#00A3E0'}30`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-[#3D3D3D]">Your {domain?.domain || 'Domain'} Performance</h4>
                <p className="text-xs text-gray-500">January 27, 2026</p>
              </div>
              
              {/* Score Display */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">Your Score</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-bold" style={{ color: domain?.color || '#00A3E0' }}>
                      {domain?.currentScore?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-gray-400 text-sm">/ 3.0</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{domain?.currentLevel || 'Level'}</p>
                </div>
                
                <div className="text-center border-x border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">NAHQ Role Benchmark</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {domain?.targetScore?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-gray-400 text-sm">/ 3.0</span>
                  </div>
                  <p className={`text-xs font-medium mt-1 ${(domain?.currentScore || 0) >= (domain?.targetScore || 0) ? 'text-green-600' : 'text-orange-600'}`}>
                    {(domain?.currentScore || 0) >= (domain?.targetScore || 0) ? 'Exceeds' : 'Below'} Benchmark
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">Development Target</p>
                  <div className="text-2xl font-bold" style={{ color: domain?.color || '#00A3E0' }}>
                    {domain?.targetScore?.toFixed(1) || '0.0'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{domain?.targetLevel || 'Level'}</p>
                </div>
              </div>

              {/* Course Rationale */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">
                  <strong>Why this course is recommended:</strong>
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  This course targets specific competencies within {domain?.domain || 'this domain'} where your assessment identified opportunities for growth. By completing this training, you'll strengthen multiple related skills that contribute to closing your gap to the NAHQ benchmark.
                </p>
              </div>
            </div>

            {/* Course Description */}
            <div className="space-y-5">
              {/* Overview */}
              <div>
                <h3 className="font-semibold text-[#3D3D3D] mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#00A3E0]" />
                  Course Overview
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {details.overview}
                </p>
              </div>

              {/* Course Modules */}
              <div>
                <h3 className="font-semibold text-[#3D3D3D] mb-3">Course Modules</h3>
                <ul className="space-y-2">
                  {details.modules.map((module, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00A3E0]/10 text-[#00A3E0] flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed pt-0.5">{module}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h3 className="font-semibold text-[#3D3D3D] mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#00A3E0]" />
                  Learning Outcomes
                </h3>
                <ul className="space-y-2">
                  {details.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Prerequisites</p>
                  <p className="text-sm text-gray-700">{details.prerequisites}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Format</p>
                  <p className="text-sm text-gray-700">{details.format}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            {isLocked ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Complete previous courses to unlock this one
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  This course is available through NAHQ's learning platform
                </p>
                <a href="https://nahq.org" target="_blank" rel="noopener noreferrer" className="block">
                  <Button 
                    className="w-full bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold py-6"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Visit NAHQ to Enroll
                  </Button>
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}