import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import Header from '@/components/shared/Header';

const DOMAIN_ASSESSMENTS = {
  'Health Data Analytics': {
    color: '#F68B1F',
    questions: [
      {
        id: 1,
        skill: 'Data Collection',
        question: 'You need to collect data on hospital readmission rates. Which approach would you take?',
        options: [
          { value: 'a', text: 'Use existing data from the EHR system and validate accuracy', points: 3 },
          { value: 'b', text: 'Create a new data collection form for staff to complete', points: 1 },
          { value: 'c', text: 'Wait for IT to provide the data when available', points: 0 },
          { value: 'd', text: 'Manually review patient charts to gather information', points: 2 }
        ]
      },
      {
        id: 2,
        skill: 'Data Analysis',
        question: 'You notice a sudden spike in medication errors. What analysis method would you use first?',
        options: [
          { value: 'a', text: 'Run descriptive statistics to understand the pattern', points: 2 },
          { value: 'b', text: 'Create a control chart to identify special cause variation', points: 3 },
          { value: 'c', text: 'Calculate the mean and report it to leadership', points: 1 },
          { value: 'd', text: 'Wait for more data before analyzing', points: 0 }
        ]
      },
      {
        id: 3,
        skill: 'Data Visualization',
        question: 'You need to present complex infection rate trends to the executive team. What visualization would you create?',
        options: [
          { value: 'a', text: 'A detailed table with all the raw numbers', points: 0 },
          { value: 'b', text: 'A line chart showing trends over time with benchmark comparison', points: 3 },
          { value: 'c', text: 'A pie chart showing the proportion of different infection types', points: 1 },
          { value: 'd', text: 'A bar chart of monthly totals', points: 2 }
        ]
      },
      {
        id: 4,
        skill: 'Statistical Methods',
        question: 'When comparing patient satisfaction scores before and after an intervention, which test is most appropriate?',
        options: [
          { value: 'a', text: 'Chi-square test', points: 1 },
          { value: 'b', text: 'Paired t-test', points: 3 },
          { value: 'c', text: 'Simple percentage comparison', points: 0 },
          { value: 'd', text: 'Correlation analysis', points: 2 }
        ]
      },
      {
        id: 5,
        skill: 'Performance Measures',
        question: 'You need to develop a new quality measure for your organization. What is the most critical first step?',
        options: [
          { value: 'a', text: 'Define the measure with clear numerator and denominator', points: 3 },
          { value: 'b', text: 'Start collecting data immediately', points: 0 },
          { value: 'c', text: 'Look at what other hospitals are measuring', points: 1 },
          { value: 'd', text: 'Set a target goal for the measure', points: 2 }
        ]
      }
    ]
  },
  'Quality Leadership': {
    color: '#003DA5',
    questions: [
      {
        id: 1,
        skill: 'Strategic Planning',
        question: 'Your organization needs to develop a 3-year quality strategic plan. What should be your first step?',
        options: [
          { value: 'a', text: 'Conduct environmental scan and stakeholder assessment', points: 3 },
          { value: 'b', text: 'List all current quality initiatives', points: 1 },
          { value: 'c', text: 'Set ambitious quality targets', points: 2 },
          { value: 'd', text: 'Review competitor quality programs', points: 0 }
        ]
      },
      {
        id: 2,
        skill: 'Team Leadership',
        question: 'A quality improvement team is experiencing conflict. How do you address this?',
        options: [
          { value: 'a', text: 'Remove difficult team members', points: 0 },
          { value: 'b', text: 'Facilitate open discussion to understand perspectives', points: 3 },
          { value: 'c', text: 'Assign tasks to keep people busy', points: 1 },
          { value: 'd', text: 'Make executive decisions to move forward', points: 2 }
        ]
      },
      {
        id: 3,
        skill: 'Change Management',
        question: 'You are implementing a major process change. What is the most critical success factor?',
        options: [
          { value: 'a', text: 'Having executive sponsorship and visible support', points: 3 },
          { value: 'b', text: 'Implementing quickly before resistance builds', points: 0 },
          { value: 'c', text: 'Creating detailed policies and procedures', points: 1 },
          { value: 'd', text: 'Training all staff on the new process', points: 2 }
        ]
      },
      {
        id: 4,
        skill: 'Communication',
        question: 'How do you communicate a quality failure to the Board of Directors?',
        options: [
          { value: 'a', text: 'Minimize details to avoid concern', points: 0 },
          { value: 'b', text: 'Present facts, impact, root causes, and action plan', points: 3 },
          { value: 'c', text: 'Focus on who was responsible', points: 1 },
          { value: 'd', text: 'Wait until you have all solutions in place', points: 2 }
        ]
      },
      {
        id: 5,
        skill: 'Resource Management',
        question: 'You have limited budget for quality initiatives. How do you prioritize?',
        options: [
          { value: 'a', text: 'Spread resources equally across all initiatives', points: 1 },
          { value: 'b', text: 'Focus on high-impact, high-risk areas with data-driven ROI', points: 3 },
          { value: 'c', text: 'Ask executives which initiatives they prefer', points: 0 },
          { value: 'd', text: 'Prioritize regulatory requirements only', points: 2 }
        ]
      }
    ]
  },
  'Patient Safety': {
    color: '#009CA6',
    questions: [
      {
        id: 1,
        skill: 'Risk Assessment',
        question: 'How do you identify high-risk processes in your organization?',
        options: [
          { value: 'a', text: 'Use FMEA (Failure Mode and Effects Analysis)', points: 3 },
          { value: 'b', text: 'Review only processes with past incidents', points: 1 },
          { value: 'c', text: 'Ask staff which processes feel risky', points: 2 },
          { value: 'd', text: 'Focus on processes flagged by regulatory bodies', points: 0 }
        ]
      },
      {
        id: 2,
        skill: 'Incident Response',
        question: 'A serious safety event just occurred. What is your immediate priority?',
        options: [
          { value: 'a', text: 'Ensure patient safety and stabilization', points: 3 },
          { value: 'b', text: 'Begin documenting the event', points: 1 },
          { value: 'c', text: 'Notify hospital administration', points: 2 },
          { value: 'd', text: 'Interview staff about what happened', points: 0 }
        ]
      },
      {
        id: 3,
        skill: 'Root Cause Analysis',
        question: 'During an RCA, the team quickly identifies that "staff didn\'t follow the protocol." What should you do?',
        options: [
          { value: 'a', text: 'Accept this as the root cause and implement retraining', points: 0 },
          { value: 'b', text: 'Use the 5 Whys to dig deeper into system issues', points: 3 },
          { value: 'c', text: 'Document the finding and move to action planning', points: 1 },
          { value: 'd', text: 'Focus on individual accountability', points: 2 }
        ]
      },
      {
        id: 4,
        skill: 'Safety Culture',
        question: 'How do you measure the safety culture of your organization?',
        options: [
          { value: 'a', text: 'Review incident report rates only', points: 1 },
          { value: 'b', text: 'Conduct validated safety culture surveys and analyze results', points: 3 },
          { value: 'c', text: 'Ask managers for their perception', points: 0 },
          { value: 'd', text: 'Track compliance with safety policies', points: 2 }
        ]
      },
      {
        id: 5,
        skill: 'Prevention Strategies',
        question: 'What is the most effective strategy to prevent medication errors?',
        options: [
          { value: 'a', text: 'Implement multiple layers of defense (system redesign)', points: 3 },
          { value: 'b', text: 'Increase staff training', points: 1 },
          { value: 'c', text: 'Create stricter policies', points: 0 },
          { value: 'd', text: 'Install better technology', points: 2 }
        ]
      }
    ]
  }
};

export default function SkillAssessment() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const domainName = urlParams.get('domain') || 'Health Data Analytics';
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assessment = DOMAIN_ASSESSMENTS[domainName];
  const questions = assessment?.questions || [];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const skillScores = {};
    let totalPoints = 0;
    let maxPoints = 0;

    questions.forEach(q => {
      const answer = answers[q.id];
      const selectedOption = q.options.find(opt => opt.value === answer);
      const points = selectedOption?.points || 0;
      
      if (!skillScores[q.skill]) {
        skillScores[q.skill] = { earned: 0, max: 0 };
      }
      skillScores[q.skill].earned += points;
      skillScores[q.skill].max += 3;
      
      totalPoints += points;
      maxPoints += 3;
    });

    const skillScoresArray = Object.entries(skillScores).map(([skill, scores]) => {
      const percentage = (scores.earned / scores.max) * 100;
      return {
        skill_name: skill,
        score: scores.earned,
        max_score: scores.max,
        status: percentage >= 80 ? 'strong' : percentage >= 60 ? 'developing' : 'needs_improvement'
      };
    });

    const overallScore = (totalPoints / maxPoints) * 100;
    const strengths = skillScoresArray.filter(s => s.status === 'strong').map(s => s.skill_name);
    const improvements = skillScoresArray.filter(s => s.status === 'needs_improvement').map(s => s.skill_name);
    
    return {
      domain_name: domainName,
      overall_score: Math.round(overallScore),
      skill_scores: skillScoresArray,
      questions_answered: questions.length,
      time_spent_minutes: Math.round((Date.now() - startTime) / 60000),
      strengths,
      improvement_areas: improvements,
      recommended_courses: getRecommendedCourses(domainName, improvements),
      completed_date: new Date().toISOString()
    };
  };

  const getRecommendedCourses = (domain, improvements) => {
    const courseMap = {
      'Health Data Analytics': [
        { title: 'Advanced Data Visualization', duration: '6 hours', priority: 'High' },
        { title: 'Statistical Process Control', duration: '8 hours', priority: 'High' },
        { title: 'Healthcare Data Management', duration: '4 hours', priority: 'Medium' }
      ],
      'Quality Leadership': [
        { title: 'Strategic Leadership in Healthcare', duration: '6 hours', priority: 'High' },
        { title: 'Change Management Essentials', duration: '5 hours', priority: 'High' },
        { title: 'Executive Quality Communication', duration: '4 hours', priority: 'Medium' }
      ],
      'Patient Safety': [
        { title: 'Advanced Root Cause Analysis', duration: '6 hours', priority: 'High' },
        { title: 'Safety Culture Development', duration: '5 hours', priority: 'High' },
        { title: 'High Reliability Organizations', duration: '4 hours', priority: 'Medium' }
      ]
    };
    
    return courseMap[domain] || [];
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    const results = calculateResults();
    
    try {
      const assessment = await base44.entities.SkillAssessment.create(results);
      navigate(createPageUrl('SkillAssessmentResult') + `?id=${assessment.id}`);
    } catch (error) {
      console.error('Error saving assessment:', error);
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="SkillAssessment" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-600 hover:text-[#00A3E0]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#3D3D3D] mb-2">
                {domainName} Skill Assessment
              </h1>
              <p className="text-gray-600">
                Answer scenario-based questions to assess your practical skills
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>~{questions.length * 2} minutes</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-lg mb-6"
          >
            <div className="mb-6">
              <div className="inline-block px-3 py-1 bg-[#00A3E0]/10 text-[#00A3E0] text-xs font-semibold rounded-full mb-4">
                {currentQ.skill}
              </div>
              <h2 className="text-xl font-semibold text-[#3D3D3D] leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswer(currentQ.id, value)}>
              <div className="space-y-3">
                {currentQ.options.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-[#00A3E0]/50 ${
                      currentAnswer === option.value
                        ? 'border-[#00A3E0] bg-[#00A3E0]/5'
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex-1 cursor-pointer text-[#3D3D3D] leading-relaxed">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  answers[questions[idx].id]
                    ? 'bg-green-500'
                    : idx === currentQuestion
                    ? 'bg-[#00A3E0]'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !currentAnswer}
              className="bg-[#00A3E0] hover:bg-[#0093c9] text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!currentAnswer}
              className="bg-[#00A3E0] hover:bg-[#0093c9] text-white"
            >
              Next Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}