import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Network, Shield, Users, Settings, Globe, BarChart3, CheckSquare, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { COMPETENCY_DATA, DOMAIN_COLORS } from '@/components/shared/workforceData';
import DistributionBar from './DistributionBar';

const DOMAIN_ICONS = {
  'Quality Leadership': { Icon: Network, color: '#003DA5' },
  'Patient Safety': { Icon: Shield, color: '#ED1C24' },
  'Professional Engagement': { Icon: Users, color: '#6B4C9A' },
  'Performance Improvement': { Icon: Settings, color: '#00B5E2' },
  'Population Health': { Icon: Globe, color: '#8BC53F' },
  'Health Data Analytics': { Icon: BarChart3, color: '#F68B1F' },
  'Regulatory & Accreditation': { Icon: CheckSquare, color: '#99154B' },
  'Quality Review & Accountability': { Icon: ClipboardCheck, color: '#ED1C24' },
};

export default function DomainCurrentStateCard({ domainName, selectedRole, expectedLevel }) {
  const navigate = useNavigate();
  const competencies = COMPETENCY_DATA[domainName] || [];
  const [showTooltip, setShowTooltip] = React.useState(false);

  if (competencies.length === 0) return null;

  // Calculate aggregate metrics
  const allUsers = competencies.reduce((acc, c) => [...acc, ...c.users], []);
  const uniqueUserScores = {};
  allUsers.forEach(u => {
    if (!uniqueUserScores[u.name]) uniqueUserScores[u.name] = [];
    uniqueUserScores[u.name].push(u.score);
  });

  const uniqueUsers = Object.entries(uniqueUserScores).map(([name, scores]) => ({
    name,
    avgScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
  }));

  const domainAvgScore = (uniqueUsers.reduce((sum, u) => sum + parseFloat(u.avgScore), 0) / uniqueUsers.length).toFixed(1);
  const distanceToStandard = (expectedLevel - domainAvgScore).toFixed(2);

  const getLevelLabel = (score) => {
    if (score < 1.5) return 'Foundational';
    if (score < 2.3) return 'Proficient';
    return 'Advanced';
  };

  const handleDomainClick = () => {
    navigate(createPageUrl(`DomainCurrentState?domain=${encodeURIComponent(domainName)}&role=${encodeURIComponent(selectedRole)}`));
  };

  const domainConfig = DOMAIN_ICONS[domainName] || { Icon: Network, color: '#3D3D3D' };
  const IconComponent = domainConfig.Icon;

  return (
    <motion.button
      onClick={handleDomainClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-left hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group"
    >
      {/* Header with icon and domain name */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b-2" style={{ borderColor: domainConfig.color }}>
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${domainConfig.color}18` }}>
            <IconComponent className="w-4 h-4" style={{ color: domainConfig.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold line-clamp-2" style={{ color: domainConfig.color }}>
              {domainName}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{competencies.length} competencies</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0 transition-colors mt-1" />
      </div>

      {/* Distribution Bar */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Distribution</p>
        <DistributionBar
          competency={{
            users: uniqueUsers.map(u => ({ score: parseFloat(u.avgScore), name: u.name }))
              .sort((a, b) => b.score - a.score),
            name: domainName,
          }}
          expectedLevel={expectedLevel}
          height="h-8"
        />
      </div>

      {/* NAHQ Role Standard Indicator */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">NAHQ Standard Role Target</p>
        <p className="text-xs font-medium text-[#3D3D3D]">{getLevelLabel(expectedLevel)}</p>
      </div>

      {/* Context Metrics */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600 font-medium">Avg Score</p>
          <p className="text-sm font-bold text-[#3D3D3D]">{domainAvgScore}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600 font-medium">Gap to Standard</p>
          <p className="text-sm font-bold" style={{ color: distanceToStandard > 0.3 ? '#ED1C24' : '#3D3D3D' }}>
            {distanceToStandard}
          </p>
        </div>
      </div>
    </motion.button>
  );
}