import React from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, ArrowRight, Users, Network, Settings, Globe, BarChart3, Shield, CheckSquare, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

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
    fullDescription: 'Engage in the healthcare quality profession with a commitment to practicing ethically, enhancing one\'s competence, and advancing the field.',
    description: 'Engage in the healthcare quality profession with a commitment to practicing ethically, enhancing one\'s competence and advancing the field.',
    keyFocus: ['Integrate ethical standards into practices', 'Engage in lifelong learning', 'Participate in advancing the profession'],
    competencies: [
      'Integrate ethical standards into healthcare quality practice',
      'Engage in lifelong learning as a healthcare quality professional',
      'Participate in activities that advance the healthcare quality profession'
    ],
    courses: [
      { title: 'Ethics in Healthcare Quality', duration: '2 hours' },
      { title: 'Professional Development Planning', duration: '3 hours' },
      { title: 'Healthcare Quality Leadership', duration: '4 hours' }
    ]
  },
  'Quality Leadership and Integration': {
    fullDescription: 'Advance the organization\'s commitment to healthcare quality through collaboration, learning opportunities and communication. Lead the integration of quality into the fabric of the organization through a coordinated infrastructure to achieve organizational objectives.',
    description: 'Advance the organization\'s commitment to healthcare quality through collaboration, learning opportunities and communication.',
    keyFocus: ['Direct quality infrastructure', 'Promote stakeholder engagement', 'Create learning opportunities', 'Communicate effectively'],
    competencies: [
      'Direct the quality infrastructure to achieve organizational objectives',
      'Apply procedures to regulate the use of privileged or confidential information',
      'Implement processes to promote stakeholder engagement and interprofessional teamwork',
      'Create learning opportunities to advance healthcare quality throughout the organization',
      'Communicate effectively with different audiences to achieve quality goals'
    ],
    courses: [
      { title: 'Strategic Quality Leadership', duration: '6 hours' },
      { title: 'Building Quality Infrastructure', duration: '4 hours' },
      { title: 'Stakeholder Engagement Strategies', duration: '3 hours' }
    ]
  },
  'Performance and Process Improvement': {
    fullDescription: 'Use performance and process improvement (PPI), project management and change management methods to support operational and clinical quality initiatives, improve performance and achieve organizational goals.',
    description: 'Use performance and process improvement, project management and change management methods to support quality initiatives.',
    keyFocus: ['Implement PPI methods', 'Apply project management', 'Use change management principles'],
    competencies: [
      'Implement standard performance and process improvement (PPI) methods',
      'Apply project management methods',
      'Use change management principles and tools'
    ],
    courses: [
      { title: 'Lean Six Sigma for Healthcare', duration: '8 hours' },
      { title: 'Project Management Essentials', duration: '5 hours' },
      { title: 'Change Management in Healthcare', duration: '4 hours' }
    ]
  },
  'Population Health and Care Transitions': {
    fullDescription: 'Evaluate and improve healthcare processes and care transitions to advance the efficient, effective and safe care of defined populations.',
    description: 'Evaluate and improve healthcare processes and care transitions for defined populations.',
    keyFocus: ['Integrate PH management strategies', 'Apply holistic approach', 'Improve care processes and transitions'],
    competencies: [
      'Integrate population health management strategies into quality work',
      'Apply a holistic approach to improvement',
      'Collaborate with stakeholders to improve care processes and transitions'
    ],
    courses: [
      { title: 'Population Health Fundamentals', duration: '4 hours' },
      { title: 'Care Transition Best Practices', duration: '3 hours' },
      { title: 'Social Determinants of Health', duration: '3 hours' }
    ]
  },
  'Health Data Analytics': {
    fullDescription: 'Leverage the organization\'s analytic environment to help guide data-driven decision-making and inform quality improvement initiatives.',
    description: 'Leverage the organization\'s analytic environment to guide data-driven decision-making and quality improvement.',
    keyFocus: ['Govern data assets', 'Design collection plans', 'Use statistical methods', 'Integrate data systems'],
    competencies: [
      'Apply procedures for the governance of data assets',
      'Design data collection plans for key metrics and performance indicators',
      'Acquire data from source systems',
      'Integrate data from internal and external electronic data systems',
      'Use statistical and visualization methods'
    ],
    courses: [
      { title: 'Healthcare Analytics Fundamentals', duration: '6 hours' },
      { title: 'Data Visualization for Quality', duration: '4 hours' },
      { title: 'Statistical Process Control', duration: '5 hours' }
    ]
  },
  'Patient Safety': {
    fullDescription: 'Cultivate a safe healthcare environment by promoting safe practices, nurturing a just culture, and improving processes that detect, mitigate or prevent harm.',
    description: 'Cultivate a safe healthcare environment by promoting safe practices and improving processes that prevent harm.',
    keyFocus: ['Assess safety culture', 'Apply safety science', 'Identify and report risks', 'Collaborate on analysis'],
    competencies: [
      'Assess the organization\'s patient safety culture',
      'Apply safety science principles and methods in healthcare quality work',
      'Use organizational procedures to identify and report patient safety risks and events',
      'Collaborate with stakeholders to analyze patient safety risks and events'
    ],
    courses: [
      { title: 'Patient Safety Culture Assessment', duration: '3 hours' },
      { title: 'Root Cause Analysis', duration: '4 hours' },
      { title: 'High Reliability Organizations', duration: '5 hours' }
    ]
  },
  'Regulatory and Accreditation': {
    fullDescription: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with internal and external requirements. Lead the organization\'s processes to prepare for, participate in, and follow up on regulatory, accreditation and certification surveys and activities.',
    description: 'Direct organization-wide processes for evaluating, monitoring and improving compliance with regulations and standards.',
    keyFocus: ['Ensure regulatory compliance', 'Facilitate survey readiness', 'Guide through survey processes'],
    competencies: [
      'Operationalize processes to support compliance with regulations and standards',
      'Facilitate continuous survey readiness activities',
      'Guide the organization through survey processes and findings'
    ],
    courses: [
      { title: 'Regulatory Compliance Essentials', duration: '4 hours' },
      { title: 'Survey Readiness Preparation', duration: '3 hours' },
      { title: 'CMS Conditions of Participation', duration: '5 hours' }
    ]
  },
  'Quality Review and Accountability': {
    fullDescription: 'Direct activities that support compliance with organization-wide voluntary, mandatory and contractual requirements for data acquisition, analysis, reporting, and improvement.',
    description: 'Direct activities that support compliance with voluntary, mandatory and contractual reporting requirements.',
    keyFocus: ['Relate payment models', 'Execute measure requirements', 'Facilitate performance review'],
    competencies: [
      'Relate current and emerging payment models to healthcare quality work',
      'Conduct the activities to execute measure requirements',
      'Implement processes to facilitate practitioner performance review activities'
    ],
    courses: [
      { title: 'Value-Based Care Models', duration: '4 hours' },
      { title: 'Quality Measure Management', duration: '3 hours' },
      { title: 'Peer Review Processes', duration: '3 hours' }
    ]
  }
};

export default function DomainDetailModal({ domain, onClose }) {
  if (!domain) return null;
  
  const Icon = DOMAIN_ICONS[domain.name] || Users;
  const data = DOMAIN_DATA[domain.name] || {};

  return (
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
              <span 
                className="px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-2"
                style={{ 
                  backgroundColor: `${domain.color}15`,
                  color: domain.color
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {domain.name}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#3D3D3D]">{domain.name}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Your Assessment Score - Only show if score exists */}
          {domain.score && (
            <div 
              className="rounded-xl p-5 border-2"
              style={{ 
                backgroundColor: `${domain.color}05`,
                borderColor: `${domain.color}30`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-[#3D3D3D]">Your Assessment Score</h4>
                <p className="text-xs text-gray-500">{domain.assessmentDate || 'Latest'}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">Your Score</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-bold" style={{ color: domain.color }}>
                      {domain.score.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-sm">/ 3.0</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{domain.level || 'Level'}</p>
                </div>
                
                <div className="text-center border-x border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Percentile Ranking</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {domain.percentile}th
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Among peers</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">Progress Since Last</p>
                  <div className="text-2xl font-bold" style={{ color: domain.previousScore && domain.score > domain.previousScore ? '#10B981' : domain.color }}>
                    {domain.previousScore ? `+${(domain.score - domain.previousScore).toFixed(1)}` : '—'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{domain.previousDate ? '12 months ago' : 'First assessment'}</p>
                </div>
              </div>
            </div>
          )}
        
          {/* Full Description */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {data.fullDescription || data.description}
          </p>

          {/* Key Focus Areas */}
          {data.keyFocus && (
            <div className="mb-6 bg-gradient-to-br from-blue-50 to-transparent rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-[#3D3D3D] text-sm mb-3">Key Focus Areas</h3>
              <ul className="space-y-2">
                {data.keyFocus.map((focus, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: domain.color }} />
                    {focus}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Competencies */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#3D3D3D] mb-3">Competencies within This Domain</h3>
            <ul className="space-y-2">
              {data.competencies?.map((comp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: domain.color }} />
                  {comp}
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Levels */}
          <div>
            <h3 className="font-semibold text-[#3D3D3D] mb-3">Understanding Skill Levels</h3>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-transparent rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <h4 className="font-semibold text-sm text-[#3D3D3D]">Foundational (I KNOW)</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Working knowledge of concepts with reference/context provided. Completing tasks independently using rules. Activities: Discussing, Describing, Identifying, Participating.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-transparent rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <h4 className="font-semibold text-sm text-[#3D3D3D]">Proficient (I DO)</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Deep understanding of concepts with holistic problem-solving approach. Ability to recognize relevance and variation. Activities: Collaborating, Creating, Developing, Implementing, Facilitating.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-transparent rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <h4 className="font-semibold text-sm text-[#3D3D3D]">Advanced (I LEAD)</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Nuanced understanding with ability to assess others' competence and develop strategic vision. Activities: Coaching, Advancing, Evaluating, Advocating, Empowering.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}