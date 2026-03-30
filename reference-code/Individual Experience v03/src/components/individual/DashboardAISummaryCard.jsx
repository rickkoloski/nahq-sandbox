import React, { useState } from 'react';
import { Sparkles, ChevronDown, TrendingUp, Target, BarChart3, Lightbulb, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function DashboardAISummaryCard({ context, ctaLabel, ctaHref, onDiscuss }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState(null);

  const generateAISummary = async () => {
    const { avgScore, growthPriorities, avgGap, roleTarget, domainProfile } = context;

    const domainSummary = domainProfile
      .map(d => `${d.name}: ${d.avgLevel.toFixed(1)}/3 (target: ${d.roleTarget})`)
      .join(', ');

    const prompt = `You are a professional development coach specializing in healthcare quality leadership. Generate a concise 4-section workforce insights summary for an individual's overall assessment. Each section must be 1 sentence maximum.

OVERALL SCORE: ${avgScore}/3.0
ROLE TARGET: ${roleTarget}
COMPETENCIES BELOW TARGET: ${growthPriorities}
AVG GAP TO TARGET: ${avgGap}
DOMAIN BREAKDOWN: ${domainSummary}

Write exactly 4 sections separated by |||:

OVERALL_STANDING: One positive sentence summarizing their overall score of ${avgScore}/3 across the framework.

KEY_GAPS: One sentence naming the number of competencies (${growthPriorities}) below the NAHQ Standard Role Target and the average gap (${avgGap}).

STRONGEST_AREA: One sentence identifying a strength area from the domain breakdown above.

NEXT_STEP: One actionable sentence recommending a concrete next step to begin closing the gaps.

TONE: Positive, coaching, developmental. Use "Growing into", "Building toward", "Strengthen".
AVOID: "deficient", "behind", "underperforming". Be concise.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });
      return typeof response === 'string' ? response : response?.data || '';
    } catch (error) {
      console.error('AI generation failed:', error);
      return '';
    }
  };

  const renderSections = (text) => {
    const sections = text.split('|||').map(s => s.trim());
    const icons = [BarChart3, Target, TrendingUp, Lightbulb];
    const labels = ['Overall Standing', 'Key Gaps', 'Strongest Area', 'Next Step'];

    return sections.slice(0, 4).map((section, i) => {
      const Icon = icons[i];
      const cleanText = section.replace(/^[A-Z_]+:\s*/, '').trim();
      return (
        <div key={i} className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Icon className="w-4 h-4 text-[#00A3E0]" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{labels[i]}</p>
            <p className="text-sm leading-relaxed text-gray-700">{cleanText}</p>
          </div>
        </div>
      );
    });
  };

  const handleExpand = async () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setIsLoading(true);
      try {
        const summary = await generateAISummary();
        setGeneratedText(summary);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative">
      <style>{`
        .dashboard-ai-glow {
          background: white;
          border: 1px solid rgba(0, 163, 224, 0.35);
          border-radius: 12px;
          box-shadow: 0 0 24px rgba(0, 163, 224, 0.18), 0 0 8px rgba(0, 163, 224, 0.1);
          transition: box-shadow 0.2s;
        }
        .dashboard-ai-glow:hover {
          box-shadow: 0 0 32px rgba(0, 163, 224, 0.28), 0 0 12px rgba(0, 163, 224, 0.15);
        }
      `}</style>

      <div className="dashboard-ai-glow p-5 cursor-pointer" onClick={handleExpand}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#00A3E0]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-[#3D3D3D]">AI Insights Summary</p>
                <span className="text-[10px] font-bold text-[#00A3E0] bg-[#E0F2FE] px-2 py-0.5 rounded tracking-wide">AI GENERATED</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">Personalized narrative based on your competency assessment results</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isExpanded && !isLoading && generatedText && (
              <button
                onClick={(e) => { e.stopPropagation(); onDiscuss && onDiscuss(); }}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00A3E0] border border-[#00A3E0] rounded-lg px-3 py-1.5 hover:bg-[#E0F2FE] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Discuss Insights
              </button>
            )}
            <ChevronDown
              className="w-4 h-4 text-gray-400 transition-transform"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>
        </div>

        {!isExpanded && (
          <p className="text-xs text-gray-400 mt-1.5 ml-9">Click to generate AI insights</p>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 ml-9">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#00A3E0] rounded-full animate-pulse" />
                    <div className="w-1.5 h-1.5 bg-[#00A3E0] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 bg-[#00A3E0] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <p className="text-sm text-gray-500">Generating<span className="animate-pulse">...</span></p>
                </div>
              ) : generatedText ? (
                <>
                  <div className="space-y-4 ml-9">
                    {renderSections(generatedText)}
                  </div>
                  {ctaLabel && ctaHref && (
                    <Link to={ctaHref} className="inline-flex items-center gap-1 text-xs font-semibold text-[#00A3E0] hover:underline mt-4 ml-9">
                      {ctaLabel} →
                    </Link>
                  )}
                  <p className="text-[11px] text-gray-400 italic mt-4 pt-3 border-t border-gray-100 ml-9">
                    This summary describes observed data patterns only and does not constitute recommendations.
                  </p>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}