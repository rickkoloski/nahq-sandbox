import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CheckCircle, Loader2, Circle, Flag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const GENERATION_STEPS = [
  { id: 1, label: 'Analyzing your competency gaps', delay: 0 },
  { id: 2, label: 'Mapping to skill requirements', delay: 700 },
  { id: 3, label: 'Sequencing your learning pathway', delay: 1400 },
  { id: 4, label: 'Matching you with courses', delay: 2100 },
  { id: 5, label: 'Calculating time estimates', delay: 2800 }
];

export default function PlanGeneration() {
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
    }, 38);

    GENERATION_STEPS.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index > 0) {
          setCompletedSteps(prev => [...prev, GENERATION_STEPS[index - 1].id]);
        }
      }, step.delay);
    });

    setTimeout(() => {
      setCompletedSteps(prev => [...prev, GENERATION_STEPS[GENERATION_STEPS.length - 1].id]);
    }, 3500);

    setTimeout(() => {
      navigate(createPageUrl('Roadmap'));
    }, 4200);

    return () => clearInterval(progressInterval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[#FFED00] to-[#e6d600] flex items-center justify-center shadow-xl shadow-[#FFED00]/30"
        >
          <Flag className="w-10 h-10 text-[#3D3D3D]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-[#3D3D3D] mb-2"
        >
          Creating Your Development Plan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-10"
        >
          Building your personalized learning pathway...
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <Progress value={progress} className="h-3 bg-gray-100" />
          <p className="text-sm text-gray-500 mt-2">Building your roadmap... {progress}%</p>
        </motion.div>

        {/* Generation Steps */}
        <div className="space-y-4 text-left max-w-xs mx-auto">
          {GENERATION_STEPS.map((step, index) => {
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
                  <Loader2 className="w-5 h-5 text-[#FFED00] animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${isCompleted ? 'text-green-600' : isCurrent ? 'text-[#3D3D3D] font-medium' : 'text-gray-400'}`}>
                  {step.label}
                  {isCurrent && '...'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}