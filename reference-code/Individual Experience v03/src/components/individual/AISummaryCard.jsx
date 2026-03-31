import React, { useState } from 'react';
import { Sparkles, ChevronDown, TrendingUp, Target, ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function AISummaryCard({ text, ctaLabel, ctaHref, context }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState(text);

  const generateAISummary = async () => {
    if (!context) return text;
    const { competency, domain, currentLevel, percentile, roleTarget, gap, peerGroup, currentBehaviors, nextBehaviors } = context;
    const prompt = `You are a professional development coach specializing in healthcare quality leadership. Generate a personalized 4-section development summary. Each section should be 1-2 sentences maximum.

COMPETENCY: ${competency}
DOMAIN: ${domain}
CURRENT LEVEL: ${currentLevel}/3
PERCENTILE: ${percentile}th percentile among ${peerGroup}
ROLE TARGET: ${roleTarget}/3
DEVELOPMENT GAP: ${gap != null ? gap.toFixed(2) : 'N/A'} levels
CURRENT BEHAVIORS: ${currentBehaviors?.slice(0, 2).join(', ') || 'foundational practices'}
NEXT-LEVEL BEHAVIORS: ${nextBehaviors?.slice(0, 2).join(', ') || 'advanced practices'}

Write exactly 4 sections separated by |||:

WHERE_YOU_ARE: A brief 1-sentence statement of their current level (${currentLevel}/3) and percentile (${percentile}th). Be positive.

WHERE_YOU'RE_HEADING: One sentence stating the role target (${roleTarget}/3) and the gap (${gap != null ? gap.toFixed(2) : 'N/A'} levels). Use "Growing into" or "Building toward".

THE_SHIFT: One sentence contrasting current vs. next behaviors. Current: ${currentBehaviors?.slice(0, 1).join(', ')} → Next: ${nextBehaviors?.slice(0, 1).join(', ')}

NEXT_STEP: One sentence explaining why this matters and suggest a concrete action.

TONE: Use "Growing into", "Building toward", "Strengthen", "Advance your impact"
AVOID: "deficient", "behind", "underperforming"
Be concise and actionable.`;

    const response = await base44.integrations.Core.InvokeLLM({ prompt });
    return typeof response === 'string' ? response : response?.data || text;
  };

  const renderSections = (rawText) => {
    const sections = rawText.split('|||').map(s => s.trim());
    const icons = [TrendingUp, Target, ArrowRight, Lightbulb];
    const labels = ['Where You Are', "Where You're Heading", 'The Shift', 'Next Step'];
    return sections.slice(0, 4).map((section, i) => {
      const Icon = icons[i];
      const cleanText = section.replace(/^[A-Z_]+:\s*/, '').trim();
      return (
        <div key={i} className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Icon aria-hidden="true" className="w-4 h-4 text-[#00A3E0]" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-1">{labels[i]}</p>
            <p className="text-sm leading-relaxed text-gray-700">{cleanText}</p>
          </div>
        </div>
      );
    });
  };

  const handleToggle = async () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setIsLoading(true);
      const summary = await generateAISummary();
      setGeneratedText(summary);
      setIsLoading(false);
    } else {
      setIsExpanded(false);
    }
  };

  return (
    <div
      className="relative"
      style={{
        background: 'white',
        border: '1px solid rgba(0, 163, 224, 0.3)',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(0, 163, 224, 0.15), inset 0 0 20px rgba(0, 163, 224, 0.05)',
      }}
    >
      {/* Announce loading state to screen readers */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isLoading ? 'Generating AI summary, please wait.' : isExpanded && !isLoading ? 'AI summary ready.' : ''}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls="ai-summary-content"
        className="w-full text-left p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-2 rounded-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden="true" className="w-4 h-4 text-[#00A3E0]" />
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#00A3E0]">AI Summary</p>
            <span className="text-[10px] font-semibold text-[#00A3E0] bg-[#E0F2FE] px-2 py-0.5 rounded">AI Generated</span>
          </div>
          <ChevronDown
            aria-hidden="true"
            className="w-4 h-4 text-gray-500 transition-transform"
            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>

        {!isExpanded && (
          <p className="text-xs text-gray-600 leading-relaxed mt-2">Click to generate AI insights</p>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="ai-summary-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-5"
          >
            {isLoading ? (
              <div className="flex items-center gap-2" aria-hidden="true">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#00A3E0] rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-[#00A3E0] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-[#00A3E0] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
                <p className="text-sm text-gray-600">Generating…</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 text-sm text-gray-700">
                  {renderSections(generatedText)}
                </div>
                {ctaLabel && ctaHref && (
                  <Link
                    to={ctaHref}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#00A3E0] hover:underline mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A3E0] focus-visible:ring-offset-1 rounded"
                  >
                    {ctaLabel} <ArrowRight aria-hidden="true" className="w-3 h-3" />
                  </Link>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}