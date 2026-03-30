import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ChevronDown, ChevronRight, TrendingUp, Network, Shield, Users, Settings, Globe, BarChart3, CheckSquare, ClipboardCheck, MessageCircle, ArrowUp, ArrowDown, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DOMAIN_ICONS = {
  'Quality Leadership': Network,
  'Patient Safety': Shield,
  'Professional Engagement': Users,
  'Performance Improvement': Settings,
  'Population Health': Globe,
  'Health Data Analytics': BarChart3,
  'Regulatory & Accreditation': CheckSquare,
  'Quality Review & Accountability': ClipboardCheck,
};

export default function ReassessmentProgressCard({ data, onChatOpen }) {
   const [expandedDomain, setExpandedDomain] = useState(null);
   const [activeTab, setActiveTab] = useState('drivers');

   const previousData = {
    organizationalScore: 48,
    previousReadiness: 45,
    domainDistribution: [
      { 
        name: 'Quality Leadership', 
        previous: 58,
        current: 60,
        previousDist: 0.18,
        currentDist: 0.15,
        color: '#1E5BB8',
        trendData: [
          { year: 'Year 1 (2024)', score: 2.0 },
          { year: 'Year 2 (2025)', score: 2.03 },
          { year: 'Year 3 (2026)', score: 2.05 }
        ],
        competencies: [
          { name: 'Lead quality initiatives', previous: 55, current: 60 },
          { name: 'Foster continuous improvement', previous: 60, current: 62 },
          { name: 'Communicate priorities', previous: 52, current: 58 }
        ]
      },
      { 
        name: 'Health Data Analytics', 
        previous: 20, 
        current: 28, 
        previousDist: 0.61,
        currentDist: 0.48,
        color: '#8A6D3B',
        trendData: [
          { year: 'Year 1 (2024)', score: 0.9 },
          { year: 'Year 2 (2025)', score: 1.02 },
          { year: 'Year 3 (2026)', score: 1.15 }
        ],
        competencies: [
          { name: 'Data governance', previous: 18, current: 25 },
          { name: 'Data collection planning', previous: 20, current: 28 },
          { name: 'Acquire data from systems', previous: 22, current: 32 }
        ]
      },
      { 
        name: 'Patient Safety', 
        previous: 72, 
        current: 75, 
        previousDist: 0.08,
        currentDist: 0.05,
        color: '#E67E22',
        trendData: [
          { year: 'Year 1 (2024)', score: 1.8 },
          { year: 'Year 2 (2025)', score: 1.82 },
          { year: 'Year 3 (2026)', score: 1.85 }
        ],
        competencies: [
          { name: 'Create safe environment', previous: 73, current: 76 },
          { name: 'Identify & mitigate risks', previous: 70, current: 74 },
          { name: 'Respond to safety events', previous: 68, current: 72 }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
       <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       className="space-y-6"
       >
                {/* Engagement Health Snapshot */}
                <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-3 gap-4"
                >
                  {/* Current Engagement */}
                  <div className="bg-white rounded-xl border border-gray-200 px-5 py-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00A3E015' }}>
                        <Users className="w-4 h-4" style={{ color: '#00A3E0' }} />
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-tight">Current Engagement</p>
                    </div>
                    <p className="text-2xl font-bold text-[#3D3D3D]">76%</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Consolidated across cycles</p>
                  </div>

                  {/* Change vs Previous */}
                  <div className="bg-white rounded-xl border border-gray-200 px-5 py-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#DC262615' }}>
                        <ArrowDown className="w-4 h-4" style={{ color: '#DC2626' }} />
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-tight">Change vs Previous</p>
                    </div>
                    <p className="text-2xl font-bold text-red-600">-8 pp</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Since first pulse cycle</p>
                  </div>

                  {/* Participation */}
                  <div className="bg-white rounded-xl border border-gray-200 px-5 py-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#6B4C9A15' }}>
                        <Users className="w-4 h-4" style={{ color: '#6B4C9A' }} />
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium leading-tight">Participation</p>
                    </div>
                    <p className="text-2xl font-bold text-[#3D3D3D]">87%</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Response rate</p>
                  </div>
                </motion.div>

                {/* Engagement Trend Chart */}
                <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h3 className="text-sm font-bold text-[#3D3D3D] mb-2 uppercase tracking-wider">Engagement Trend</h3>
                  <p className="text-xs text-gray-500 mb-6">Consolidated agreement across pulse cycles</p>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={[
                          { cycle: 'PS1', engagement: 84, target: 75 },
                          { cycle: 'PS2', engagement: 81, target: 75 },
                          { cycle: 'PS3', engagement: 79, target: 75 },
                          { cycle: 'PS4', engagement: 78, target: 75 },
                          { cycle: 'PS5', engagement: 76, target: 75 }
                        ]}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="0" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="cycle" stroke="#d1d5db" style={{ fontSize: '13px', fontWeight: 500 }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#d1d5db" style={{ fontSize: '13px' }} domain={[70, 90]} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} formatter={(value) => value + '%'} labelStyle={{ color: '#374151' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
                        <Line type="natural" dataKey="engagement" stroke="#00A3E0" strokeWidth={2.5} dot={{ fill: '#00A3E0', r: 5, strokeWidth: 0 }} activeDot={{ r: 7 }} name="Current Engagement" />
                        <Line type="natural" dataKey="target" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target Threshold" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Workforce Readiness Drivers (Executive View) */}
                <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h3 className="text-sm font-bold text-[#3D3D3D] mb-2 uppercase tracking-wider">Workforce Readiness Drivers</h3>
                  <p className="text-xs text-gray-500 mb-6">Prioritized by risk and impact</p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Driver</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Current</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Change</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { name: 'Leadership Support', current: 76, prev: 84, status: 'Watch', impact: 'High', priority: 1 },
                          { name: 'Time Availability', current: 63, prev: 65, status: 'At Risk', impact: 'High', priority: 2 },
                          { name: 'Strategic Alignment', current: 83, prev: 80, status: 'Healthy', impact: 'Moderate', priority: 3 },
                          { name: 'Application of Learning', current: 75, prev: 72, status: 'Watch', impact: 'Moderate', priority: 4 }
                        ].map((driver, idx) => {
                          const change = driver.current - driver.prev;
                          const statusColor = driver.status === 'Healthy' ? '#10B981' : driver.status === 'Watch' ? '#F59E0B' : '#DC2626';
                          const statusBg = driver.status === 'Healthy' ? '#ECFDF5' : driver.status === 'Watch' ? '#FFFBEB' : '#FEF2F2';
                          return (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="py-4 px-4 text-sm font-medium text-[#3D3D3D]">{driver.name}</td>
                              <td className="py-4 px-4 text-right">
                                <span className="text-sm font-bold text-[#3D3D3D]">{driver.current}%</span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {change > 0 ? (
                                    <span className="flex items-center gap-0.5 text-sm font-semibold text-[#10B981]">
                                      <ArrowUp className="w-3 h-3" />+{change}pp
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-0.5 text-sm font-semibold text-red-600">
                                      <ArrowDown className="w-3 h-3" />{change}pp
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" style={{ color: statusColor, backgroundColor: statusBg }}>
                                  {driver.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="text-xs font-semibold text-gray-600">{driver.impact}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Structural Barriers (Tiered by Impact) */}
                <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <h3 className="text-sm font-bold text-[#3D3D3D] mb-6 uppercase tracking-wider">Structural Barriers</h3>
                  <div className="space-y-6">
                    {/* High Impact */}
                    <div>
                      <h4 className="text-xs font-bold text-red-700 mb-4 uppercase tracking-wide">High Impact (≥ 30%)</h4>
                      <div className="space-y-3">
                        {[{ name: 'Time constraints', pct: 38, trend: 'up', summary: 'Workforce perceives insufficient protected time for quality initiatives.' }].map((barrier, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex-shrink-0 mt-1">
                              <ArrowUp className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-1">
                                <p className="text-sm font-bold text-[#3D3D3D]">{barrier.name}</p>
                                <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">{barrier.pct}%</span>
                              </div>
                              <p className="text-xs text-gray-600">{barrier.summary}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Moderate Impact */}
                    <div>
                      <h4 className="text-xs font-bold text-yellow-700 mb-4 uppercase tracking-wide">Moderate Impact (15–29%)</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'Competing priorities', pct: 24, trend: 'neutral', summary: 'Unclear prioritization framework affects engagement.' },
                          { name: 'Leadership awareness gaps', pct: 19, trend: 'up', summary: 'Some leaders lack visibility into quality initiatives.' }
                        ].map((barrier, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                            <div className="flex-shrink-0 mt-1">
                              {barrier.trend === 'up' && <ArrowUp className="w-4 h-4 text-yellow-600" />}
                              {barrier.trend === 'neutral' && <span className="text-yellow-600">→</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-1">
                                <p className="text-sm font-bold text-[#3D3D3D]">{barrier.name}</p>
                                <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">{barrier.pct}%</span>
                              </div>
                              <p className="text-xs text-gray-600">{barrier.summary}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Low Impact */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 mb-4 uppercase tracking-wide">Low Impact (&lt; 15%)</h4>
                      <div className="space-y-2">
                        {[{ name: 'Unclear role expectations', pct: 12, trend: 'down', summary: 'Minimal barrier—continue monitoring.' }].map((barrier, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex-shrink-0 mt-0.5">
                              <ArrowDown className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-0.5">
                                <p className="text-sm font-medium text-[#3D3D3D]">{barrier.name}</p>
                                <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-0.5 rounded">{barrier.pct}%</span>
                              </div>
                              <p className="text-xs text-gray-600">{barrier.summary}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>


                </motion.div>
                </div>
                );
                }