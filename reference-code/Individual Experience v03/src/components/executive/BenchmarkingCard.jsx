import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bot, ChevronDown, ChevronRight, TrendingUp, Users, AlertCircle, Network, Shield, Settings, Globe, BarChart3, CheckSquare, ClipboardCheck, MessageCircle, Building2 } from 'lucide-react';

const BENCHMARK_OPTIONS = [
  { value: 'nahq', label: 'vs National Benchmark', description: 'Industry standard for your position' },
  { value: 'similar', label: 'vs Organizations Like Me', description: 'Similar size, setting, role mix' },
  { value: 'hospital_compare', label: 'Compare Hospitals', description: 'Compare performance across hospitals' }
];

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

const SAMPLE_HOSPITALS = [
  { id: 1, name: 'Memorial Hospital', score: 1.92, completion: 85, participants: 28, color: '#00A3E0' },
  { id: 2, name: 'Regional Medical Center', score: 1.68, completion: 78, participants: 22, color: '#8BC53F' },
  { id: 3, name: 'Community General', score: 1.54, completion: 72, participants: 18, color: '#F68B1F' },
  { id: 4, name: 'University Health', score: 1.88, completion: 90, participants: 32, color: '#6B4C9A' }
];

const HOSPITAL_DOMAIN_DATA = {
  1: [ // Memorial Hospital
    { 
      name: 'Quality Leadership', 
      score: 2.1, 
      benchmark: 2.0,
      healthSystemAvg: 1.75,
      color: '#6B4C9A',
      competencies: [
        { name: 'Strategic Planning', score: 2.2, benchmark: 2.0, healthSystemAvg: 1.78 },
        { name: 'Change Management', score: 2.1, benchmark: 2.0, healthSystemAvg: 1.73 },
        { name: 'Team Leadership', score: 2.0, benchmark: 2.0, healthSystemAvg: 1.75 }
      ]
    },
    { 
      name: 'Patient Safety', 
      score: 2.0, 
      benchmark: 2.0,
      healthSystemAvg: 1.68,
      color: '#003DA5',
      competencies: [
        { name: 'Risk Assessment', score: 2.1, benchmark: 2.0, healthSystemAvg: 1.73 },
        { name: 'Error Prevention', score: 1.9, benchmark: 2.0, healthSystemAvg: 1.65 },
        { name: 'Safety Culture', score: 2.0, benchmark: 2.0, healthSystemAvg: 1.68 }
      ]
    },
    { 
      name: 'Performance Improvement', 
      score: 1.9, 
      benchmark: 2.0,
      healthSystemAvg: 1.63,
      color: '#00B5E2',
      competencies: [
        { name: 'Process Analysis', score: 2.0, benchmark: 2.0, healthSystemAvg: 1.68 },
        { name: 'Quality Metrics', score: 1.8, benchmark: 2.0, healthSystemAvg: 1.58 },
        { name: 'Continuous Improvement', score: 1.9, benchmark: 2.0, healthSystemAvg: 1.63 }
      ]
    },
    { 
      name: 'Health Data Analytics', 
      score: 1.8, 
      benchmark: 2.0,
      healthSystemAvg: 1.58,
      color: '#F68B1F',
      competencies: [
        { name: 'Data Collection', score: 1.9, benchmark: 2.0, healthSystemAvg: 1.65 },
        { name: 'Statistical Analysis', score: 1.7, benchmark: 2.0, healthSystemAvg: 1.5 },
        { name: 'Data Visualization', score: 1.8, benchmark: 2.0, healthSystemAvg: 1.58 }
      ]
    },
  ],
  2: [ // Regional Medical Center
    { 
      name: 'Quality Leadership', 
      score: 1.8, 
      benchmark: 2.0,
      healthSystemAvg: 1.75,
      color: '#6B4C9A',
      competencies: [
        { name: 'Strategic Planning', score: 1.9, benchmark: 2.0, healthSystemAvg: 1.78 },
        { name: 'Change Management', score: 1.7, benchmark: 2.0, healthSystemAvg: 1.73 },
        { name: 'Team Leadership', score: 1.8, benchmark: 2.0, healthSystemAvg: 1.75 }
      ]
    },
    { 
      name: 'Patient Safety', 
      score: 1.7, 
      benchmark: 2.0,
      healthSystemAvg: 1.68,
      color: '#003DA5',
      competencies: [
        { name: 'Risk Assessment', score: 1.8, benchmark: 2.0, healthSystemAvg: 1.73 },
        { name: 'Error Prevention', score: 1.6, benchmark: 2.0, healthSystemAvg: 1.65 },
        { name: 'Safety Culture', score: 1.7, benchmark: 2.0, healthSystemAvg: 1.68 }
      ]
    },
    { 
      name: 'Performance Improvement', 
      score: 1.6, 
      benchmark: 2.0,
      healthSystemAvg: 1.63,
      color: '#00B5E2',
      competencies: [
        { name: 'Process Analysis', score: 1.7, benchmark: 2.0, healthSystemAvg: 1.68 },
        { name: 'Quality Metrics', score: 1.5, benchmark: 2.0, healthSystemAvg: 1.58 },
        { name: 'Continuous Improvement', score: 1.6, benchmark: 2.0, healthSystemAvg: 1.63 }
      ]
    },
    { 
      name: 'Health Data Analytics', 
      score: 1.5, 
      benchmark: 2.0,
      healthSystemAvg: 1.58,
      color: '#F68B1F',
      competencies: [
        { name: 'Data Collection', score: 1.6, benchmark: 2.0, healthSystemAvg: 1.65 },
        { name: 'Statistical Analysis', score: 1.4, benchmark: 2.0, healthSystemAvg: 1.5 },
        { name: 'Data Visualization', score: 1.5, benchmark: 2.0, healthSystemAvg: 1.58 }
      ]
    },
  ],
  3: [ // Community General
    { 
      name: 'Quality Leadership', 
      score: 1.6, 
      benchmark: 2.0,
      healthSystemAvg: 1.75,
      color: '#6B4C9A',
      competencies: [
        { name: 'Strategic Planning', score: 1.7, benchmark: 2.0, healthSystemAvg: 1.78 },
        { name: 'Change Management', score: 1.5, benchmark: 2.0, healthSystemAvg: 1.73 },
        { name: 'Team Leadership', score: 1.6, benchmark: 2.0, healthSystemAvg: 1.75 }
      ]
    },
    { 
      name: 'Patient Safety', 
      score: 1.5, 
      benchmark: 2.0,
      healthSystemAvg: 1.68,
      color: '#003DA5',
      competencies: [
        { name: 'Risk Assessment', score: 1.6, benchmark: 2.0, healthSystemAvg: 1.73 },
        { name: 'Error Prevention', score: 1.4, benchmark: 2.0, healthSystemAvg: 1.65 },
        { name: 'Safety Culture', score: 1.5, benchmark: 2.0, healthSystemAvg: 1.68 }
      ]
    },
    { 
      name: 'Performance Improvement', 
      score: 1.5, 
      benchmark: 2.0,
      healthSystemAvg: 1.63,
      color: '#00B5E2',
      competencies: [
        { name: 'Process Analysis', score: 1.6, benchmark: 2.0, healthSystemAvg: 1.68 },
        { name: 'Quality Metrics', score: 1.4, benchmark: 2.0, healthSystemAvg: 1.58 },
        { name: 'Continuous Improvement', score: 1.5, benchmark: 2.0, healthSystemAvg: 1.63 }
      ]
    },
    { 
      name: 'Health Data Analytics', 
      score: 1.5, 
      benchmark: 2.0,
      healthSystemAvg: 1.58,
      color: '#F68B1F',
      competencies: [
        { name: 'Data Collection', score: 1.6, benchmark: 2.0, healthSystemAvg: 1.65 },
        { name: 'Statistical Analysis', score: 1.4, benchmark: 2.0, healthSystemAvg: 1.5 },
        { name: 'Data Visualization', score: 1.5, benchmark: 2.0, healthSystemAvg: 1.58 }
      ]
    },
  ],
  4: [ // University Health
    { 
      name: 'Quality Leadership', 
      score: 2.0, 
      benchmark: 2.0,
      healthSystemAvg: 1.75,
      color: '#6B4C9A',
      competencies: [
        { name: 'Strategic Planning', score: 2.1, benchmark: 2.0, healthSystemAvg: 1.78 },
        { name: 'Change Management', score: 1.9, benchmark: 2.0, healthSystemAvg: 1.73 },
        { name: 'Team Leadership', score: 2.0, benchmark: 2.0, healthSystemAvg: 1.75 }
      ]
    },
    { 
      name: 'Patient Safety', 
      score: 1.9, 
      benchmark: 2.0,
      healthSystemAvg: 1.68,
      color: '#003DA5',
      competencies: [
        { name: 'Risk Assessment', score: 2.0, benchmark: 2.0, healthSystemAvg: 1.73 },
        { name: 'Error Prevention', score: 1.8, benchmark: 2.0, healthSystemAvg: 1.65 },
        { name: 'Safety Culture', score: 1.9, benchmark: 2.0, healthSystemAvg: 1.68 }
      ]
    },
    { 
      name: 'Performance Improvement', 
      score: 1.8, 
      benchmark: 2.0,
      healthSystemAvg: 1.63,
      color: '#00B5E2',
      competencies: [
        { name: 'Process Analysis', score: 1.9, benchmark: 2.0, healthSystemAvg: 1.68 },
        { name: 'Quality Metrics', score: 1.7, benchmark: 2.0, healthSystemAvg: 1.58 },
        { name: 'Continuous Improvement', score: 1.8, benchmark: 2.0, healthSystemAvg: 1.63 }
      ]
    },
    { 
      name: 'Health Data Analytics', 
      score: 1.8, 
      benchmark: 2.0,
      healthSystemAvg: 1.58,
      color: '#F68B1F',
      competencies: [
        { name: 'Data Collection', score: 1.9, benchmark: 2.0, healthSystemAvg: 1.65 },
        { name: 'Statistical Analysis', score: 1.7, benchmark: 2.0, healthSystemAvg: 1.5 },
        { name: 'Data Visualization', score: 1.8, benchmark: 2.0, healthSystemAvg: 1.58 }
      ]
    },
  ]
};

export default function BenchmarkingCard({ data, selectedBenchmark, onBenchmarkChange, onChatOpen }) {
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [expandedCompetency, setExpandedCompetency] = useState(null);
  const [selectedHospitals, setSelectedHospitals] = useState([1, 2]);
  
  // Map data domains to benchmark data
  const getBenchmarkDomainsForNAHQ = () => {
    return data.domainDistribution.slice(0, 6).map(domain => {
      const totalStaff = domain.foundational + domain.proficient + domain.advanced;
      const avgScore = (domain.foundational * 1 + domain.proficient * 2 + domain.advanced * 3) / totalStaff;
      const benchmarkScore = 2.0; // Standard NAHQ benchmark
      return {
        name: domain.name,
        org: avgScore,
        benchmark: benchmarkScore,
        color: domain.color,
        variance: avgScore - benchmarkScore
        };
    });
  };
  
  const nahqDomains = getBenchmarkDomainsForNAHQ();

  return (
    <div className="space-y-6">
      {/* Benchmark Selection */}
      <div>
        <h4 className="font-semibold text-[#3D3D3D] mb-3 text-sm">Select Benchmark View</h4>
        <div className="grid md:grid-cols-3 gap-3">
           {BENCHMARK_OPTIONS.map((option) => (
             <button
               key={option.value}
               onClick={() => onBenchmarkChange(option.value)}
               className={`h-auto p-4 text-left rounded-lg border-2 transition-all ${
                 selectedBenchmark === option.value 
                   ? 'bg-[#00A3E0] border-[#00A3E0] text-white hover:bg-[#0093c9]' 
                   : 'border-gray-200 bg-white text-[#3D3D3D] hover:border-[#00A3E0]'
               }`}
             >
               <p className="font-semibold text-sm">{option.label}</p>
               <p className={`text-xs mt-1 ${selectedBenchmark === option.value ? 'text-blue-100' : 'text-gray-600'}`}>
                 {option.description}
               </p>
             </button>
           ))}
         </div>
      </div>

      {/* Benchmark Visualization */}
      {selectedBenchmark === 'nahq' && (
         <div className="space-y-6">
           {/* AI Insights First */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white rounded-xl border-2 border-[#00A3E0]"
           >
             <div className="p-6">
               <div className="flex items-start gap-4 mb-4">
                 <div className="w-10 h-10 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
                   <Bot className="w-5 h-5 text-[#00A3E0]" />
                 </div>
                 <div className="flex-1">
                   <h3 className="text-base font-semibold text-[#3D3D3D]">Strategic Insights</h3>
                 </div>
                 {onChatOpen && (
                   <Button
                     onClick={() => onChatOpen('benchmarking')}
                     variant="ghost"
                     size="sm"
                     className="text-[#00A3E0] hover:bg-[#00A3E0]/10 text-xs gap-1"
                   >
                     <MessageCircle className="w-3 h-3" />
                     Chat with AI
                   </Button>
                 )}
               </div>
               <div className="space-y-3 text-sm text-gray-700">
                   <p>
                     Your organization scores <strong className="text-[#00A3E0]">{data.organizationalScore.toFixed(2)}</strong>, which is <strong className="text-[#00A3E0]">{(data.benchmarkScore - data.organizationalScore).toFixed(2)} points below</strong> the Standard Role Target of {data.benchmarkScore}. This represents a <strong>{((data.benchmarkScore - data.organizationalScore) / data.benchmarkScore * 100).toFixed(0)}% variance</strong> to close.
                   </p>
                   <p>
                     <strong>Priority Domains:</strong> {nahqDomains
                       .filter(d => d.variance < -0.3)
                       .slice(0, 2)
                       .map(d => d.name)
                       .join(' and ')} require focused development investment. These represent your highest-impact improvement areas.
                   </p>
                   <p>
                     <strong>Next Steps:</strong> Establish targeted learning pathways in priority domains and conduct role-specific training. Reassess in 6 months to track progress.
                   </p>
                 </div>
               </div>
               </motion.div>

           {/* Overall Score */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white rounded-xl border-2 border-gray-200 p-8"
           >
             <h3 className="text-sm font-bold text-[#3D3D3D] mb-6 uppercase tracking-wider">Your Performance vs National Benchmark</h3>

             <div className="grid grid-cols-3 gap-6 mb-8">
               <div>
                 <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Your Organization</p>
                 <div className="flex items-baseline gap-1">
                   <span className="text-4xl font-bold text-[#00A3E0]">{data.organizationalScore.toFixed(2)}</span>
                   <span className="text-gray-400 text-xl">/3.0</span>
                 </div>
                 <p className="text-xs text-gray-600 mt-1">Current Score</p>
               </div>

               <div>
                 <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">National Benchmark</p>
                 <div className="flex items-baseline gap-1">
                   <span className="text-4xl font-bold text-[#3D3D3D]">{data.benchmarkScore.toFixed(2)}</span>
                   <span className="text-gray-400 text-xl">/3.0</span>
                 </div>
                 <p className="text-xs text-gray-600 mt-1">Standard Role Target</p>
               </div>

               <div>
                 <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Gap</p>
                 <div className="flex items-baseline gap-1">
                   <span className="text-4xl font-bold text-[#F68B1F]">{(data.benchmarkScore - data.organizationalScore).toFixed(2)}</span>
                 </div>
                 <p className="text-xs text-gray-600 mt-1">Points to Close</p>
               </div>
             </div>

             {/* Visual Score Bar */}
             <div className="space-y-3">
               <div className="relative h-10 bg-white rounded border border-gray-200">
                 <div className="absolute inset-0 flex">
                   <div className="flex-1 border-r border-gray-200"></div>
                   <div className="flex-1 border-r border-gray-200"></div>
                   <div className="flex-1"></div>
                 </div>

                 {/* Benchmark marker */}
                 <div 
                   className="absolute top-0 bottom-0 w-0.5 bg-[#FFED00] z-10"
                   style={{ left: `${(data.benchmarkScore / 3) * 100}%` }}
                 />

                 {/* Score bar */}
                 <div 
                   className="absolute top-0 bottom-0 left-0 rounded transition-all bg-[#00A3E0]/20"
                   style={{ width: `${(data.organizationalScore / 3) * 100}%` }}
                 />

                 {/* Score marker */}
                 <div 
                   className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                   style={{ left: `${(data.organizationalScore / 3) * 100}%` }}
                 >
                   <div className="w-6 h-6 rounded-full bg-[#00A3E0] border-2 border-white shadow-md flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-white"></div>
                   </div>
                 </div>
               </div>

               <div className="flex justify-between text-xs text-gray-500 pt-3">
                 <span>1.0<br/>Foundational</span>
                 <span>2.0<br/>Proficient</span>
                 <span>3.0<br/>Advanced</span>
               </div>
             </div>
           </motion.div>

           {/* Domain Breakdown */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="space-y-3"
           >
             <h3 className="font-semibold text-[#3D3D3D] text-sm">Domain Performance vs Benchmark</h3>
             {nahqDomains.map((domain) => {
               const isExpanded = expandedDomain === domain.name;

               return (
                 <motion.div
                   key={domain.name}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#00A3E0]/50 transition-all"
                 >
                   <button
                     onClick={() => setExpandedDomain(isExpanded ? null : domain.name)}
                     className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                   >
                     <div className="flex items-center gap-3 flex-1">
                       <div className="flex-shrink-0">
                         {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                       </div>
                       <div 
                         className="w-10 h-10 rounded-lg flex items-center justify-center"
                         style={{ backgroundColor: `${domain.color}15` }}
                       >
                         {(() => {
                           const IconComponent = DOMAIN_ICONS[domain.name];
                           return IconComponent ? <IconComponent className="w-5 h-5" style={{ color: domain.color }} /> : null;
                         })()}
                       </div>
                       <p className="font-semibold text-sm text-[#3D3D3D]">{domain.name}</p>
                     </div>

                     {/* Score Summary */}
                     <div className="grid grid-cols-3 gap-6 ml-4">
                       <div className="text-right">
                         <p className="text-xs text-gray-500 mb-1 font-semibold">YOUR ORG</p>
                         <p className="text-lg font-bold text-[#00A3E0]">{domain.org.toFixed(2)}</p>
                       </div>
                       <div className="border-l border-gray-200 pl-6 text-right">
                         <p className="text-xs text-gray-500 mb-1 font-semibold">NATIONAL BENCHMARK</p>
                         <p className="text-lg font-bold text-[#3D3D3D]">{domain.benchmark.toFixed(1)}</p>
                       </div>
                       <div className="border-l border-gray-200 pl-6 text-right">
                         <p className="text-xs text-gray-500 mb-1 font-semibold">VARIANCE</p>
                         <p className={`text-lg font-bold ${domain.variance < 0 ? 'text-[#F68B1F]' : 'text-[#10B981]'}`}>
                           {domain.variance > 0 ? '+' : ''}{domain.variance.toFixed(2)}
                         </p>
                       </div>
                     </div>
                   </button>

                   <AnimatePresence>
                     {isExpanded && (
                       <motion.div
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         transition={{ duration: 0.3 }}
                         className="border-t border-gray-200 bg-gray-50 p-5 space-y-4"
                       >
                         {/* What This Means */}
                         <div className="bg-white border-2 border-[#00A3E0] rounded-lg p-4">
                           <div className="flex gap-3">
                           <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center">
                             <Bot className="w-4 h-4 text-[#00A3E0]" />
                           </div>
                             <div>
                               <p className="text-sm font-semibold text-[#3D3D3D] mb-2">What This Means</p>
                               <p className="text-sm text-gray-700 leading-relaxed">
                                 Your team's <strong>{domain.name}</strong> capability is at <strong className="text-blue-600">{domain.org < 1.7 ? 'Foundational' : domain.org < 2.4 ? 'Proficient' : 'Advanced'}</strong> level. 
                                 {domain.variance < 0 
                                   ? ` You're ${Math.abs(domain.variance).toFixed(2)} points below the industry standard, indicating this is a priority development area.`
                                   : ` You're meeting or exceeding the benchmark—maintain these strengths while focusing resources on other domains.`
                                 }
                               </p>
                             </div>
                           </div>
                         </div>

                         <div className="relative h-10 bg-white rounded border border-gray-200">
                           <div className="absolute inset-0 flex">
                             <div className="flex-1 border-r border-gray-200"></div>
                             <div className="flex-1 border-r border-gray-200"></div>
                             <div className="flex-1"></div>
                           </div>

                           <div 
                             className="absolute top-0 bottom-0 w-0.5 bg-[#FFED00]"
                             style={{ left: `${(domain.benchmark / 3) * 100}%` }}
                           />

                           <div 
                             className="absolute top-0 bottom-0 left-0 rounded bg-[#00A3E0]/20"
                             style={{ 
                               width: `${(domain.org / 3) * 100}%`
                             }}
                           />

                           <div 
                             className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                             style={{ left: `${(domain.org / 3) * 100}%` }}
                           >
                             <div className="w-5 h-5 rounded-full bg-[#00A3E0] border-2 border-white shadow-md" />
                           </div>
                         </div>

                         <div className="flex justify-between text-xs text-gray-500">
                           <span>1.0<br/>Foundational</span>
                           <span>2.0<br/>Proficient</span>
                           <span>3.0<br/>Advanced</span>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </motion.div>
               );
             })}
           </motion.div>


         </div>
       )}

      {selectedBenchmark === 'similar' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* AI Insight First */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border-2 border-[#00A3E0]"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-[#00A3E0]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#3D3D3D]">Peer Insights</h3>
                </div>
                {onChatOpen && (
                  <Button
                    onClick={() => onChatOpen('benchmarking')}
                    variant="ghost"
                    size="sm"
                    className="text-[#00A3E0] hover:bg-[#00A3E0]/10 text-xs gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Chat with AI
                  </Button>
                )}
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    You're performing <strong>above the average</strong> among organizations with similar profiles (hospital size, geography, setting). This indicates solid foundational capability and effective quality management infrastructure.
                  </p>
                  <p>
                    However, there's a <strong>{(1.95 - data.organizationalScore).toFixed(2)}-point variance</strong> between your current performance and top-performing organizations. This represents significant opportunity for capability advancement through focused development.
                  </p>
                </div>
              </div>
              </motion.div>

          <motion.div className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <h3 className="text-sm font-bold text-[#3D3D3D] mb-8 uppercase tracking-wider">Your Organization vs Peer Groups</h3>

            <div className="space-y-6">
              {[
                { name: 'Your Organization', score: data.organizationalScore, color: '#00A3E0', position: 'Your Score' },
                { name: 'Peer Average', score: 1.65, color: '#9CA3AF', position: 'Similar Organizations' },
                { name: 'Top Performers', score: 1.95, color: '#10B981', position: 'Top 25% of Peers' }
              ].map((org, idx) => (
                <div key={org.name}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-[#3D3D3D]">{org.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{org.position}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold" style={{ color: org.color }}>{org.score.toFixed(2)}</span>
                      <span className="text-gray-400 text-sm">/3.0</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                       width: `${(org.score / 3) * 100}%`,
                       backgroundColor: org.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance vs Peers */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border-2 border-gray-200 p-8"
          >
            <h3 className="text-sm font-bold text-[#3D3D3D] mb-6 uppercase tracking-wider">How You Compare</h3>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-2">vs Peer Average</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-[#00A3E0]">{data.organizationalScore > 1.65 ? '+' : ''}{(data.organizationalScore - 1.65).toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Above average</strong> among similar organizations
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-semibold mb-2">vs Top Performers</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-[#F68B1F]">{(1.95 - data.organizationalScore).toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-700">
                  Variance to top 25% of peers
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-semibold mb-2">Positioning</p>
                <div className="mb-2">
                  <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-[#00A3E0]/10 text-[#00A3E0]">
                    Middle Tier
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Growth opportunity exists
                </p>
              </div>
            </div>
          </motion.div>


        </motion.div>
      )}

      {selectedBenchmark === 'hospital_compare' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* AI Insight */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border-2 border-[#00A3E0]"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-[#00A3E0]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#3D3D3D]">Hospital Comparison Insights</h3>
                </div>
                {onChatOpen && (
                  <Button
                    onClick={() => onChatOpen('benchmarking')}
                    variant="ghost"
                    size="sm"
                    className="text-[#00A3E0] hover:bg-[#00A3E0]/10 text-xs gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Chat with AI
                  </Button>
                )}
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Memorial Hospital</strong> leads with a score of <strong className="text-[#00A3E0]">1.92</strong>, performing above the National Benchmark in Quality Leadership. 
                  <strong> Community General</strong> shows the largest variance at <strong className="text-[#F68B1F]">-0.46 points</strong>, indicating priority development needs.
                </p>
                <p>
                  <strong>Key Insight:</strong> Performance variation across hospitals suggests opportunity for knowledge sharing and standardized training programs. Consider cross-hospital mentorship between high and developing performers.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hospital Selection */}
          <motion.div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-sm font-bold text-[#3D3D3D] mb-4 uppercase tracking-wider">Select Hospitals to Compare</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {SAMPLE_HOSPITALS.map((hospital) => (
                <button
                  key={hospital.id}
                  onClick={() => {
                    if (selectedHospitals.includes(hospital.id)) {
                      setSelectedHospitals(selectedHospitals.filter(id => id !== hospital.id));
                    } else {
                      setSelectedHospitals([...selectedHospitals, hospital.id]);
                    }
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedHospitals.includes(hospital.id)
                      ? 'border-[#00A3E0] bg-[#00A3E0]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold text-sm text-[#3D3D3D]">{hospital.name}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedHospitals.includes(hospital.id)
                        ? 'bg-[#00A3E0] border-[#00A3E0]'
                        : 'border-gray-300'
                    }`}>
                      {selectedHospitals.includes(hospital.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>Score: <strong className="text-[#00A3E0]">{hospital.score.toFixed(2)}</strong></span>
                    <span>•</span>
                    <span>{hospital.completion}% complete</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Select 2 or more hospitals to compare</p>
          </motion.div>

          {/* Comparison Overview */}
          {selectedHospitals.length >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border-2 border-gray-200 p-8"
            >
              <h3 className="text-sm font-bold text-[#3D3D3D] mb-6 uppercase tracking-wider">Overall Performance Comparison</h3>

              <div className="space-y-6">
                {selectedHospitals.map((hospitalId) => {
                  const hospital = SAMPLE_HOSPITALS.find(h => h.id === hospitalId);
                  const gapToBenchmark = 2.0 - hospital.score;

                  return (
                    <div key={hospital.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: hospital.color }}
                          />
                          <div>
                            <p className="font-semibold text-sm text-[#3D3D3D]">{hospital.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{hospital.participants} participants • {hospital.completion}% completion</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                         <div className="text-right">
                           <p className="text-xs text-gray-500 mb-1">HOSPITAL SCORE</p>
                           <p className="text-lg font-bold text-[#00A3E0]">{hospital.score.toFixed(2)}</p>
                         </div>
                         <div className="border-l border-gray-300 pl-4 text-right">
                           <p className="text-xs text-gray-500 mb-1">NATIONAL BENCHMARK</p>
                           <p className="text-lg font-bold text-[#3D3D3D]">2.0</p>
                         </div>
                         <div className="border-l border-gray-300 pl-4 text-right">
                           <p className="text-xs text-gray-500 mb-1">VARIANCE</p>
                           <p className={`text-lg font-bold ${gapToBenchmark > 0 ? 'text-[#F68B1F]' : 'text-[#10B981]'}`}>
                             {gapToBenchmark > 0 ? '-' : '+'}{Math.abs(gapToBenchmark).toFixed(2)}
                           </p>
                         </div>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-white rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${(hospital.score / 3) * 100}%`,
                            backgroundColor: hospital.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}


              </div>
            </motion.div>
          )}

          {/* Domain-Level Comparison */}
          {selectedHospitals.length >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-bold text-[#3D3D3D] uppercase tracking-wider">Domain-Level Comparison</h3>

              {HOSPITAL_DOMAIN_DATA[selectedHospitals[0]].map((domain, domainIdx) => {
                const isExpanded = expandedDomain === domain.name;

                return (
                  <motion.div
                    key={domain.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#00A3E0]/50 transition-all"
                  >
                    <button
                      onClick={() => setExpandedDomain(isExpanded ? null : domain.name)}
                      className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${domain.color}15` }}
                        >
                          {(() => {
                            const IconComponent = DOMAIN_ICONS[domain.name];
                            return IconComponent ? <IconComponent className="w-5 h-5" style={{ color: domain.color }} /> : null;
                          })()}
                        </div>
                        <p className="font-semibold text-sm text-[#3D3D3D]">{domain.name}</p>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 bg-gray-50 p-5"
                        >
                          <div className="space-y-4">
                            {selectedHospitals.map((hospitalId) => {
                              const hospital = SAMPLE_HOSPITALS.find(h => h.id === hospitalId);
                              const hospitalDomain = HOSPITAL_DOMAIN_DATA[hospitalId][domainIdx];
                              const gap = hospitalDomain.benchmark - hospitalDomain.score;

                              return (
                                <div key={hospitalId} className="bg-white rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-3 h-3 rounded-full"
                                      style={{ backgroundColor: hospital.color }}
                                    />
                                    <p className="text-sm font-semibold text-[#3D3D3D]">{hospital.name}</p>
                                  </div>
                                  <div className="flex gap-6">
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500">Hospital Score</p>
                                      <p className="text-base font-bold text-[#00A3E0]">{hospitalDomain.score.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500">Variance to Target</p>
                                      <p className={`text-base font-bold ${gap > 0 ? 'text-[#F68B1F]' : 'text-[#10B981]'}`}>
                                        {gap > 0 ? '-' : '+'}{Math.abs(gap).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                  </div>

                                  <div className="relative h-8 bg-gray-100 rounded">
                                    <div className="absolute inset-0 flex">
                                      <div className="flex-1 border-r border-gray-200"></div>
                                      <div className="flex-1 border-r border-gray-200"></div>
                                      <div className="flex-1"></div>
                                    </div>

                                    {/* NAHQ Benchmark */}
                                    <div 
                                      className="absolute top-0 bottom-0 w-0.5 bg-[#FFED00] z-10"
                                      style={{ left: `${(hospitalDomain.benchmark / 3) * 100}%` }}
                                    />

                                    {/* Health System Average */}
                                    <div 
                                      className="absolute top-0 bottom-0 w-0.5 bg-[#3D3D3D] z-10"
                                      style={{ left: `${(hospitalDomain.healthSystemAvg / 3) * 100}%` }}
                                    />

                                    <div 
                                      className="absolute top-0 bottom-0 left-0 rounded"
                                      style={{ 
                                        width: `${(hospitalDomain.score / 3) * 100}%`,
                                        backgroundColor: hospital.color,
                                        opacity: 0.3
                                      }}
                                    />

                                    <div 
                                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                                      style={{ left: `${(hospitalDomain.score / 3) * 100}%` }}
                                    >
                                      <div 
                                        className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                                        style={{ backgroundColor: hospital.color }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 text-xs pt-4 pb-2 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-[#FFED00]"></div>
                                <span className="text-gray-600">National Benchmark (2.0)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-0.5 bg-[#3D3D3D]"></div>
                                <span className="text-gray-600">Health System Avg</span>
                              </div>
                            </div>

                            {/* Competency-Level Comparison */}
                            <div className="pt-4 border-t border-gray-200">
                              <button
                                onClick={() => setExpandedCompetency(expandedCompetency === domain.name ? null : domain.name)}
                                className="w-full flex items-center justify-between text-left mb-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                              >
                                <div className="flex items-center gap-2">
                                  {expandedCompetency === domain.name ? <ChevronDown className="w-4 h-4 text-[#00A3E0]" /> : <ChevronRight className="w-4 h-4 text-[#00A3E0]" />}
                                  <p className="text-xs font-semibold text-[#3D3D3D] uppercase tracking-wide">View Competency-Level Breakdown</p>
                                </div>
                                <span className="text-xs text-gray-500 group-hover:text-[#00A3E0] transition-colors">
                                  {expandedCompetency === domain.name ? 'Hide' : 'Show'}
                                </span>
                              </button>

                              <AnimatePresence>
                                {expandedCompetency === domain.name && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                  >
                                    {HOSPITAL_DOMAIN_DATA[selectedHospitals[0]][domainIdx].competencies.map((competency, compIdx) => (
                                      <div key={competency.name} className="bg-white border border-gray-200 rounded-lg p-4">
                                        <p className="text-sm font-semibold text-[#3D3D3D] mb-3">{competency.name}</p>
                                        
                                        <div className="space-y-3">
                                          {selectedHospitals.map((hospitalId) => {
                                            const hospital = SAMPLE_HOSPITALS.find(h => h.id === hospitalId);
                                            const hospitalComp = HOSPITAL_DOMAIN_DATA[hospitalId][domainIdx].competencies[compIdx];
                                            const gap = hospitalComp.benchmark - hospitalComp.score;

                                            return (
                                              <div key={hospitalId}>
                                                <div className="flex items-center justify-between mb-2">
                                                  <div className="flex items-center gap-2">
                                                    <div 
                                                      className="w-2 h-2 rounded-full"
                                                      style={{ backgroundColor: hospital.color }}
                                                    />
                                                    <p className="text-xs text-gray-600">{hospital.name}</p>
                                                  </div>
                                                  <div className="flex items-center gap-4 text-xs">
                                                    <div>
                                                      <span className="text-gray-500 mr-1">Score:</span>
                                                      <span className="font-bold text-[#00A3E0]">{hospitalComp.score.toFixed(2)}</span>
                                                    </div>
                                                    <div>
                                                      <span className="text-gray-500 mr-1">Variance:</span>
                                                      <span className={`font-bold ${gap > 0 ? 'text-[#F68B1F]' : 'text-[#10B981]'}`}>
                                                        {gap > 0 ? '-' : '+'}{Math.abs(gap).toFixed(2)}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="relative h-2 bg-gray-100 rounded">
                                                  {/* NAHQ Benchmark */}
                                                  <div 
                                                    className="absolute top-0 bottom-0 w-0.5 bg-[#FFED00] z-10"
                                                    style={{ left: `${(hospitalComp.benchmark / 3) * 100}%` }}
                                                  />

                                                  {/* Health System Average */}
                                                  <div 
                                                    className="absolute top-0 bottom-0 w-0.5 bg-[#3D3D3D] z-10"
                                                    style={{ left: `${(hospitalComp.healthSystemAvg / 3) * 100}%` }}
                                                  />

                                                  <div 
                                                    className="absolute top-0 bottom-0 left-0 rounded"
                                                    style={{ 
                                                      width: `${(hospitalComp.score / 3) * 100}%`,
                                                      backgroundColor: hospital.color,
                                                      opacity: 0.5
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      )}
      </div>
      );
      }