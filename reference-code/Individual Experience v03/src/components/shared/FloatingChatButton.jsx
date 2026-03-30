import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function FloatingChatButton({ onClick, showPulse = true }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#009FE8] to-[#414042] text-white shadow-lg shadow-[#009FE8]/30 flex items-center justify-center group"
    >
      {showPulse && (
        <span className="absolute w-full h-full rounded-full bg-[#009FE8] animate-ping opacity-30" />
      )}
      <Sparkles className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-[#3D3D3D] text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with AI Guide
      </span>
    </motion.button>
  );
}