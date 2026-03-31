import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Network, Settings, Globe, BarChart3, Shield, CheckSquare, ClipboardCheck } from 'lucide-react';

const DOMAIN_ICONS = {
  'Professional Engagement': Users,
  'Quality Leadership & Integration': Network,
  'Performance & Process Improvement': Settings,
  'Population Health & Care Transitions': Globe,
  'Health Data Analytics': BarChart3,
  'Patient Safety': Shield,
  'Regulatory & Accreditation': CheckSquare,
  'Quality Review & Accountability': ClipboardCheck,
};

export default function DomainCard({ 
  name, 
  color, 
  score = null, 
  percentile = null, 
  level = null,
  isStrength = false,
  isGap = false,
  onClick,
  delay = 0,
  compact = false
}) {
  const Icon = DOMAIN_ICONS[name] || Users;
  
  const getLevelColor = (score) => {
    if (!score) return 'bg-gray-200';
    if (score >= 2.4) return 'bg-green-500';
    if (score >= 1.7) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className={`
        bg-white rounded-xl border border-gray-100 
        ${onClick ? 'cursor-pointer' : ''} 
        transition-all duration-300 overflow-hidden
        ${compact ? 'p-4' : 'p-5'}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div 
          className={`${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl flex items-center justify-center flex-shrink-0`}
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className={compact ? 'w-5 h-5' : 'w-6 h-6'} style={{ color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-[#3D3D3D] ${compact ? 'text-sm' : 'text-base'} leading-tight`}>
              {name}
            </h3>
            {isStrength && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                Strength
              </span>
            )}
            {isGap && (
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                Opportunity
              </span>
            )}
          </div>

          {score !== null && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg" style={{ color }}>
                  {score.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">
                  {level}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((score - 1) / 2) * 100}%` }}
                  transition={{ delay: delay * 0.1 + 0.3, duration: 0.6 }}
                  className={`h-full rounded-full ${getLevelColor(score)}`}
                />
              </div>

              {percentile !== null && (
                <p className="text-xs text-gray-500">
                  {percentile}th percentile
                </p>
              )}
            </div>
          )}

          {!score && onClick && (
            <div className="flex items-center gap-1 text-sm font-medium mt-2" style={{ color }}>
              Learn More
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}