import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, ArrowRight, Network, Clock, CheckCircle, BarChart3, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/shared/Header';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChat from '@/components/results/AIChat';

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    domain: 'Quality Leadership & Integration',
    domainColor: '#003DA5',
    domainIcon: Network,
    competency: 'I direct the quality infrastructure to achieve organizational objectives.',
    groupings: [
      {
        id: 'g1',
        activities: [
          'Discuss value of quality program within organization',
          'Explain relationships among core quality functions',
          'Identify key elements of dashboards/scorecards',
          'Research attributes of external recognition programs'
        ]
      },
      {
        id: 'g2',
        activities: [
          'Manage governance activities (councils, committees)',
          'Integrate activities of core quality functions',
          'Use quality tools with stakeholders to drive decisions',
          'Facilitate prioritization of improvement initiatives'
        ]
      },
      {
        id: 'g3',
        activities: [
          'Develop dashboards/scorecards for improvement',
          'Advise leaders on measures and data for decisions',
          'Lead strategic planning for quality programming',
          'Develop strategies for integration of quality functions',
          'Prioritize initiatives aligned with organizational goals',
          'Lead participation in quality initiatives'
        ]
      }
    ]
  },
  {
    id: 2,
    domain: 'Health Data Analytics',
    domainColor: '#F68B1F',
    domainIcon: BarChart3,
    competency: 'I analyze quality data to identify trends and opportunities for improvement.',
    groupings: [
      {
        id: 'g1',
        activities: [
          'Explain types of quality measures (structure, process, outcome)',
          'Discuss best practices for data collection',
          'Identify data sources for benchmarking',
          'Describe importance of accurate data'
        ]
      },
      {
        id: 'g2',
        activities: [
          'Develop measures with operational definitions',
          'Design data collection plans independently',
          'Create visualizations that drive decisions',
          'Perform basic data extractions'
        ]
      },
      {
        id: 'g3',
        activities: [
          'Lead complex statistical analyses',
          'Design predictive models for quality outcomes',
          'Mentor others in data analysis techniques',
          'Present data insights to executive leadership'
        ]
      }
    ]
  },
  {
    id: 3,
    domain: 'Patient Safety',
    domainColor: '#009CA6',
    domainIcon: Shield,
    competency: 'I implement safety programs to prevent harm and improve care quality.',
    groupings: [
      {
        id: 'g1',
        activities: [
          'Describe components of a safety culture',
          'Identify common safety event types',
          'Explain basic root cause analysis concepts',
          'Discuss importance of event reporting'
        ]
      },
      {
        id: 'g2',
        activities: [
          'Conduct root cause analyses for safety events',
          'Implement safety improvement projects',
          'Train staff on safety protocols',
          'Monitor safety metrics and trends'
        ]
      },
      {
        id: 'g3',
        activities: [
          'Lead organization-wide safety initiatives',
          'Design comprehensive safety programs',
          'Advise leadership on safety strategy',
          'Develop safety culture assessments'
        ]
      }
    ]
  }
];

const AGREEMENT_SCALE = [
  'Strongly Agree',
  'Agree',
  'Slightly Agree',
  'Neutral',
  'Slightly Disagree',
  'Disagree',
  'Strongly Disagree'
];

export default function Assessment() {
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const question = SAMPLE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100;
  const currentAnswer = answers[question.id] || {};
  const DomainIcon = question.domainIcon;

  const handleAgreementSelect = (value) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: { ...prev[question.id], agreement: value }
    }));
    showSaved();
  };

  const handleGroupingSelect = (groupId) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: { ...prev[question.id], grouping: groupId }
    }));
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const canProceed = currentAnswer.agreement && currentAnswer.grouping;

  const handleNext = () => {
    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      navigate(createPageUrl('Processing'));
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (!termsAccepted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
        <Header currentPage="Assessment" />
        
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link to={createPageUrl('Framework')}>
              <Button variant="ghost" className="text-gray-600 hover:text-[#00A3E0] -ml-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Framework
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-blue-200 p-8 bg-gradient-to-br from-blue-50 to-white"
          >
            <h1 className="text-2xl font-bold text-[#3D3D3D] mb-6">NAHQ Professional Assessment Terms of Use</h1>
            
            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto">
              <div>
                <h2 className="font-semibold text-[#3D3D3D] mb-2">About This Assessment</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The NAHQ Professional Assessment measures your competency across the Healthcare Quality Competency Framework. Your responses will help create a personalized development plan aligned with your professional goals.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-[#3D3D3D] mb-2">Data Usage & Benchmarking</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your demographic and professional profile information will be used anonymously for benchmarking purposes. This allows us to provide meaningful percentile comparisons with professionals in similar roles while maintaining your privacy.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-[#3D3D3D] mb-2">Accuracy & Honesty</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Please provide accurate information reflecting your current competency levels based on work you perform regularly—not aspirationally. The assessment is most valuable when it represents your honest assessment of your current abilities.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-[#3D3D3D] mb-2">Assessment Duration</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This assessment takes approximately 40-45 minutes to complete. You can pause and resume at any time. Your progress is automatically saved as you answer each question.
                </p>
              </div>
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-4 mb-8 p-4 bg-white rounded-lg border border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#00A3E0] mt-1 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  I accept the NAHQ Professional Assessment Terms of Use and understand my demographic information will be used for anonymous benchmarking purposes.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Link to={createPageUrl('Framework')}>
                <Button variant="outline" className="border-gray-200 text-gray-700">
                  Cancel
                </Button>
              </Link>
              <Button
                onClick={() => {
                  if (termsAccepted) {
                    setCurrentQuestion(0);
                  }
                }}
                disabled={!termsAccepted}
                className="bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="Assessment" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${question.domainColor}15` }}
              >
                <DomainIcon className="w-5 h-5" style={{ color: question.domainColor }} />
              </div>
              <span className="font-semibold text-[#3D3D3D]">{question.domain} Domain</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{Math.round(progress)}% Complete ({currentQuestion + 1} of {SAMPLE_QUESTIONS.length})</span>
            </div>
          </div>
          
          <div className="relative">
            <Progress value={progress} className="h-2" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: saved ? 1 : 0 }}
              className="absolute right-0 -top-8 flex items-center gap-1 text-green-600 text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Saved
            </motion.div>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
          >
            {/* Competency Statement */}
            <h2 className="text-xl md:text-2xl font-bold text-[#3D3D3D] mb-8 leading-relaxed">
              {question.competency}
            </h2>

            {/* Agreement Scale */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                How much do you agree this describes your current work?
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {AGREEMENT_SCALE.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAgreementSelect(option)}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left
                      ${currentAnswer.agreement === option 
                        ? 'border-[#00A3E0] bg-[#00A3E0]/5' 
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0
                      ${currentAnswer.agreement === option 
                        ? 'border-[#00A3E0] bg-[#00A3E0]' 
                        : 'border-gray-300'
                      }
                    `}>
                      {currentAnswer.agreement === option && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className={`text-sm ${currentAnswer.agreement === option ? 'text-[#00A3E0] font-medium' : 'text-gray-700'}`}>
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 my-8" />

            {/* Activity Groupings */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Choose the grouping that most closely describes your regular activities:
              </h3>
              <p className="text-xs text-gray-400 mb-4">Select the level that best matches your current responsibilities</p>
              
              <div className="space-y-3">
                {question.groupings.map((grouping, index) => (
                  <button
                    key={grouping.id}
                    onClick={() => handleGroupingSelect(grouping.id)}
                    className={`
                      w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                      ${currentAnswer.grouping === grouping.id 
                        ? 'border-[#00A3E0] bg-[#00A3E0]/5' 
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors
                        ${currentAnswer.grouping === grouping.id 
                          ? 'border-[#00A3E0] bg-[#00A3E0]' 
                          : 'border-gray-300'
                        }
                      `}>
                        {currentAnswer.grouping === grouping.id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <span className={`font-semibold text-sm ${currentAnswer.grouping === grouping.id ? 'text-[#00A3E0]' : 'text-gray-700'}`}>
                          GROUPING {index + 1} {index === 0 ? '(Foundational)' : index === 1 ? '(Proficient)' : '(Advanced)'}
                        </span>
                        <ul className="mt-2 space-y-1">
                          {grouping.activities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-gray-400 mt-1">•</span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                ))}

                <button
                  onClick={() => handleGroupingSelect('none')}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${currentAnswer.grouping === 'none' 
                      ? 'border-[#00A3E0] bg-[#00A3E0]/5' 
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                      ${currentAnswer.grouping === 'none' 
                        ? 'border-[#00A3E0] bg-[#00A3E0]' 
                        : 'border-gray-300'
                      }
                    `}>
                      {currentAnswer.grouping === 'none' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className={`text-sm ${currentAnswer.grouping === 'none' ? 'text-[#00A3E0] font-medium' : 'text-gray-600'}`}>
                      I do not currently perform any of these activities
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === SAMPLE_QUESTIONS.length - 1 ? 'Complete Assessment' : 'Next Step'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </main>

      {/* Floating Chat Button */}
      <FloatingChatButton onClick={() => setShowChat(true)} />

      {/* AI Chat Modal */}
      {showChat && (
        <AIChat 
          onClose={() => setShowChat(false)} 
          context="assessment"
        />
      )}
    </div>
  );
}