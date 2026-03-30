import React from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function PeerComparisonModal({ results, onClose }) {
  const getLevelColor = (percentile) => {
    if (percentile >= 70) return 'text-green-600';
    if (percentile >= 40) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getTrendIcon = (percentile) => {
    if (percentile >= 60) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (percentile >= 40) return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-orange-500" />;
  };

  const getBarColor = (percentile) => {
    if (percentile >= 70) return 'bg-green-500';
    if (percentile >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#00A3E0]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A3E0]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#00A3E0]" />
            </div>
            <div>
              <h2 className="font-bold text-[#3D3D3D]">Peer Comparison</h2>
              <p className="text-xs text-gray-500">How you compare to other quality professionals</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Overall Summary */}
          <div className="bg-gradient-to-br from-[#00A3E0]/5 to-[#00B5E2]/10 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#3D3D3D]">Your Overall Ranking</h3>
                <p className="text-sm text-gray-500">Compared to all quality professionals</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-[#00A3E0]">{results.percentile}th</span>
                <p className="text-sm text-gray-500">percentile</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Your overall profile is <strong>stronger than {results.percentile}% of peers</strong>. 
              Most professionals at your career stage (Director level, 8+ years) have similar profiles—strong in leadership, developing in technical analytics.
            </p>
            <p className="text-xs text-gray-500">
              Based on 2,847 professionals in the benchmark pool
            </p>
          </div>

          {/* Domain Comparisons */}
          <h3 className="font-semibold text-[#3D3D3D] mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00A3E0]" />
            Domain-by-Domain Comparison
          </h3>

          <div className="space-y-4">
            {results.domains
              .sort((a, b) => b.percentile - a.percentile)
              .map((domain, index) => (
                <motion.div
                  key={domain.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: domain.color }}
                      />
                      <span className="font-medium text-[#3D3D3D] text-sm">{domain.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(domain.percentile)}
                      <span className={`font-bold ${getLevelColor(domain.percentile)}`}>
                        {domain.percentile}th
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${domain.percentile}%` }}
                      transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                      className={`absolute left-0 top-0 h-full rounded-full ${getBarColor(domain.percentile)}`}
                    />
                    {/* Median marker */}
                    <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-400" />
                  </div>
                  
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>0th</span>
                    <span>50th (median)</span>
                    <span>100th</span>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* Insights */}
          <div className="mt-6 p-4 bg-[#FFED00]/10 rounded-xl border border-[#FFED00]/20">
            <h4 className="font-semibold text-[#3D3D3D] mb-2">Key Insights</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                You're in the <strong>top quartile</strong> for Quality Leadership & Integration
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                Patient Safety and Regulatory scores are <strong>above average</strong>
              </li>
              <li className="flex items-start gap-2">
                <TrendingDown className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                Health Data Analytics represents your biggest <strong>opportunity for growth</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}