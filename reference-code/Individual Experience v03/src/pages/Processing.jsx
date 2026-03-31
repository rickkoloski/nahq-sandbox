import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, Loader2, Circle } from 'lucide-react';

const PROCESSING_STEPS = [
  { id: 1, label: 'Analyzing Your Profile', delay: 0 },
  { id: 2, label: 'Calculating Domain Scores', delay: 800 },
  { id: 3, label: 'Generating Personalized Insights', delay: 1600 },
  { id: 4, label: 'Creating Your Development Roadmap', delay: 2400 }
];

export default function Processing() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 35);

    PROCESSING_STEPS.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index > 0) {
          setCompletedSteps(prev => [...prev, PROCESSING_STEPS[index - 1].id]);
        }
      }, step.delay);
    });

    setTimeout(() => {
      setCompletedSteps(prev => [...prev, PROCESSING_STEPS[PROCESSING_STEPS.length - 1].id]);
    }, 3200);

    setTimeout(() => {
      navigate(createPageUrl('IndividualDashboard'));
    }, 4000);

    return () => clearInterval(progressInterval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {/* Completion Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center shadow-xl shadow-[#00A3E0]/30"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-[#3D3D3D] mb-2"
        >
          Assessment Complete!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-10"
        >
          Please wait while we analyze your results...
        </motion.p>

        {/* Progress Circle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative w-32 h-32 mx-auto mb-10"
        >
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="#00A3E0"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 352" }}
              animate={{ strokeDasharray: `${progress * 3.52} 352` }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-[#3D3D3D]">{progress}%</span>
          </div>
        </motion.div>

        {/* Processing Steps */}
        <div className="space-y-4 text-left max-w-xs mx-auto">
          {PROCESSING_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === index && !isCompleted;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: step.delay / 1000 + 0.5 }}
                className="flex items-center gap-3"
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-[#00A3E0] animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${isCompleted ? 'text-green-600' : isCurrent ? 'text-[#00A3E0]' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Processing message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-400 mt-8"
        >
          Processing... {progress}%
        </motion.p>
      </motion.div>
    </div>
  );
}