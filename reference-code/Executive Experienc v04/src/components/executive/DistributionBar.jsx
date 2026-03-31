import React, { useState } from 'react';

export default function DistributionBar({ competency, expectedLevel, height = "h-10" }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const scores = competency.users.map(u => u.score);
  const total = scores.length;

  // Categorize scores into levels
  const notApplicable = scores.filter(s => s === 0).length;
  const foundational = scores.filter(s => s > 0 && s < 1.5).length;
  const proficient = scores.filter(s => s >= 1.5 && s < 2.3).length;
  const advanced = scores.filter(s => s >= 2.3).length;

  const percentages = {
    notApplicable: ((notApplicable / total) * 100).toFixed(1),
    foundational: ((foundational / total) * 100).toFixed(1),
    proficient: ((proficient / total) * 100).toFixed(1),
    advanced: ((advanced / total) * 100).toFixed(1),
  };

  const levelLabel = expectedLevel < 1.5 ? 'Foundational' : expectedLevel < 2.3 ? 'Proficient' : 'Advanced';

  return (
    <div className="relative">
      {/* Stacked bar */}
      <div className={`flex ${height} rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative group`}>
        {notApplicable > 0 && (
          <div
            className="transition-opacity hover:opacity-80"
            style={{ width: `${percentages.notApplicable}%`, backgroundColor: '#D0D5DD' }}
            onMouseEnter={() => setShowTooltip('notApplicable')}
            onMouseLeave={() => setShowTooltip(false)}
          />
        )}
        {foundational > 0 && (
          <div
            className="transition-opacity hover:opacity-80"
            style={{ width: `${percentages.foundational}%`, backgroundColor: '#F68B1F' }}
            onMouseEnter={() => setShowTooltip('foundational')}
            onMouseLeave={() => setShowTooltip(false)}
          />
        )}
        {proficient > 0 && (
          <div
            className="transition-opacity hover:opacity-80"
            style={{ width: `${percentages.proficient}%`, backgroundColor: '#00A3E0' }}
            onMouseEnter={() => setShowTooltip('proficient')}
            onMouseLeave={() => setShowTooltip(false)}
          />
        )}
        {advanced > 0 && (
          <div
            className="transition-opacity hover:opacity-80"
            style={{ width: `${percentages.advanced}%`, backgroundColor: '#8BC53F' }}
            onMouseEnter={() => setShowTooltip('advanced')}
            onMouseLeave={() => setShowTooltip(false)}
          />
        )}

        {/* Expected level marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-900 opacity-40"
          style={{ left: `${(expectedLevel / 3) * 100}%` }}
          title="Expected Level"
        />
      </div>

      {/* Labels below bar */}
      <div className="flex mt-3 text-xs font-medium text-gray-700">
        {notApplicable > 0 && <span className="flex-1">{percentages.notApplicable}% N/A</span>}
        {foundational > 0 && <span className="flex-1">{percentages.foundational}% Foundation</span>}
        {proficient > 0 && <span className="flex-1">{percentages.proficient}% Proficient</span>}
        {advanced > 0 && <span className="flex-1">{percentages.advanced}% Advanced</span>}
      </div>

      {/* Expected level label */}
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
        <div className="w-2 h-2 bg-gray-900 opacity-40 rounded-full" />
        <span>Expected Level: {levelLabel}</span>
      </div>
    </div>
  );
}