import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, ExternalLink, Network, Shield, Users, Settings, Globe, BarChart3, CheckSquare, ClipboardCheck, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SeverityChip from './SeverityChip';
import DomainBulletChart from './DomainBulletChart';
import DomainCompetencyPanel from '@/components/executive/DomainCompetencyPanel';
import {
  COMPETENCIES, DOMAINS,
  levelLabel, levelColor, severityConfig
} from './individualMockData';

const DOMAIN_ICONS = {
  'Quality Leadership and Integration': Network,
  'Patient Safety': Shield,
  'Professional Engagement': Users,
  'Performance and Process Improvement': Settings,
  'Population Health and Care Transitions': Globe,
  'Health Data Analytics': BarChart3,
  'Regulatory and Accreditation': CheckSquare,
  'Quality Review and Accountability': ClipboardCheck
};

function gapToTarget(currentLevel, roleTarget = 2.0) {
  return parseFloat(Math.max(0, roleTarget - currentLevel).toFixed(2));
}

function GapChip({ dist }) {
  let bg, text, label;
  if (dist <= 0) { bg = '#D1FAE5'; text = '#065F46'; label = 'On Target'; }
  else if (dist <= 0.3) { bg = '#FFF3E0'; text = '#7C3D0A'; label = 'Moderate'; }
  else { bg = '#FEE2E2'; text = '#991B1B'; label = 'Critical'; }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: bg, color: text }}>{label}</span>
  );
}

function CompetencyRow({ comp, domain }) {
   const navigate = useNavigate();
   const roleTarget = domain?.roleTarget ?? 2.0;
   const gap = gapToTarget(comp.currentLevel, roleTarget);
   const lc = levelColor(comp.currentLevel);

  const handleClick = () => {
    navigate(`${createPageUrl('IndividualCompetencyDetail')}?domain=${comp.domainSlug}&competency=${comp.slug}`);
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={handleClick}
        className="w-full hover:bg-[#00A3E0]/5 transition-colors text-left group"
        style={{ display: 'grid', gridTemplateColumns: '1fr 130px 100px 100px 36px', alignItems: 'center', padding: '16px 20px', gap: '16px' }}
      >
        {/* Competency Name */}
        <div className="min-w-0 pr-3 flex items-center gap-2">
          <p className="text-sm font-semibold text-[#3D3D3D] leading-snug">{comp.name}</p>
        </div>

        {/* Your Results */}
        <div className="text-center">
          <p className="text-sm font-bold text-[#3D3D3D] leading-none">{(comp.score ?? comp.currentLevel).toFixed(1)}</p>
          <p className="text-[10px] font-semibold mt-0.5" style={{ color: lc.text }}>{levelLabel(comp.currentLevel)}</p>
        </div>

        {/* NAHQ Role Target */}
        <div className="text-center">
          <p className="text-sm font-bold text-[#3D3D3D] leading-none">{roleTarget}</p>
          <p className="text-[10px] font-semibold mt-0.5" style={{ color: levelColor(roleTarget).text }}>{levelLabel(roleTarget)}</p>
        </div>

        {/* Status (SeverityChip) */}
        <div className="flex justify-center">
          <SeverityChip gap={Math.round(gap)} />
        </div>

        <div className="flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
      </button>
    </div>
  );
}

function DomainRow({ domain, comps }) {
   const [open, setOpen] = useState(false);
   const [panelOpen, setPanelOpen] = useState(false);

   // Avg level for this domain
   const avgLevel = comps.length
     ? comps.reduce((s, c) => s + c.currentLevel, 0) / comps.length
     : 0;
   const roleTarget = domain?.roleTarget ?? 2.0;
   const avgGapToTarget = gapToTarget(avgLevel, roleTarget);

   // Check if any competency is critical
   const hasCritical = comps.some(c => {
     const gap = gapToTarget(c.currentLevel, c.roleTarget ?? roleTarget);
     return gap >= 2;
   });

   let domainStatus = 'On Target';
   if (hasCritical) {
     domainStatus = 'Critical';
   }

   const lc = levelColor(Math.round(avgLevel));
   const Icon = DOMAIN_ICONS[domain.name] || BarChart3;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full hover:bg-gray-50 transition-colors text-left"
          style={{ display: 'grid', gridTemplateColumns: '36px 1fr 320px 100px 100px 36px', alignItems: 'center', padding: '16px 20px', gap: '16px' }}
      >
        {/* Icon */}
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${domain.color}18` }}>
          <Icon className="w-4 h-4" style={{ color: domain.color }} />
        </div>

        {/* Domain name + color bar */}
        <div className="min-w-0 flex items-center gap-3 group">
          <div>
            <p className="text-sm font-semibold text-[#3D3D3D] leading-snug">{domain.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{comps.length} competencies</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPanelOpen(true);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <Info className="w-4 h-4 text-gray-400 hover:text-[#00A3E0]" />
          </button>
        </div>

        {/* Bullet Chart Progress */}
        <div className="px-2">
          <DomainBulletChart domainProfile={[{ ...domain, avgLevel, overrideAvgLevel: avgLevel }]} singleDomainView={true} />
        </div>

        {/* Capability Below Target Count */}
        <div className="text-center">
          <span className="text-sm font-bold text-[#3D3D3D]">{comps.filter(c => {
            const gap = gapToTarget(c.currentLevel, domain.roleTarget ?? 2.0);
            return gap > 0.3 || gap > 0;
          }).length}</span>
        </div>

        {/* Status (SeverityChip) */}
        <div className="flex justify-center">
          {domainStatus === 'Critical' ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap"
              style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>Critical</span>
          ) : (
            <SeverityChip gap={Math.round(avgGapToTarget)} />
          )}
        </div>

        <div className="flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100">
              {/* Column headers */}
              <div className="grid px-5 py-2.5 bg-gray-50 border-b border-gray-200"
                style={{ gridTemplateColumns: '1fr 130px 100px 100px 36px', gap: '16px' }}>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-left">Competency</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Your Results</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">NAHQ Role Target</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Status</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center"></span>
              </div>
              {comps.map((comp, i) => (
                <CompetencyRow key={comp.slug} comp={comp} domain={domain} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DomainCompetencyPanel 
        isOpen={panelOpen} 
        onClose={() => setPanelOpen(false)} 
        type="domain" 
        name={domain.name} 
      />
    </div>
  );
}

export default function IndividualDomainExplorer() {
  const domainMap = Object.fromEntries(DOMAINS.map(d => [d.slug, d]));

  // Group competencies by domain
  const grouped = {};
  COMPETENCIES.forEach(comp => {
    if (!grouped[comp.domainSlug]) grouped[comp.domainSlug] = [];
    grouped[comp.domainSlug].push(comp);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#3D3D3D]">Domain & Competency Explorer</h3>
          <p className="text-xs text-gray-500 mt-0.5">Click a domain to see its competencies · Click a competency to open your detail view</p>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid px-5 py-2.5 mb-2 bg-gray-50 rounded-lg border border-gray-200"
        style={{ gridTemplateColumns: '36px 1fr 320px 100px 100px 36px', gap: '16px' }}>
        <span></span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-left">Domain</span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Progress to Target</span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Capabilities Below Target</span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide text-center">Status</span>
        <span></span>
      </div>

      <div className="space-y-2">
        {DOMAINS.map(domain => (
          <DomainRow
            key={domain.slug}
            domain={domain}
            comps={grouped[domain.slug] || []}
          />
        ))}
      </div>
    </div>
  );
}