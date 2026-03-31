import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, MessageCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { COMPETENCY_DATA, ROLE_TARGETS, DOMAIN_ROWS } from '@/components/shared/workforceData';

function buildDataSummary() {
  const domainStats = DOMAIN_ROWS.map((domain) => {
    const competencies = COMPETENCY_DATA[domain.name] || [];
    const userScores = {};
    competencies.forEach((comp) => {
      comp.users.forEach((u) => {
        if (!userScores[u.name]) userScores[u.name] = { ...u, scores: [] };
        userScores[u.name].scores.push(u.score);
      });
    });
    const userData = Object.values(userScores);
    if (!userData.length) return null;
    const nahqStandard = userData.reduce((sum, u) => sum + (ROLE_TARGETS[u.role] || 2.0), 0) / userData.length;
    const avgScore = userData.reduce((sum, u) => {
      const avg = u.scores.reduce((a, b) => a + b, 0) / u.scores.length;
      return sum + avg;
    }, 0) / userData.length;
    const distToNahq = Math.max(0, nahqStandard - avgScore);
    const advancedCount = userData.filter((u) => {
      const avg = u.scores.reduce((a, b) => a + b, 0) / u.scores.length;
      return avg >= 2.75;
    }).length;
    const pctAdvanced = Math.round((advancedCount / userData.length) * 100);
    return {
      domain: domain.name,
      avgScore: avgScore.toFixed(2),
      nahqStandard: nahqStandard.toFixed(2),
      distToNahq: distToNahq.toFixed(2),
      pctAdvanced,
      totalUsers: userData.length,
    };
  }).filter(Boolean);

  return domainStats;
}

export default function WorkforceInsightsSummary({ onChatOpen }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fetched, setFetched] = useState(false);

  const handleExpand = () => {
    if (!expanded && !fetched) {
      setLoading(true);
      setFetched(true);
      const stats = buildDataSummary();
      const prompt = `You are a senior healthcare quality workforce strategist writing for a C-suite executive audience.

Using the domain-level self-assessment data below, write an executive summary as exactly 4–5 concise bullet points.

Guidelines:
- Each bullet should be one crisp sentence (max 30 words) capturing a distinct insight.
- Focus on patterns, contrasts, and capability composition across domains — not individual scores.
- Avoid repeating specific numeric values already visible in the dashboard. Use relative language (e.g., "highest leadership density," "narrowest gap to standard," "most evenly distributed").
- Do not use alarmist, evaluative, or prescriptive language. No "critical gaps," "alarming," "must," or recommendations.
- Frame insights around: where capability strength is concentrated, how leadership density varies, and which domains show closest or widest alignment to role standards.
- Start each bullet with a short bold label (2–4 words) followed by a colon, then the insight. Example format: **Capability Strength:** Quality Leadership and Regulatory domains show the highest concentration of advanced proficiency across all roles.
- Output ONLY the bullet lines, one per line, each starting with "- **Label:** Insight text."

Data (JSON):
${JSON.stringify(stats, null, 2)}`;

      base44.integrations.Core.InvokeLLM({ prompt })
        .then((res) => { setSummary(typeof res === 'string' ? res : res?.text || ''); })
        .catch(() => setSummary('Unable to generate summary at this time.'))
        .finally(() => setLoading(false));
    }
    setExpanded(v => !v);
  };

  return (
    <div
      onClick={handleExpand}
      className="bg-white border border-[#009FE8]/30 rounded-xl shadow-sm overflow-hidden mb-6 cursor-pointer transition-all duration-300 hover:border-[#009FE8]/60 hover:shadow-[0_0_12px_2px_rgba(0,159,232,0.15)]"
      style={{ animation: 'aiCardPulse 4s ease-in-out infinite' }}
    >
      <style>{`
        @keyframes aiCardPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,159,232,0); }
          50% { box-shadow: 0 0 10px 3px rgba(0,159,232,0.18); }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#00A3E0]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#3D3D3D]">AI Workforce Insights Summary</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#00A3E0] bg-[#00A3E0]/8 px-2 py-0.5 rounded-full">AI Generated</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {expanded ? 'Executive-level narrative based on current domain data' : 'Click to generate AI insights'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          {onChatOpen && !loading && summary && expanded && (
            <Button
              onClick={() => onChatOpen('workforce-insights', summary)}
              variant="outline"
              size="sm"
              className="border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/5 text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Discuss Insights
            </Button>
          )}
          <button
            onClick={handleExpand}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-6 py-5">
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-gray-400">Generating insights…</span>
            </div>
          ) : (
            <ul className="space-y-3 pl-2">
              {summary.split(/\n+/).filter(p => p.trim()).map((line, i) => {
                const clean = line.replace(/^[-•*]\s*/, '').trim();
                const match = clean.match(/^\*\*(.+?)\*\*[:\s]+(.*)/);
                const label = match ? match[1] : null;
                const text = match ? match[2] : clean;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5 text-[#00A3E0]" />
                    </div>
                    <p className="text-sm text-gray-700 leading-6">
                      {label ? (
                        <><span className="font-semibold text-[#3D3D3D]">{label}:</span> {text}</>
                      ) : text}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 italic">This summary describes observed data patterns only and does not constitute recommendations.</p>
          </div>
        </div>
      )}
    </div>
  );
}