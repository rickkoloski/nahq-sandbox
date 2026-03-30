import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy, TrendingUp, Target, BarChart3, Bot, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function OverallScoreModal({ results, onClose }) {
  const scorePercentage = (results.overallScore / 3) * 100;
  
  const getScoreLevel = (score) => {
    if (score >= 2.5) return { label: 'Advanced', color: '#10B981', description: 'You demonstrate mastery across most competencies' };
    if (score >= 2.0) return { label: 'High Proficient', color: '#3B82F6', description: 'You work independently and guide others in most areas' };
    if (score >= 1.5) return { label: 'Proficient', color: '#F59E0B', description: 'You have solid foundational skills with developing expertise' };
    return { label: 'Foundational', color: '#F97316', description: 'You are building core competencies' };
  };

  const levelInfo = getScoreLevel(results.overallScore);

  const domainsByLevel = {
    advanced: results.domains.filter(d => d.score >= 2.0),
    proficient: results.domains.filter(d => d.score >= 1.5 && d.score < 2.0),
    foundational: results.domains.filter(d => d.score < 1.5)
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#00A3E0]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFED00]/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#FFED00]" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#3D3D3D]">Overall Competency Score</h2>
              <p className="text-xs text-gray-500">Comprehensive assessment analysis</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Score Visualization */}
          <div className="bg-gradient-to-br from-[#00A3E0]/5 to-[#00B5E2]/10 rounded-2xl p-6 border border-[#00A3E0]/20">
            <div className="text-center mb-6">
              <div className="inline-flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-bold text-[#00A3E0]">{results.overallScore}</span>
                <span className="text-3xl text-gray-400">/3.0</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div 
                  className="px-4 py-1.5 rounded-full font-semibold text-sm"
                  style={{ 
                    backgroundColor: `${levelInfo.color}15`,
                    color: levelInfo.color
                  }}
                >
                  {levelInfo.label}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{levelInfo.description}</p>
            </div>

            {/* Visual Progress Bar */}
            <div className="relative mb-4">
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercentage}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#00A3E0] to-[#00B5E2]"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Foundational<br/>(1.0)</span>
                <span>Proficient<br/>(2.0)</span>
                <span>Advanced<br/>(3.0)</span>
              </div>
            </div>

          </div>

          {/* Comparison to Standards */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-3">NAHQ Role Benchmark</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">{results.overallBenchmark}</span>
                <span className="text-gray-400">/3.0</span>
              </div>
              <p className="text-xs text-gray-600">Expected for {results.position}</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Your Gap</span>
                  <span className={`font-bold ${results.overallScore >= results.overallBenchmark ? 'text-green-600' : 'text-orange-600'}`}>
                    {results.overallScore >= results.overallBenchmark ? '+' : ''}{(results.overallScore - results.overallBenchmark).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs text-gray-500 mb-3">All Participants Average</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">{results.peerAverage}</span>
                <span className="text-gray-400">/3.0</span>
              </div>
              <p className="text-xs text-gray-600">n=8,000+ assessments</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Your Comparison</span>
                  <span className={`font-bold ${results.overallScore >= results.peerAverage ? 'text-green-600' : 'text-orange-600'}`}>
                    {results.overallScore >= results.peerAverage ? '+' : ''}{(results.overallScore - results.peerAverage).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-[#00A3E0]/5 via-[#00B5E2]/5 to-transparent border border-[#00A3E0]/20 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#3D3D3D] mb-1">AI Analysis of Your Score</h3>
                <p className="text-xs text-gray-500">What your {results.overallScore} means</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  Your score of <strong>{results.overallScore}</strong> places you at the <strong>Proficient level</strong>, 
                  indicating you can work independently across most healthcare quality domains.
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  You're performing better than <strong>{results.percentile}%</strong> of professionals in similar roles, 
                  demonstrating solid competency in your current position.
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-[#00A3E0] mt-0.5 flex-shrink-0" />
                <p className="leading-relaxed">
                  With targeted development in your foundational areas (especially Analytics), 
                  you could reach <strong>Advanced level ({(results.overallScore + 0.5).toFixed(1)}+)</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Domain Distribution vs Benchmark */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-[#3D3D3D] mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#00A3E0]" />
              Score Distribution vs NAHQ Role Benchmark
            </h3>
            
            <div className="space-y-4">
              {/* Above Benchmark */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Above Benchmark</span>
                  <span className="text-sm font-bold text-green-600">
                    {results.domains.filter(d => d.score >= d.benchmark).length} domains
                  </span>
                </div>
                <div className="space-y-1">
                  {results.domains.filter(d => d.score >= d.benchmark).map(domain => (
                    <div key={domain.name} className="flex items-center justify-between text-xs bg-green-50 rounded px-3 py-2 border border-green-200">
                      <span className="text-gray-700">{domain.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-700">{domain.score.toFixed(1)}</span>
                        <span className="text-gray-500">vs</span>
                        <span className="font-semibold text-[#3D3D3D]">{domain.benchmark.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* On Target (within 0.2) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">On Target (±0.2)</span>
                  <span className="text-sm font-bold text-blue-600">
                    {results.domains.filter(d => d.score < d.benchmark && Math.abs(d.score - d.benchmark) <= 0.2).length} domains
                  </span>
                </div>
                <div className="space-y-1">
                  {results.domains.filter(d => d.score < d.benchmark && Math.abs(d.score - d.benchmark) <= 0.2).map(domain => (
                    <div key={domain.name} className="flex items-center justify-between text-xs bg-blue-50 rounded px-3 py-2 border border-blue-200">
                      <span className="text-gray-700">{domain.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-700">{domain.score.toFixed(1)}</span>
                        <span className="text-gray-500">vs</span>
                        <span className="font-semibold text-[#3D3D3D]">{domain.benchmark.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Below Target */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Below Target</span>
                  <span className="text-sm font-bold text-orange-600">
                    {results.domains.filter(d => d.score < d.benchmark && Math.abs(d.score - d.benchmark) > 0.2).length} domains
                  </span>
                </div>
                <div className="space-y-1">
                  {results.domains.filter(d => d.score < d.benchmark && Math.abs(d.score - d.benchmark) > 0.2).map(domain => (
                    <div key={domain.name} className="flex items-center justify-between text-xs bg-orange-50 rounded px-3 py-2 border border-orange-200">
                      <span className="text-gray-700">{domain.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-orange-700">{domain.score.toFixed(1)}</span>
                        <span className="text-gray-500">vs</span>
                        <span className="font-semibold text-[#3D3D3D]">{domain.benchmark.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
              <p>Note: Benchmark scores reflect expected competency levels for a {results.position}. Some roles may only require foundational proficiency in certain domains.</p>
            </div>
          </div>

          {/* Target Growth */}
          <div className="bg-[#FFED00]/10 border border-[#FFED00]/30 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-3">
              <Target className="w-5 h-5 text-[#3D3D3D] mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#3D3D3D] mb-1">Your Development Target</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  By focusing on your Analytics gap and maintaining your strengths, you could reach 
                  an overall score of <strong>2.0+ (High Proficient)</strong> within one year—
                  positioning you strongly for VP or Chief Quality Officer roles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          <Button 
            onClick={onClose}
            className="w-full bg-[#00A3E0] hover:bg-[#0093c9] text-white"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}