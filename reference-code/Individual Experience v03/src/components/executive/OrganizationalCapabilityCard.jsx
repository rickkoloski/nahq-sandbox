import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronDown, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';

const LEVEL_COLORS = {
  foundational: '#F59E0B',
  proficient: '#10B981',
  advanced: '#3B82F6'
};

const DOMAIN_BENCHMARKS = {
  'Quality Leadership': { nahq: 2.1, participantAvg: 1.95 },
  'Patient Safety': { nahq: 2.0, participantAvg: 1.88 },
  'Performance Improvement': { nahq: 1.95, participantAvg: 1.72 },
  'Health Data Analytics': { nahq: 1.9, participantAvg: 1.55 },
  'Regulatory & Accreditation': { nahq: 1.98, participantAvg: 1.85 }
};

const LEVEL_RANGES = {
  foundational: '1.0 - 1.6',
  proficient: '1.7 - 2.3',
  advanced: '2.4 - 3.0'
};

export default function OrganizationalCapabilityCard({ data }) {
  const [expandedDomain, setExpandedDomain] = useState(null);
  
  const getOrgScore = () => {
    const total = data.domainDistribution.reduce((sum, d) => sum + d.foundational + d.proficient + d.advanced, 0);
    const weighted = data.domainDistribution.reduce((sum, d) => 
      sum + (d.foundational * 1 + d.proficient * 2 + d.advanced * 3), 0
    );
    return weighted / total;
  };
  return (
    <div className="space-y-6">
      {/* Overall Score Section with Chart */}
      <div className="bg-gradient-to-br from-[#00A3E0]/5 to-[#00B5E2]/5 border border-[#00A3E0]/20 rounded-lg p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-600 mb-2 font-semibold">ORGANIZATIONAL AVERAGE</p>
              <p className="text-3xl font-bold text-[#00A3E0]">{getOrgScore().toFixed(2)}</p>
              <p className="text-xs text-gray-600 mt-1">across all 8 domains</p>
            </div>
          </div>

          {/* Domain Scores Chart */}
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={data.domainDistribution.map(domain => ({
                  name: domain.name.split(' ').slice(0, 2).join('\n'),
                  score: parseFloat(((domain.foundational * 1 + domain.proficient * 2 + domain.advanced * 3) / (domain.foundational + domain.proficient + domain.advanced)).toFixed(2)),
                  fullName: domain.name,
                  color: domain.color
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis 
                  domain={[0, 3]} 
                  ticks={[0, 1, 2, 3]}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value) => [value.toFixed(2), 'Score']}
                  labelFormatter={(label) => `Domain`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '6px' }}
                />
                <ReferenceLine 
                  y={2.0} 
                  stroke="#8BC53F" 
                  strokeWidth={3}
                  label={{ value: 'NAHQ Benchmark (2.0)', position: 'insideTopLeft', offset: -10, fill: '#8BC53F', fontSize: 11, fontWeight: 600 }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#00A3E0" 
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Level Ranges Reference */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-[#00A3E0]/10">
            <div className="text-center">
              <p className="text-xs font-semibold text-[#F59E0B] mb-1">Foundational</p>
              <p className="text-xs text-gray-600">{LEVEL_RANGES.foundational}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-[#10B981] mb-1">Proficient</p>
              <p className="text-xs text-gray-600">{LEVEL_RANGES.proficient}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-[#3B82F6] mb-1">Advanced</p>
              <p className="text-xs text-gray-600">{LEVEL_RANGES.advanced}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Comparison Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-[#3D3D3D] text-sm mb-4">Domain Scores vs NAHQ Benchmark</h3>
        {data.domainDistribution.map((domain) => {
          const total = domain.foundational + domain.proficient + domain.advanced;
          const foundationalPct = (domain.foundational / total) * 100;
          const proficientPct = (domain.proficient / total) * 100;
          const advancedPct = (domain.advanced / total) * 100;
          const orgAvgScore = (domain.foundational * 1 + domain.proficient * 2 + domain.advanced * 3) / total;
          const benchmark = DOMAIN_BENCHMARKS[domain.name];
          const isExpanded = expandedDomain === domain.name;
          const gap = benchmark?.nahq ? (benchmark.nahq - orgAvgScore).toFixed(2) : 0;

          return (
            <motion.div
              key={domain.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border-2 border-gray-200 hover:border-[#00A3E0]/50 transition-all overflow-hidden"
            >
              {/* Domain Header */}
              <button
                onClick={() => setExpandedDomain(isExpanded ? null : domain.name)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: domain.color }} />
                    <p className="font-semibold text-sm text-[#3D3D3D]">{domain.name}</p>
                  </div>
                </div>
                
                {/* Score Grid */}
                <div className="grid grid-cols-3 gap-8 ml-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Your Org</p>
                    <div className="flex items-baseline justify-end gap-1.5">
                      <span className="text-2xl font-bold text-[#00A3E0]">{orgAvgScore.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {benchmark && (
                    <div className="text-right border-l border-gray-200 pl-6">
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">NAHQ Benchmark</p>
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="text-2xl font-bold text-[#8BC53F]">{benchmark.nahq.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-right border-l border-gray-200 pl-6">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Gap</p>
                    <div className="flex items-baseline justify-end gap-1.5">
                      <span className={`text-2xl font-bold ${gap > 0 ? 'text-[#F68B1F]' : 'text-[#10B981]'}`}>
                        {gap > 0 ? '-' : '+'}{Math.abs(gap)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 bg-gray-50 p-5 space-y-5"
                  >
                    {/* Distribution Bar */}
                    <div>
                      <p className="text-xs text-gray-600 mb-3 font-semibold">Level Distribution</p>
                      <div className="flex h-8 rounded-lg overflow-hidden gap-0.5">
                        {foundationalPct > 0 && (
                          <div 
                            className="flex items-center justify-center"
                            style={{ 
                              width: `${foundationalPct}%`,
                              backgroundColor: LEVEL_COLORS.foundational
                            }}
                          >
                            {foundationalPct > 12 && <span className="text-xs font-bold text-white">{foundationalPct.toFixed(0)}%</span>}
                          </div>
                        )}
                        {proficientPct > 0 && (
                          <div 
                            className="flex items-center justify-center"
                            style={{ 
                              width: `${proficientPct}%`,
                              backgroundColor: LEVEL_COLORS.proficient
                            }}
                          >
                            {proficientPct > 12 && <span className="text-xs font-bold text-white">{proficientPct.toFixed(0)}%</span>}
                          </div>
                        )}
                        {advancedPct > 0 && (
                          <div 
                            className="flex items-center justify-center"
                            style={{ 
                              width: `${advancedPct}%`,
                              backgroundColor: LEVEL_COLORS.advanced
                            }}
                          >
                            {advancedPct > 12 && <span className="text-xs font-bold text-white">{advancedPct.toFixed(0)}%</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Level Breakdown */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-600 mb-2">Foundational</p>
                        <p className="text-lg font-bold text-[#F59E0B]">{domain.foundational}</p>
                        <p className="text-xs text-gray-500 mt-1">({foundationalPct.toFixed(0)}%)</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-600 mb-2">Proficient</p>
                        <p className="text-lg font-bold text-[#10B981]">{domain.proficient}</p>
                        <p className="text-xs text-gray-500 mt-1">({proficientPct.toFixed(0)}%)</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-600 mb-2">Advanced</p>
                        <p className="text-lg font-bold text-[#3B82F6]">{domain.advanced}</p>
                        <p className="text-xs text-gray-500 mt-1">({advancedPct.toFixed(0)}%)</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-[#00A3E0]/5 to-[#00B5E2]/5 border border-[#00A3E0]/20 rounded-lg p-4 mt-6">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[#3D3D3D] text-xs mb-2">AI Insight</p>
            <ul className="space-y-1 text-xs text-gray-700">
              <li>• <strong>Analytics Gap:</strong> 65% foundational in Health Data Analytics. This is your highest development opportunity.</li>
              <li>• <strong>Leadership Strength:</strong> 32% advanced in Quality Leadership. Your team has strong strategic capability.</li>
              <li>• <strong>Consistent Safety:</strong> Patient Safety shows balanced distribution. No significant variation.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}