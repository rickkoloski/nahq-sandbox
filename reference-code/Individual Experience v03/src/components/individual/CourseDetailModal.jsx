import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ExternalLink, Tag, BookOpen, Award, Users } from 'lucide-react';

export default function CourseDetailModal({ course, onClose }) {
  if (!course) return null;

  const FORMAT_COLORS = {
    'On-demand': { bg: '#EFF6FF', text: '#1D4ED8' },
    'Webinar':   { bg: '#F0FDF4', text: '#15803D' },
    'Guided':    { bg: '#FDF4FF', text: '#7E22CE' },
    'Learning Lab': { bg: '#FEF3C7', text: '#92400E' },
  };
  const fmtStyle = FORMAT_COLORS[course.format] || FORMAT_COLORS[course.content_type] || { bg: '#F3F4F6', text: '#6B7280' };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: fmtStyle.bg, color: fmtStyle.text }}>
                    {course.content_type || course.format}
                  </span>
                  {course.delivery && (
                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{course.delivery}</span>
                  )}
                </div>
                <h2 className="text-base font-bold text-[#3D3D3D] leading-snug">{course.title}</h2>
              </div>
              <button onClick={onClose} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            {/* Key meta grid */}
            <div className="grid grid-cols-2 gap-3">
              {course.hours && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Duration</p>
                    <p className="text-sm font-bold text-[#3D3D3D]">{course.hours}h</p>
                  </div>
                </div>
              )}
              {(course.member_price !== undefined || course.memberPrice !== undefined) && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                  <Award className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Member Price</p>
                    <p className="text-sm font-bold text-[#3D3D3D]">
                      {(course.member_price ?? course.memberPrice) === 0 ? 'Free' : `$${course.member_price ?? course.memberPrice}`}
                    </p>
                  </div>
                </div>
              )}
              {course.cphq_ce && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                  <BookOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">CPHQ CE</p>
                    <p className="text-sm font-bold text-[#3D3D3D]">{course.cphq_ce}</p>
                  </div>
                </div>
              )}
              {course.domain && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                  <Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Domain</p>
                    <p className="text-xs font-semibold text-[#3D3D3D] leading-tight">{course.domain}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Competency tag */}
            {course.competency_tag && (
              <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#00A3E0] mb-1">Competency Addressed</p>
                <p className="text-xs text-gray-700 font-medium">{course.competency_tag_desc || course.competency_tag}</p>
              </div>
            )}

            {/* Behaviors targeted */}
            {course.behaviors?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Skills You'll Build</p>
                <ul className="space-y-1.5">
                  {course.behaviors.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-[#00A3E0] font-bold mt-0.5 flex-shrink-0">·</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Membership access */}
            {course.catalog_type && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                <span>Available to: <span className="font-semibold text-[#3D3D3D]">{course.catalog_type}</span></span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#00A3E0] hover:bg-[#0086b8] rounded-xl py-2.5 transition-colors"
              onClick={onClose}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Go to Course
            </button>
            <button
              onClick={onClose}
              className="flex-1 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}