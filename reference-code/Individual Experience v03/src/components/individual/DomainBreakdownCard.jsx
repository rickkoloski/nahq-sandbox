import React from 'react';
import { ChevronRight, Settings2, BarChart3, Globe, Award, ShieldAlert, FileCheck, Users, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { COMPETENCIES } from '@/components/individual/individualMockData';

const DOMAIN_ICONS = {
  'quality-leadership':      Award,
  'patient-safety':          ShieldAlert,
  'performance-improvement': Settings2,
  'health-data-analytics':   BarChart3,
  'regulatory-accreditation':FileCheck,
  'population-health':       Globe,
  'healthcare-technology':   Cpu,
  'professional-engagement': Users,
};

export default function DomainBreakdownCard({ domain }) {
  const { slug, name, color, avgLevel, roleTarget } = domain;
  const Icon = DOMAIN_ICONS[slug] || Award;

  const domainComps = COMPETENCIES.filter(c => c.domainSlug === slug);
  const belowTarget = domainComps.filter(c => c.currentLevel < roleTarget).length;
  const totalComps = domainComps.length;
  const distToNahq = parseFloat((avgLevel - roleTarget).toFixed(2));

  const barPct    = (avgLevel / 3) * 100;
  const markerPct = (roleTarget / 3) * 100;

  const distLabel = distToNahq > 0 ? `+${distToNahq.toFixed(2)}` : distToNahq.toFixed(2);
  const distColor = distToNahq < 0 ? '#DC2626' : '#059669';

  return (
    <Link
      to={createPageUrl(`IndividualDomainDetail?domain=${slug}`)}
      aria-label={`${name} domain — average score ${avgLevel.toFixed(2)}, ${belowTarget} of ${totalComps} competencies below target. View details.`}
      className="block group"
    >
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${color}18` }}
            >
              <Icon aria-hidden="true" className="w-4 h-4" style={{ color }} />
            </div>
            <p className="text-sm font-bold text-[#3D3D3D] leading-snug">{name}</p>
          </div>
          <ChevronRight aria-hidden="true" className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: 'Avg Results', value: avgLevel.toFixed(2), valueColor: '#3D3D3D' },
            { label: 'Dist. to NAHQ National Avg', value: distLabel, valueColor: distColor },
            { label: 'Competencies Below Target', value: `${belowTarget} of ${totalComps}`, valueColor: '#3D3D3D' },
          ].map(({ label, value, valueColor }) => (
            <div key={label} className="flex flex-col">
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide leading-tight min-h-[28px] flex items-start">{label}</p>
              <p className="text-xl font-bold leading-none" style={{ color: valueColor }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Bullet chart label + legend */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Role Standard Bullet Chart</p>
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="flex items-center gap-1 text-[10px] text-gray-600">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
              Avg Score
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-600">
              <span className="w-3 h-px inline-block bg-gray-500" />
              National Avg ({roleTarget})
            </span>
          </div>
        </div>

        {/* Bar track — with text alternative for AT */}
        <div
          role="img"
          aria-label={`Bullet chart: average score ${avgLevel.toFixed(2)} out of 3, NAHQ standard is ${roleTarget}`}
          className="relative h-3 bg-gray-100 rounded-full"
        >
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ width: `${barPct}%`, backgroundColor: color }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 w-0.5 bg-gray-500 rounded-full"
            style={{ left: `${markerPct}%`, height: '20px', transform: 'translateY(-50%)' }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
            style={{
              left: `${barPct}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: color,
            }}
          />
        </div>

        {/* Tick marks */}
        <div aria-hidden="true" className="relative flex justify-between mt-1.5 px-0">
          {[0, 1, 2, 3].map(v => (
            <span key={v} className="text-[9px] text-gray-500">{v}</span>
          ))}
        </div>

        {/* Level labels */}
        <div aria-hidden="true" className="relative flex mt-0.5">
          <span className="text-[9px] text-gray-500" style={{ position: 'absolute', left: '33.3%', transform: 'translateX(-50%)' }}>Foundational</span>
          <span className="text-[9px] text-gray-500" style={{ position: 'absolute', left: '66.6%', transform: 'translateX(-50%)' }}>Proficient</span>
          <span className="text-[9px] text-gray-500" style={{ position: 'absolute', right: 0 }}>Advanced</span>
        </div>
        <div className="h-4" />
      </div>
    </Link>
  );
}