import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Clock, Target, RotateCw, Play, ChevronDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIPS = [
{
  icon: Target,
  title: 'Be Realistic, Not Idealistic',
  description: 'Answer based on your current activities, not what you aspire to be. This self-assessment is developmental, not evaluative.'
},
{
  icon: Lightbulb,
  title: "Can't Decide? Choose the Best Option.",
  description: 'There are no right or wrong answers. The assessment focused on your activities relative to the Framework. It is not a job review but rather a guide to create a custom upskill plan for you.'
},
{
  icon: Clock,
  title: 'Take Your Time',
  description: 'The assessment takes about 30 minutes. You can pause and resume at any time. We will save your progress automatically.'
},
{
  icon: RotateCw,
  title: 'Reflect Your Typical Activities',
  description: 'Base your responses on the activities you routinely perform in your role.'
}];


export default function AssessmentIntroModal({ isOpen, onClose, onContinue }) {
  const [videoStarted, setVideoStarted] = useState(false);

  const handlePlayClick = () => {
    setVideoStarted(true);
  };

  const handleClose = () => {
    setVideoStarted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 z-40" />
        

          {/* Modal */}
          <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-[#3D3D3D]">Before You Begin</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Watch the introduction video, then review the tips below
                  </p>
                </div>
                <button
                onClick={handleClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal">
                
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">

                  {/* Video Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Step 1 — Watch Introduction Video
                      </h3>
                      {videoStarted &&
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Watched
                        </span>
                    }
                    </div>

                    {!videoStarted ? (
                  /* Thumbnail / Play overlay */
                  <div
                    className="relative w-full rounded-xl overflow-hidden cursor-pointer group"
                    style={{ aspectRatio: '16/9' }}
                    onClick={handlePlayClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Play introduction video"
                    onKeyDown={(e) => {if (e.key === 'Enter' || e.key === ' ') handlePlayClick();}}>
                    
                        <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a395e7d11ca3f24d261e0b/1d9bd4b16_Framework_FINAL1.png"
                      alt="Introduction video thumbnail"
                      className="w-full h-full object-cover" />
                    
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center gap-3">
                          <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        
                            <Play className="w-6 h-6 text-[#00A3E0] fill-[#00A3E0] ml-0.5" />
                          </motion.div>
                          <span className="text-white text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
                            Click to play · 3 min
                          </span>
                        </div>

                        {/* "Required to proceed" badge */}
                        <div className="absolute top-3 right-3 bg-[#FFED00] text-[#3D3D3D] text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          Required to proceed
                        </div>
                      </div>) : (

                  /* Simulated video player */
                  <div
                    className="relative w-full rounded-xl overflow-hidden bg-gray-900 flex items-center justify-center"
                    style={{ aspectRatio: '16/9' }}>
                    
                        <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69a395e7d11ca3f24d261e0b/1d9bd4b16_Framework_FINAL1.png"
                      alt="Video playing"
                      className="w-full h-full object-cover opacity-60" />
                    
                        {/* Fake playback bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2 flex items-center gap-3">
                          <div className="w-3 h-3 rounded-sm bg-white flex-shrink-0" aria-hidden="true" />
                          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                            <motion.div
                          className="h-full bg-[#00A3E0] rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '35%' }}
                          transition={{ duration: 2, ease: 'linear' }} />
                        
                          </div>
                          <span className="text-white text-xs font-mono flex-shrink-0">1:03 / 3:00</span>
                        </div>
                      </div>)
                  }
                  </div>

                  {/* Scroll hint arrow — only visible before video is watched */}
                  {!videoStarted &&
                <motion.div
                  className="flex flex-col items-center gap-1 py-1"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>
                  
                      <span className="text-xs text-gray-400">Scroll down to see tips</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                }

                  {/* Tips Section */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Step 2 — Review Assessment Tips
                      </h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {TIPS.map((tip, i) => {
                      const Icon = tip.icon;
                      return (
                        <div
                          key={i}
                          className="flex gap-3 p-4 rounded-lg bg-gradient-to-br from-[#00A3E0]/8 to-[#00A3E0]/4 border border-[#00A3E0]/20">
                          
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#00A3E0]/20">
                                <Icon aria-hidden="true" className="w-5 h-5 text-[#00A3E0]" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#3D3D3D]">{tip.title}</p>
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{tip.description}</p>
                            </div>
                          </div>);

                    })}
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer CTA */}
              <div className="flex flex-col gap-2 p-6 border-t border-gray-100 flex-shrink-0">
                



              
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Back
                  </Button>
                  <Button
                  onClick={onContinue}
                  disabled={!videoStarted}
                  className="flex-1 bg-[#00A3E0] hover:bg-[#0087bd] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                  
                    {videoStarted ? 'Start Assessment →' : 'Watch Video to Continue'}
                  </Button>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}