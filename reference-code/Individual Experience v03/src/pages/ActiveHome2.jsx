import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Trophy, Calendar, MessageCircle, ArrowRight, TrendingUp, AlertTriangle, CheckCircle, 
  Bot, ChevronDown, ChevronRight, BookOpen, BarChart3, RefreshCw, Bell, Award, Target,
  LineChart, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/shared/Header';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import AIChat from '@/components/results/AIChat';

const SAMPLE_RESULTS = {
  overallScore: 1.8,
  overallBenchmark: 2.0,
  completionDate: 'January 27, 2026',
  position: 'Director of Quality',
  nextReassessmentDue: 'July 27, 2026',
  daysUntilReassessment: 169
};

const UPSKILL_PROGRESS = {
  'Health Data Analytics': {
    startScore: 1.4,
    currentScore: 1.5,
    targetScore: 1.7,
    percentComplete: 33,
    coursesCompleted: 1,
    coursesTotal: 5,
    hoursCompleted: 2,
    hoursTotal: 30
  }
};

const PROGRESS_OVER_TIME = [
  { date: 'Jan 2025', score: 1.5 },
  { date: 'Apr 2025', score: 1.55 },
  { date: 'Jul 2025', score: 1.6 },
  { date: 'Jan 2026', score: 1.8 }
];

const NEXT_MILESTONES = [
  {
    title: 'Complete HQ Principles Course',
    domain: 'Health Data Analytics',
    dueDate: 'Feb 15, 2026',
    status: 'in_progress',
    progress: 60
  },
  {
    title: 'Healthcare Analytics Workshop',
    domain: 'Health Data Analytics',
    dueDate: 'Feb 20, 2026',
    status: 'upcoming',
    progress: 0
  },
  {
    title: 'Introduction to Healthcare Analytics',
    domain: 'Health Data Analytics',
    dueDate: 'Mar 1, 2026',
    status: 'upcoming',
    progress: 0
  }
];

export default function ActiveHome2() {
  const [showChat, setShowChat] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState('Health Data Analytics');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="Home" />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#00A3E0]/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[#00A3E0]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#3D3D3D]">
                Your Upskill Journey
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Track your progress, manage your learning pathway, and reach your professional goals
              </p>
            </div>
          </div>
        </motion.div>

        {/* Assessment Retake Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#FFED00]/10 to-[#FFED00]/5 border-2 border-[#FFED00]/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFED00]/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-[#3D3D3D]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#3D3D3D] mb-2 flex items-center gap-2">
                📊 Ready for Your Reassessment
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                You're making great progress! Your next reassessment is due <strong>{SAMPLE_RESULTS.nextReassessmentDue}</strong> ({SAMPLE_RESULTS.daysUntilReassessment} days away). Retake it to validate your skill improvements and adjust your learning plan based on your growth.
              </p>
              <div className="flex gap-2">
                <Link to={createPageUrl('Assessment')}>
                  <Button size="sm" className="bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Schedule Reassessment
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" className="text-gray-600">
                  Remind Me Later
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overall Progress Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          {/* Current Focus Domain */}
          <div className="bg-white rounded-xl border-2 border-[#F68B1F]/20 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#F68B1F]/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-[#F68B1F]" />
              </div>
              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                Current Focus
              </span>
            </div>
            <h4 className="font-bold text-[#3D3D3D] mb-3">Health Data Analytics</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-[#3D3D3D]">{UPSKILL_PROGRESS['Health Data Analytics'].percentComplete}%</span>
              </div>
              <Progress 
                value={UPSKILL_PROGRESS['Health Data Analytics'].percentComplete} 
                className="h-2"
              />
            </div>
            <p className="text-xs text-gray-600">
              {UPSKILL_PROGRESS['Health Data Analytics'].coursesCompleted} of {UPSKILL_PROGRESS['Health Data Analytics'].coursesTotal} courses completed
            </p>
          </div>

          {/* Score Progress */}
          <div className="bg-white rounded-xl border-2 border-[#00A3E0]/20 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center">
                <LineChart className="w-5 h-5 text-[#00A3E0]" />
              </div>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                In Development
              </span>
            </div>
            <h4 className="font-bold text-[#3D3D3D] mb-3">Score Improvement</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Current</span>
                <span className="text-sm font-bold text-[#00A3E0]">1.5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Target</span>
                <span className="text-sm font-bold text-[#3D3D3D]">1.7</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-600">Progress: +0.1 (33% toward goal)</p>
              </div>
            </div>
          </div>

          {/* Learning Hours */}
          <div className="bg-white rounded-xl border-2 border-[#8BC53F]/20 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#8BC53F]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#8BC53F]" />
              </div>
            </div>
            <h4 className="font-bold text-[#3D3D3D] mb-3">Learning Investment</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Hours Completed</span>
                <span className="font-bold text-[#3D3D3D]">{UPSKILL_PROGRESS['Health Data Analytics'].hoursCompleted}/{UPSKILL_PROGRESS['Health Data Analytics'].hoursTotal}h</span>
              </div>
              <Progress 
                value={(UPSKILL_PROGRESS['Health Data Analytics'].hoursCompleted / UPSKILL_PROGRESS['Health Data Analytics'].hoursTotal) * 100} 
                className="h-2"
              />
            </div>
            <p className="text-xs text-gray-600">
              Average: 4-5 hours/month
            </p>
          </div>
        </motion.div>

        {/* Score Progress Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-8"
        >
          <h3 className="font-bold text-[#3D3D3D] mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00A3E0]" />
            Your Progress Over Time
          </h3>
          
          <div className="space-y-4">
            {PROGRESS_OVER_TIME.map((point, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-700">{point.date}</p>
                </div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-100 rounded-lg flex items-center px-3 relative overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00A3E0] to-[#00B5E2] rounded-lg transition-all"
                      style={{ width: `${(point.score / 3) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-[#00A3E0]">{point.score.toFixed(1)}/3.0</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong className="text-[#3D3D3D]">📈 Your Trajectory:</strong> You've improved 0.3 points over 12 months. At this pace, you'll reach your target score (1.7) by May 2026. Keep up the momentum!
            </p>
          </div>
        </motion.div>

        {/* Next Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-8"
        >
          <h3 className="font-bold text-[#3D3D3D] mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#00A3E0]" />
            Your Next Milestones
          </h3>

          <div className="space-y-3">
            {NEXT_MILESTONES.map((milestone, index) => (
              <div 
                key={index}
                className={`rounded-lg border-2 p-4 ${
                  milestone.status === 'in_progress' 
                    ? 'border-[#00A3E0] bg-[#00A3E0]/5' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#3D3D3D]">{milestone.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Due {milestone.dueDate}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${
                    milestone.status === 'in_progress'
                      ? 'bg-[#00A3E0]/10 text-[#00A3E0]'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {milestone.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
                  </span>
                </div>
                
                {milestone.progress > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-[#3D3D3D]">{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-1.5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Learning Pathway */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => setExpandedDomain(expandedDomain === 'Health Data Analytics' ? null : 'Health Data Analytics')}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F68B1F]/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#F68B1F]" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-[#3D3D3D]">Health Data Analytics</h3>
                <p className="text-xs text-gray-600 mt-1">5 courses · 30 hours · Your primary focus area</p>
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
                className="border-t border-gray-100 p-6 space-y-3 bg-gray-50"
              >
                <Link to={createPageUrl('AssessmentOption2')}>
                  <Button variant="outline" size="sm" className="w-full justify-start text-[#00A3E0] border-[#00A3E0]">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Full Course Catalog
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Floating Chat Button */}
      <FloatingChatButton onClick={() => setShowChat(true)} />

      {/* AI Chat Modal */}
      {showChat && (
        <AIChat 
          onClose={() => setShowChat(false)}
          context="adjust_plan"
        />
      )}
    </div>
  );
}