import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Target, TrendingUp, TrendingDown, BookOpen, 
  Award, Clock, CheckCircle, AlertCircle, ArrowRight, Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import Header from '@/components/shared/Header';

export default function SkillAssessmentResult() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const assessmentId = urlParams.get('id');
  
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const data = await base44.entities.SkillAssessment.list();
        const result = data.find(a => a.id === assessmentId);
        setAssessment(result);
      } catch (error) {
        console.error('Error fetching assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
        <Header currentPage="SkillAssessmentResult" />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#00A3E0] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
        <Header currentPage="SkillAssessmentResult" />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Assessment not found</p>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F68B1F';
    return '#EF4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Developing';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="SkillAssessmentResult" />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('Results'))}
            className="mb-4 text-gray-600 hover:text-[#00A3E0]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#3D3D3D] mb-2">
                {assessment.domain_name} - Assessment Results
              </h1>
              <p className="text-gray-600">
                Completed on {new Date(assessment.completed_date).toLocaleDateString()} • {assessment.time_spent_minutes} minutes
              </p>
            </div>
            <Button variant="outline" className="border-gray-300">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#00A3E0] to-[#0093c9] rounded-2xl p-8 text-white mb-8 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Award className="w-12 h-12 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-semibold uppercase mb-1">Overall Score</p>
                <p className="text-5xl font-bold mb-2">{assessment.overall_score}%</p>
                <p className="text-white/90 text-lg">
                  {getScoreLabel(assessment.overall_score)} Performance
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-xl px-4 py-3 backdrop-blur">
                <p className="text-white/80 text-xs mb-1">Questions Answered</p>
                <p className="text-2xl font-bold">{assessment.questions_answered}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skill Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-[#00A3E0]" />
                <h2 className="text-lg font-bold text-[#3D3D3D]">Skill Area Performance</h2>
              </div>

              <div className="space-y-4">
                {assessment.skill_scores.map((skill, index) => {
                  const percentage = (skill.score / skill.max_score) * 100;
                  const color = getScoreColor(percentage);
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="p-4 rounded-xl border border-gray-100 hover:border-[#00A3E0]/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${color}15` }}
                          >
                            {skill.status === 'strong' ? (
                              <TrendingUp className="w-5 h-5" style={{ color }} />
                            ) : (
                              <TrendingDown className="w-5 h-5" style={{ color }} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#3D3D3D]">{skill.skill_name}</p>
                            <p className="text-xs text-gray-500">
                              {skill.score} / {skill.max_score} points
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color }}>
                            {Math.round(percentage)}%
                          </p>
                          <p className="text-xs font-medium" style={{ color }}>
                            {getScoreLabel(percentage)}
                          </p>
                        </div>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                        style={{ 
                          '--progress-background': color 
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recommended Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-[#00A3E0]" />
                <h2 className="text-lg font-bold text-[#3D3D3D]">Recommended Learning Path</h2>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                Based on your assessment, we recommend these courses to strengthen your skills:
              </p>

              <div className="space-y-3">
                {assessment.recommended_courses.map((course, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-gray-100 hover:bg-[#00A3E0]/5 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-[#00A3E0]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#3D3D3D]">{course.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {course.duration}
                            </span>
                            <span className={`font-medium ${
                              course.priority === 'High' ? 'text-orange-600' : 'text-gray-600'
                            }`}>
                              {course.priority} Priority
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold">
                        Enroll
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-6">
            {/* Strengths */}
            {assessment.strengths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-[#3D3D3D]">Your Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {assessment.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Areas for Growth */}
            {assessment.improvement_areas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-200 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-[#3D3D3D]">Growth Opportunities</h3>
                </div>
                <ul className="space-y-2">
                  {assessment.improvement_areas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#00A3E0]/5 to-white rounded-2xl border border-[#00A3E0]/20 p-6"
            >
              <h3 className="font-bold text-[#3D3D3D] mb-4">Next Steps</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-[#00A3E0] hover:bg-[#0093c9] text-white"
                  onClick={() => navigate(createPageUrl('Roadmap'))}
                >
                  View Full Learning Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#00A3E0]/30 text-[#00A3E0]"
                  onClick={() => navigate(createPageUrl('SkillAssessment') + `?domain=${assessment.domain_name}`)}
                >
                  Retake Assessment
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}