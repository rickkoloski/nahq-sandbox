import React, { useState, useMemo } from 'react';
import { BarChart3, Users, Network, Settings, Globe, Shield, CheckSquare, ClipboardCheck, ChevronRight, TrendingUp, Target, BarChart2, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DomainCompetencyPanel from './DomainCompetencyPanel';
import { DOMAIN_ROWS, computeDomainSummary, COMPETENCY_DATA, ROLE_TARGETS } from '@/components/shared/workforceData';

const DOMAIN_ICONS = {
  'Professional Engagement': Users,
  'Quality Leadership and Integration': Network,
  'Performance and Process Improvement': Settings,
  'Population Health and Care Transitions': Globe,
  'Health Data Analytics': BarChart3,
  'Patient Safety': Shield,
  'Regulatory and Accreditation': CheckSquare,
  'Quality Review and Accountability': ClipboardCheck,
};


// KPI MetricCard (matches DomainDetail styling)
function MetricCard({ icon: Icon, label, value, sub, color = '#00A3E0', tooltip }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-5 relative">
      {tooltip && (
        <div className="absolute top-3 right-3">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            aria-label={`More information about ${label}`}
            className="text-gray-400 hover:text-[#00A3E0] transition-colors"
          >
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          {showTooltip && (
            <div role="tooltip" className="absolute right-0 top-full mt-2 z-30 w-60 bg-[#3D3D3D] text-white text-xs rounded-lg px-3 py-2.5 shadow-xl leading-relaxed pointer-events-none">
              {tooltip}
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#3D3D3D] rotate-45" aria-hidden="true" />
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
        </div>
        <p className="text-[10px] text-gray-600 uppercase tracking-wide font-medium leading-tight pr-5">{label}</p>
      </div>
      <p className="text-2xl font-bold text-[#3D3D3D]">{value}</p>
      {sub && <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// Compute average score and % not responsible for a domain
function computeDomainStats(domainName) {
  const competencies = COMPETENCY_DATA[domainName] || [];
  const userScores = {};

  competencies.forEach((comp) => {
    comp.users.forEach((u) => {
      if (!userScores[u.name]) userScores[u.name] = { ...u, scores: [] };
      userScores[u.name].scores.push(u.score);
    });
  });

  const userData = Object.values(userScores);
  if (!userData.length) return { avgScore: 0, distToNahq: 0, pctNotResponsible: 0, nahqStandard: 2.0 };

  // NAHQ standard = average role target across users in this domain
  const nahqStandard = userData.reduce((sum, u) => sum + (ROLE_TARGETS[u.role] || 2.0), 0) / userData.length;

  const avgScore = userData.reduce((sum, u) => {
    const avg = u.scores.reduce((a, b) => a + b, 0) / u.scores.length;
    return sum + avg;
  }, 0) / userData.length;

  const distToNahq = Math.max(0, nahqStandard - avgScore);

  const notResponsibleCount = userData.filter((u) => {
    const avg = u.scores.reduce((a, b) => a + b, 0) / u.scores.length;
    return avg < 1.5;
  }).length;

  const pctNotResponsible = Math.round((notResponsibleCount / userData.length) * 100);

  return { avgScore: Math.round(avgScore * 100) / 100, distToNahq: Math.round(distToNahq * 100) / 100, pctNotResponsible, nahqStandard: Math.round(nahqStandard * 100) / 100 };
}

// Horizontal bullet chart: filled bar = avg score, marker = NAHQ standard, scale 0–3
function BulletChart({ avgScore, nahqStandard, color }) {
  const max = 3;
  const fillPct = Math.min((avgScore / max) * 100, 100);
  const markerPct = Math.min((nahqStandard / max) * 100, 100);

  return (
    <div className="w-full">
      <div className="relative h-3 bg-gray-100 rounded-full overflow-visible" aria-hidden="true">
        {/* Filled bar = domain avg score */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${fillPct}%`, backgroundColor: color, opacity: 0.85 }}
        />
        {/* Vertical marker = NAHQ role standard */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#3D3D3D] rounded-full z-10"
          style={{ left: `${markerPct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1" aria-hidden="true">
        <div className="text-center">
          <div className="text-[9px] text-gray-600 font-semibold">0</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-600 font-semibold">1</div>
          <div className="text-[8px] text-gray-500 leading-tight">Foundational</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-600 font-semibold">2</div>
          <div className="text-[8px] text-gray-500 leading-tight">Proficient</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] text-gray-600 font-semibold">3</div>
          <div className="text-[8px] text-gray-500 leading-tight">Advanced</div>
        </div>
      </div>
    </div>
  );
}

function DomainRow({ domain }) {
  const navigate = useNavigate();
  const Icon = DOMAIN_ICONS[domain.name] || BarChart3;
  const { avgScore, distToNahq, pctNotResponsible, nahqStandard } = computeDomainStats(domain.name);

  const handleDomainClick = () => {
    navigate(createPageUrl(`DomainDetail?domain=${encodeURIComponent(domain.name)}`));
  };

  return (
    <button
      onClick={handleDomainClick}
      aria-label={`View ${domain.name} competency breakdown. Average score: ${avgScore.toFixed(2)}`}
      className="w-full border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all text-left group"
    >
      <div className="px-5 py-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${domain.color}18` }}>
              <Icon className="w-4 h-4" style={{ color: domain.color }} aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-[#3D3D3D] truncate">{domain.name}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#00A3E0] flex-shrink-0 transition-colors mt-0.5" aria-hidden="true" />
        </div>

        {/* Metrics row */}
        <div className="flex items-center gap-4 mb-3">
          <div>
            <p className="text-[9px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">Avg Results</p>
            <p className="text-lg font-bold text-[#3D3D3D] leading-none">{avgScore.toFixed(2)}</p>
          </div>
          <div className="w-px h-8 bg-gray-200 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-[9px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">Dist. to NAHQ</p>
            <p className="text-lg font-bold text-[#3D3D3D] leading-none">
              {distToNahq > 0 ? `-${distToNahq.toFixed(2)}` : '0.00'}
            </p>
          </div>
          <div className="w-px h-8 bg-gray-200 flex-shrink-0" aria-hidden="true" />
           <div>
             <p className="text-[9px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5">% Not Responsible</p>
             <p className="text-lg font-bold text-[#3D3D3D] leading-none">{pctNotResponsible}%</p>
           </div>
        </div>

        {/* Bullet chart */}
        <div aria-label={`Role Standard Bullet Chart: average score ${avgScore.toFixed(2)}, NAHQ standard ${nahqStandard.toFixed(1)}`}>
          <div className="flex justify-between text-[9px] text-gray-500 mb-1" aria-hidden="true">
            <span className="font-semibold uppercase tracking-wide">Role Standard Bullet Chart</span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: domain.color, opacity: 0.85 }} />
                Avg Score
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-0.5 h-3 bg-[#3D3D3D] rounded-full" />
                NAHQ National Average ({nahqStandard.toFixed(1)})
              </span>
            </span>
          </div>
          <BulletChart avgScore={avgScore} nahqStandard={nahqStandard} color={domain.color} />
        </div>
      </div>
    </button>
  );
}

// National benchmark: fixed illustrative value
const NATIONAL_BENCHMARK = 1.95;

export default function WorkforceExplorer({ data, onChatOpen }) {
  // Compute org-wide KPIs across all domains
  const orgKPIs = useMemo(() => {
    const userMap = {};
    Object.values(COMPETENCY_DATA).forEach(comps => {
      comps.forEach(comp => {
        comp.users.forEach(u => {
          if (!userMap[u.name]) userMap[u.name] = { ...u, scores: [], targets: [] };
          userMap[u.name].scores.push(u.score);
          userMap[u.name].targets.push(ROLE_TARGETS[u.role] || 2.0);
        });
      });
    });
    const users = Object.values(userMap);
    if (!users.length) return { avgScore: 0, avgTarget: 0, avgDist: 0 };
    const avgScore = users.reduce((s, u) => s + (u.scores.reduce((a, b) => a + b, 0) / u.scores.length), 0) / users.length;
    const avgTarget = users.reduce((s, u) => s + (u.targets.reduce((a, b) => a + b, 0) / u.targets.length), 0) / users.length;
    const avgDist = Math.max(0, avgTarget - avgScore);
    return {
      avgScore: parseFloat(avgScore.toFixed(2)),
      avgTarget: parseFloat(avgTarget.toFixed(2)),
      avgDist: parseFloat(avgDist.toFixed(2)),
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#3D3D3D]">Breakdown by Domain</h3>
          <p className="text-xs text-gray-600 mt-0.5">Click a domain card to view detailed competency breakdown</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DOMAIN_ROWS.map((domain) => <DomainRow key={domain.name} domain={domain} />)}
      </div>
    </div>
  );
}