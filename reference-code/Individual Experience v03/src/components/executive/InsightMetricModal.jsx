import React from 'react';
import { motion } from 'framer-motion';
import { X, Bot, TrendingDown, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const ROLE_GROUPS = ['Director', 'Manager', 'Specialist', 'Coordinator'];
const DOMAINS = [
  'Quality Leadership',
  'Patient Safety', 
  'Performance Improvement',
  'Health Data Analytics'
];

const HEAT_MAP_DATA = {
  'Quality Leadership': { 
    'Director': { score: 2.1, target: 2.2 }, 
    'Manager': { score: 1.8, target: 2.0 }, 
    'Specialist': { score: 1.6, target: 1.8 }, 
    'Coordinator': { score: 1.5, target: 1.6 }
  },
  'Patient Safety': { 
    'Director': { score: 2.2, target: 2.3 }, 
    'Manager': { score: 1.9, target: 2.1 }, 
    'Specialist': { score: 1.8, target: 1.9 }, 
    'Coordinator': { score: 1.7, target: 1.8 }
  },
  'Performance Improvement': { 
    'Director': { score: 1.8, target: 2.2 }, 
    'Manager': { score: 1.6, target: 2.0 }, 
    'Specialist': { score: 1.4, target: 1.8 }, 
    'Coordinator': { score: 1.3, target: 1.6 }
  },
  'Health Data Analytics': { 
    'Director': { score: 1.6, target: 2.1 }, 
    'Manager': { score: 1.4, target: 1.9 }, 
    'Specialist': { score: 1.3, target: 1.7 }, 
    'Coordinator': { score: 1.2, target: 1.5 }
  }
};

const getHeatColor = (score, target) => {
  const gap = target - score;
  if (gap <= 0) return '#6BAE45'; // Dark green - at or above target
  if (gap <= 0.2) return '#9DC344'; // Light green
  if (gap <= 0.4) return '#FDD835'; // Yellow
  if (gap <= 0.6) return '#FB8C00'; // Orange
  return '#E53935'; // Red - critical gap
};

export default function InsightMetricModal({ type, onClose }) {
  const renderContent = () => {
    if (type === 'belowTarget') {
      const chartData = [
        { name: 'Health Data Analytics', value: 80, color: '#F68B1F' },
        { name: 'Performance Improvement', value: 70, color: '#00B5E2' },
        { name: 'Quality Leadership', value: 65, color: '#6B4C9A' },
        { name: 'Patient Safety', value: 60, color: '#ED1C24' }
      ];

      return (
        <>
          <div className="flex items-start gap-4 mb-6 p-4 bg-[#00A3E0]/5 rounded-lg border border-[#00A3E0]/20">
            <Bot className="w-6 h-6 text-[#00A3E0] flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">AI Analysis</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your workforce shows a clear pattern: <strong>analytics and process improvement capabilities</strong> are the primary development needs. 
                This is common in quality departments that historically focused on compliance over data-driven improvement. 
                The good news is these are teachable skills with clear learning pathways available.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Workforce Below Role Target by Domain</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Below Target']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#FFED00]/10 border border-[#FFED00]/30 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Recommended Priority</p>
            <p className="text-sm text-gray-700">
              Start with <strong>Health Data Analytics</strong> training for all staff, then layer in <strong>Performance Improvement</strong> methodology. 
              This creates a foundation for data-driven quality work.
            </p>
          </div>
        </>
      );
    }

    if (type === 'orgGap') {
      return (
        <>
          <div className="flex items-start gap-4 mb-6 p-4 bg-[#00A3E0]/5 rounded-lg border border-[#00A3E0]/20">
            <Bot className="w-6 h-6 text-[#00A3E0] flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">Heat Map Analysis</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                This heat map shows where gaps concentrate. <strong className="text-[#ED1C24]">Red cells</strong> indicate urgent development needs. 
                Notice how <strong>Health Data Analytics</strong> is consistently below target across all role levels—this suggests a systemic capability gap requiring organizational intervention.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Organizational Gap Heat Map: Domain × Role Group</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-48"></th>
                    {ROLE_GROUPS.map(role => (
                      <th key={role} className="text-center p-4 text-sm font-semibold text-gray-700 bg-gray-100">
                        <div>{role}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DOMAINS.map(domain => {
                    const domainData = HEAT_MAP_DATA[domain];
                    return (
                      <tr key={domain}>
                        <td className="p-4 text-sm font-semibold text-gray-700 bg-gray-100">
                          {domain}
                        </td>
                        {ROLE_GROUPS.map(role => {
                          const roleData = domainData[role];
                          const score = roleData.score;
                          const target = roleData.target;
                          const gap = target - score;
                          return (
                            <td 
                              key={role}
                              className="border-2 border-white p-0"
                            >
                              <div 
                                className="p-6 text-center min-h-[80px] flex flex-col items-center justify-center"
                                style={{ backgroundColor: getHeatColor(score, target) }}
                              >
                                <div className="text-2xl font-bold text-white mb-1">{score.toFixed(1)}</div>
                                <div className="text-xs text-white/90">
                                  Target: {target.toFixed(1)}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: '#6BAE45' }}></div>
                <span className="text-gray-600">At/Above Target</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: '#9DC344' }}></div>
                <span className="text-gray-600">Minor Gap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: '#FDD835' }}></div>
                <span className="text-gray-600">Moderate Gap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: '#FB8C00' }}></div>
                <span className="text-gray-600">Large Gap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: '#E53935' }}></div>
                <span className="text-gray-600">Critical Gap</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FFED00]/10 border border-[#FFED00]/30 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Key Insight</p>
            <p className="text-sm text-gray-700">
              <strong>Coordinators and Specialists</strong> show the largest gaps across all domains. 
              These frontline roles need immediate upskilling. Consider cohort-based training programs tailored to each role group.
            </p>
          </div>
        </>
      );
    }

    if (type === 'liftOpportunity') {
      const chartData = [
        { name: 'Health Data Analytics', impact: 95, current: 1.4, target: 2.0, gap: 0.6, color: '#F68B1F' },
        { name: 'Performance Improvement', impact: 85, current: 1.55, target: 2.05, gap: 0.5, color: '#00B5E2' },
        { name: 'Patient Safety', impact: 65, current: 1.9, target: 2.1, gap: 0.2, color: '#ED1C24' },
        { name: 'Quality Leadership', impact: 70, current: 1.75, target: 2.05, gap: 0.3, color: '#6B4C9A' }
      ];

      return (
        <>
          <div className="flex items-start gap-4 mb-6 p-4 bg-[#00A3E0]/5 rounded-lg border border-[#00A3E0]/20">
            <Bot className="w-6 h-6 text-[#00A3E0] flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">Impact Potential Analysis</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                "Lift opportunity" measures the potential workforce impact of closing each domain gap. 
                <strong> Health Data Analytics</strong> scores highest because it affects the most people (80% below target) 
                and enables capabilities in other domains. Investing here creates a multiplier effect.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Workforce Impact Potential by Domain</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} label={{ value: 'Impact Score', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-md">
                          <p className="font-semibold text-sm text-gray-800 mb-2">{data.name}</p>
                          <p className="text-xs text-gray-600">Impact Score: <strong>{data.impact}</strong></p>
                          <p className="text-xs text-gray-600">Current: <strong>{data.current.toFixed(1)}</strong> | Target: <strong>{data.target.toFixed(1)}</strong></p>
                          <p className="text-xs text-gray-600">Gap: <strong className="text-[#F68B1F]">{data.gap.toFixed(1)}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="impact" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Highest Impact</p>
              <p className="text-lg font-bold text-[#F68B1F]">Health Data Analytics</p>
              <p className="text-xs text-gray-600 mt-1">95 impact score</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Focus Recommendation</p>
              <p className="text-lg font-bold text-[#00A3E0]">Analytics + PI</p>
              <p className="text-xs text-gray-600 mt-1">Combined impact: 180</p>
            </div>
          </div>

          <div className="bg-[#FFED00]/10 border border-[#FFED00]/30 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Strategic Recommendation</p>
            <p className="text-sm text-gray-700">
              Prioritize a 6-month analytics skills program for all quality staff. Follow with PI methodology training. 
              This sequence builds foundational data literacy first, then teaches how to apply it for improvement.
            </p>
          </div>
        </>
      );
    }
  };

  const getTitleIcon = () => {
    if (type === 'belowTarget') return TrendingDown;
    if (type === 'orgGap') return Target;
    if (type === 'liftOpportunity') return TrendingUp;
  };

  const getTitle = () => {
    if (type === 'belowTarget') return 'Workforce Below Role Target';
    if (type === 'orgGap') return 'Organizational Gap Analysis';
    if (type === 'liftOpportunity') return 'High-Lift Opportunities';
  };

  const TitleIcon = getTitleIcon();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#00A3E0] to-[#00B5E2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <TitleIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}