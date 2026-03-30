import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Users, Building2, Target, TrendingUp, AlertTriangle, Sparkles, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const QUESTIONS = [
  {
    id: 'org_size',
    question: 'What is your organization size?',
    icon: Building2,
    options: [
      { value: 'small', label: 'Small (<100 beds)', multiplier: 1 },
      { value: 'medium', label: 'Medium (100-300 beds)', multiplier: 1.2 },
      { value: 'large', label: 'Large (300-500 beds)', multiplier: 1.5 },
      { value: 'xlarge', label: 'Health System (500+ beds)', multiplier: 2 }
    ]
  },
  {
    id: 'quality_team',
    question: 'How many quality professionals do you have?',
    icon: Users,
    options: [
      { value: '1-5', label: '1-5 professionals', gap: 0.8 },
      { value: '6-15', label: '6-15 professionals', gap: 0.6 },
      { value: '16-30', label: '16-30 professionals', gap: 0.5 },
      { value: '30+', label: '30+ professionals', gap: 0.4 }
    ]
  },
  {
    id: 'training',
    question: 'How often do you conduct competency assessments?',
    icon: Target,
    options: [
      { value: 'never', label: 'Never / Ad-hoc', risk: 0.9 },
      { value: 'annual', label: 'Annually', risk: 0.6 },
      { value: 'biannual', label: 'Bi-annually', risk: 0.4 },
      { value: 'ongoing', label: 'Ongoing / Continuous', risk: 0.2 }
    ]
  },
  {
    id: 'challenges',
    question: 'What is your biggest quality challenge?',
    icon: AlertTriangle,
    options: [
      { value: 'data', label: 'Data analytics capabilities', domain: 'Health Data Analytics' },
      { value: 'improvement', label: 'Process improvement execution', domain: 'Performance Improvement' },
      { value: 'safety', label: 'Patient safety incidents', domain: 'Patient Safety' },
      { value: 'leadership', label: 'Quality leadership development', domain: 'Quality Leadership' }
    ]
  },
  {
    id: 'cms_rating',
    question: 'What is your current CMS Star Rating?',
    icon: BarChart3,
    options: [
      { value: '5', label: '5 Stars - Well above average', cmsScore: 5, impactFactor: 0.2 },
      { value: '4', label: '4 Stars - Above average', cmsScore: 4, impactFactor: 0.4 },
      { value: '3', label: '3 Stars - Average', cmsScore: 3, impactFactor: 0.6 },
      { value: '2-1', label: '2-1 Stars - Below average', cmsScore: 2, impactFactor: 0.8 }
    ]
  },
  {
    id: 'leapfrog',
    question: 'What is your Leapfrog Hospital Safety Grade?',
    icon: Target,
    options: [
      { value: 'A', label: 'Grade A', leapfrogGrade: 'A', safetyMultiplier: 0.3 },
      { value: 'B', label: 'Grade B', leapfrogGrade: 'B', safetyMultiplier: 0.5 },
      { value: 'C', label: 'Grade C', leapfrogGrade: 'C', safetyMultiplier: 0.7 },
      { value: 'D-F', label: 'Grade D or F', leapfrogGrade: 'D/F', safetyMultiplier: 0.9 }
    ]
  }
];

export default function SalesAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId, value, metadata) => {
    setAnswers({ ...answers, [questionId]: { value, ...metadata } });
    
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const calculateInsights = () => {
    const baseGap = 0.5;
    const teamGap = answers.quality_team?.gap || 0.6;
    const trainingRisk = answers.training?.risk || 0.7;
    const orgMultiplier = answers.org_size?.multiplier || 1;
    const cmsImpact = answers.cms_rating?.impactFactor || 0.5;
    const leapfrogImpact = answers.leapfrog?.safetyMultiplier || 0.5;

    // Factor in external quality metrics
    const overallGap = (baseGap + teamGap + trainingRisk + cmsImpact + leapfrogImpact) / 5;
    const atRiskPercent = Math.min(95, Math.round(overallGap * 100));
    const potentialImpact = Math.round(orgMultiplier * 150);

    const cmsStars = answers.cms_rating?.cmsScore || 3;
    const leapfrogGrade = answers.leapfrog?.leapfrogGrade || 'B';

    const domainScores = [
      { 
        domain: 'Health Data Analytics', 
        score: answers.challenges?.domain === 'Health Data Analytics' ? 1.4 : 1.8,
        target: 2.0,
        gap: answers.challenges?.domain === 'Health Data Analytics' ? 0.6 : 0.2
      },
      { 
        domain: 'Performance Improvement', 
        score: answers.challenges?.domain === 'Performance Improvement' ? 1.5 : 1.9,
        target: 2.0,
        gap: answers.challenges?.domain === 'Performance Improvement' ? 0.5 : 0.1
      },
      { 
        domain: 'Patient Safety', 
        score: answers.challenges?.domain === 'Patient Safety' ? 1.7 : 2.0,
        target: 2.1,
        gap: answers.challenges?.domain === 'Patient Safety' ? 0.4 : 0.1
      },
      { 
        domain: 'Quality Leadership', 
        score: answers.challenges?.domain === 'Quality Leadership' ? 1.6 : 1.9,
        target: 2.0,
        gap: answers.challenges?.domain === 'Quality Leadership' ? 0.4 : 0.1
      }
    ];

    return { overallGap, atRiskPercent, potentialImpact, domainScores, cmsStars, leapfrogGrade };
  };

  const insights = showResults ? calculateInsights() : null;

  if (showResults && insights) {
    return (
      <div className="min-h-screen bg-[#FCFCFD] p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png" 
              alt="NAHQ Logo" 
              className="h-12 w-auto mx-auto mb-8"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            >
              <Sparkles className="w-10 h-10 text-white" strokeWidth={2} />
            </motion.div>
            <p className="text-sm font-semibold text-[#00A3E0] tracking-wide uppercase mb-3">Assessment Complete</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#101828] mb-4">Your Quality Program Insights</h1>
            <p className="text-lg text-[#475467] max-w-2xl mx-auto">Based on your responses, here's a comprehensive analysis of your organization's quality capabilities and opportunities for growth.</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <Card className="p-6 bg-white border border-[#EAECF0] shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FEF3F2] flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-[#F04438]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-semibold text-[#101828] mb-1">{insights.atRiskPercent}%</p>
                    <p className="text-sm font-medium text-[#475467]">Staff Below Target</p>
                  </div>
                </div>
                <p className="text-sm text-[#667085] leading-relaxed">Of your quality team likely performing below role-based competency expectations</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Card className="p-6 bg-white border border-[#EAECF0] shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FEF6EE] flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-[#F79009]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-semibold text-[#101828] mb-1">{insights.overallGap.toFixed(1)}</p>
                    <p className="text-sm font-medium text-[#475467]">Average Gap Score</p>
                  </div>
                </div>
                <p className="text-sm text-[#667085] leading-relaxed">Points below role-based competency targets across quality domains</p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <Card className="p-6 bg-white border border-[#EAECF0] shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F6FEF9] flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#12B76A]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-semibold text-[#101828] mb-1">{insights.potentialImpact}</p>
                    <p className="text-sm font-medium text-[#475467]">People Impacted</p>
                  </div>
                </div>
                <p className="text-sm text-[#667085] leading-relaxed">Estimated workforce development opportunity across your organization</p>
              </Card>
            </motion.div>
          </div>

          {/* Domain Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Card className="p-6 bg-white border border-[#EAECF0] shadow-sm rounded-2xl">
                <h3 className="text-lg font-semibold text-[#101828] mb-1">Domain Performance Gaps</h3>
                <p className="text-sm text-[#475467] mb-6">Compare current scores to target benchmarks</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={insights.domainScores} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EAECF0" vertical={false} />
                    <XAxis 
                      dataKey="domain" 
                      tick={{ fontSize: 12, fill: '#475467' }} 
                      angle={-15} 
                      textAnchor="end" 
                      height={80}
                      axisLine={{ stroke: '#EAECF0' }}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 2.5]} 
                      tick={{ fontSize: 12, fill: '#475467' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #EAECF0', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }}
                      labelStyle={{ color: '#101828', fontWeight: 600, marginBottom: '4px' }}
                      itemStyle={{ color: '#475467', fontSize: '14px' }}
                    />
                    <Bar dataKey="score" fill="#00A3E0" name="Current Score" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="target" fill="#12B76A" name="Target" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
            >
              <Card className="p-6 bg-white border border-[#EAECF0] shadow-sm rounded-2xl">
                <h3 className="text-lg font-semibold text-[#101828] mb-1">Competency Profile</h3>
                <p className="text-sm text-[#475467] mb-6">Radar view of organizational capabilities</p>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={insights.domainScores}>
                    <PolarGrid stroke="#EAECF0" strokeWidth={1.5} />
                    <PolarAngleAxis 
                      dataKey="domain" 
                      tick={{ fontSize: 12, fill: '#475467', fontWeight: 500 }} 
                    />
                    <PolarRadiusAxis 
                      domain={[0, 2.5]} 
                      tick={{ fontSize: 11, fill: '#667085' }}
                      axisLine={false}
                    />
                    <Radar 
                      name="Your Team" 
                      dataKey="score" 
                      stroke="#00A3E0" 
                      fill="#00A3E0" 
                      fillOpacity={0.2} 
                      strokeWidth={2.5}
                    />
                    <Radar 
                      name="Target" 
                      dataKey="target" 
                      stroke="#12B76A" 
                      fill="#12B76A" 
                      fillOpacity={0.15} 
                      strokeWidth={2.5}
                      strokeDasharray="5 5"
                    />
                    <Legend 
                      wrapperStyle={{ 
                        paddingTop: '20px',
                        fontSize: '14px',
                        color: '#475467'
                      }}
                      iconType="circle"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Quality Metrics Connection */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 sm:mb-10"
          >
            <Card className="p-6 bg-white border border-[#EAECF0] shadow-sm rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-[#EFF8FF] flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-7 h-7 text-[#003DA5]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#475467]">CMS Star Rating</p>
                  <p className="text-2xl font-semibold text-[#101828]">{insights.cmsStars} Stars</p>
                </div>
              </div>
              <p className="text-sm text-[#667085] leading-relaxed mb-4">
                Organizations with stronger workforce competencies typically achieve {insights.cmsStars < 4 ? '0.5-1.0 star improvements' : 'sustained high performance'} within 18-24 months of systematic development.
              </p>
              <div className="bg-[#F9FAFB] border border-[#EAECF0] rounded-xl p-4">
                <p className="text-xs text-[#667085] leading-relaxed">
                  <span className="font-semibold text-[#344054]">Key Connection:</span> Your competency gaps in {answers.challenges?.domain || 'critical domains'} directly impact CMS quality measures like timely care, patient experience, and readmissions.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white border border-[#EAECF0] shadow-sm rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-[#F6FEF9] flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7 text-[#12B76A]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#475467]">Leapfrog Safety Grade</p>
                  <p className="text-2xl font-semibold text-[#101828]">Grade {insights.leapfrogGrade}</p>
                </div>
              </div>
              <p className="text-sm text-[#667085] leading-relaxed mb-4">
                Patient safety performance correlates strongly with quality team competencies. Improving workforce skills in Patient Safety and Performance Improvement drives measurable safety outcomes.
              </p>
              <div className="bg-[#F9FAFB] border border-[#EAECF0] rounded-xl p-4">
                <p className="text-xs text-[#667085] leading-relaxed">
                  <span className="font-semibold text-[#344054]">Impact Potential:</span> Closing your competency gaps could improve safety scores across infection prevention, surgical care, and medication safety measures.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.3 }}
          >
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-[#F9FAFB] to-white border border-[#EAECF0] shadow-sm rounded-2xl">
              <div className="flex items-start gap-4 sm:gap-6 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#101828] mb-3">AI-Powered Recommendations</h3>
                  <p className="text-[#475467] leading-relaxed mb-6">
                    Based on your assessment, <span className="font-semibold text-[#101828]">{insights.atRiskPercent}% of your quality workforce</span> likely needs development to meet role-based competency expectations. With your current <span className="font-semibold text-[#101828]">{insights.cmsStars}-star CMS rating</span> and <span className="font-semibold text-[#101828]">Leapfrog Grade {insights.leapfrogGrade}</span>, closing workforce competency gaps could directly improve your public quality metrics and patient outcomes.
                  </p>
                  <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#EAECF0] shadow-sm">
                    <p className="text-sm font-semibold text-[#101828] mb-4">Recommended Next Steps</p>
                    <ul className="space-y-3 text-sm text-[#475467]">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#12B76A] flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="leading-relaxed">Assess your entire quality workforce to identify specific competency gaps affecting CMS and Leapfrog measures</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#12B76A] flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="leading-relaxed">Prioritize training in {answers.challenges?.domain || 'critical domains'} to improve both workforce capability and quality scores</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#12B76A] flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="leading-relaxed">Track competency improvements alongside quality metrics to demonstrate ROI</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#12B76A] flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="leading-relaxed">Benchmark against high-performing organizations (5-star, Grade A) to set development targets</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-8 sm:mt-10"
          >
            <Card className="p-8 sm:p-10 lg:p-12 bg-white border border-[#EAECF0] shadow-sm rounded-2xl text-center">
              <h3 className="text-2xl sm:text-3xl font-semibold text-[#101828] mb-4">Ready to Transform Your Quality Program?</h3>
              <p className="text-[#475467] text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Get a comprehensive view of your organization's competency gaps and create data-driven development plans that drive real results.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#00A3E0] to-[#00B5E2] hover:from-[#0093c9] hover:to-[#00a5d1] text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  Schedule a Demo
                  <ArrowRight className="ml-2 w-5 h-5" strokeWidth={2} />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setShowResults(false);
                    setCurrentStep(0);
                    setAnswers({});
                  }}
                  className="border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB] font-semibold w-full sm:w-auto"
                >
                  Retake Assessment
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];

  return (
    <div className="min-h-screen bg-[#FCFCFD] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png" 
            alt="NAHQ Logo" 
            className="h-12 w-auto mx-auto mb-6"
          />
          <p className="text-sm font-semibold text-[#00A3E0] tracking-wide uppercase mb-2">Quality Capability Assessment</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#101828] mb-3">Measure Your Organization's Quality Readiness</h1>
          <p className="text-lg text-[#475467] max-w-2xl mx-auto">Answer a few questions to receive personalized insights about your quality program's strengths and opportunities.</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#344054]">Question {currentStep + 1} of {QUESTIONS.length}</span>
            <span className="text-sm font-semibold text-[#00A3E0]">{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% complete</span>
          </div>
          <div className="h-2 bg-[#F2F4F7] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00A3E0] to-[#00B5E2]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 sm:p-8 lg:p-10 bg-white shadow-sm border border-[#EAECF0] rounded-2xl">
              <div className="flex items-start gap-4 sm:gap-6 mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center shadow-lg flex-shrink-0">
                  <currentQuestion.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#101828] leading-tight">{currentQuestion.question}</h2>
                  <p className="text-sm text-[#475467] mt-2">Select the option that best describes your organization</p>
                </div>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    onClick={() => handleAnswer(currentQuestion.id, option.value, option)}
                    className="w-full p-4 sm:p-5 text-left rounded-xl border border-[#D0D5DD] hover:border-[#00A3E0] hover:bg-[#F9FAFB] transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-medium text-[#344054] group-hover:text-[#101828] pr-4">{option.label}</span>
                      <ArrowRight className="w-5 h-5 text-[#98A2B3] group-hover:text-[#00A3E0] group-hover:translate-x-1 transition-all flex-shrink-0" strokeWidth={2} />
                    </div>
                  </motion.button>
                ))}
              </div>

              {currentStep > 0 && (
                <div className="mt-8 pt-6 border-t border-[#EAECF0]">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="text-[#475467] hover:text-[#101828] hover:bg-[#F9FAFB] font-medium"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={2} />
                    Previous Question
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#667085]">
            Powered by <span className="font-semibold text-[#344054]">NAHQ Competency Framework</span>
          </p>
        </div>
      </div>
    </div>
  );
}