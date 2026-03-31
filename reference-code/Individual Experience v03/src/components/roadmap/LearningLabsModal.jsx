import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LearningLabsModal({ labs, onClose }) {
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#00A3E0]/5 to-transparent">
          <div>
            <h2 className="font-bold text-[#3D3D3D] text-lg">All Learning Labs</h2>
            <p className="text-xs text-gray-500">Live and on-demand sessions across all domains</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid md:grid-cols-2 gap-4">
            {labs.map((lab, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl border border-gray-100 hover:border-[#00A3E0]/30 hover:bg-[#00A3E0]/5 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${lab.color}15` }}
                  >
                    <Calendar className="w-5 h-5" style={{ color: lab.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={lab.type === 'Live' ? 'default' : 'outline'} 
                        className={`text-xs ${lab.type === 'Live' ? 'bg-red-100 text-red-700 border-red-200' : ''}`}
                      >
                        {lab.type}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm text-[#3D3D3D] mb-1">{lab.title}</h4>
                    <p className="text-xs text-gray-500 font-medium">{lab.domain}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{lab.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{lab.date}</span>
                  <span>•</span>
                  <span>{lab.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}