import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Lock, Play, Eye, Video, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CourseCard({
  title,
  duration,
  modules,
  format = 'Self-paced',
  level,
  status = 'available', // 'available', 'locked', 'in_progress', 'completed'
  progress = 0,
  unlockDate,
  isWorkshop = false,
  date,
  onClick,
  delay = 0,
  compact = false
}) {
  const StatusIcon = {
    available: BookOpen,
    locked: Lock,
    in_progress: Play,
    completed: CheckCircle,
  }[status];

  const statusColors = {
    available: 'border-[#00A3E0]',
    locked: 'border-gray-200 opacity-75',
    in_progress: 'border-[#8BC53F]',
    completed: 'border-green-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
      whileHover={status !== 'locked' ? { y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } : {}}
      className={`
        bg-white rounded-xl border-2 ${statusColors[status]}
        ${status !== 'locked' ? 'cursor-pointer' : ''} 
        transition-all duration-300 overflow-hidden
        ${compact ? 'p-4' : 'p-5'}
      `}
      onClick={status !== 'locked' ? onClick : undefined}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`
          ${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl flex items-center justify-center flex-shrink-0
          ${status === 'completed' ? 'bg-green-100' : status === 'in_progress' ? 'bg-[#8BC53F]/10' : status === 'locked' ? 'bg-gray-100' : 'bg-[#00A3E0]/10'}
        `}>
          {isWorkshop ? (
            <Video className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} ${status === 'locked' ? 'text-gray-400' : 'text-[#00A3E0]'}`} />
          ) : (
            <StatusIcon className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} ${
              status === 'completed' ? 'text-green-600' : 
              status === 'in_progress' ? 'text-[#8BC53F]' : 
              status === 'locked' ? 'text-gray-400' : 'text-[#00A3E0]'
            }`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-[#3D3D3D] ${compact ? 'text-sm' : 'text-base'} leading-tight mb-2`}>
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {duration}
            </span>
            <span>•</span>
            <span>{format}</span>
            {modules && (
              <>
                <span>•</span>
                <span>{modules} modules</span>
              </>
            )}
            {date && (
              <>
                <span>•</span>
                <span>{date}</span>
              </>
            )}
          </div>

          {/* Progress bar for in-progress */}
          {status === 'in_progress' && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{progress}% complete</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full bg-[#8BC53F]"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          {status === 'available' && (
            <Button size="sm" className="bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold">
              Start Course
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          
          {status === 'in_progress' && (
            <Button size="sm" className="bg-[#8BC53F] hover:bg-[#7ab635] text-white font-semibold">
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          
          {status === 'locked' && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              {unlockDate ? `Unlocks: ${unlockDate}` : 'Complete prerequisite first'}
            </div>
          )}
          
          {status === 'completed' && (
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <CheckCircle className="w-4 h-4" />
              Completed
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}