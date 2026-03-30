import React from 'react';
import DistributionBar from './DistributionBar';

export default function CompetencyCurrentStateTable({ competencies, expectedLevel, domainName }) {
  const getLevelBadgeColor = (level) => {
    if (level < 1.5) return 'bg-yellow-100 text-yellow-800';
    if (level < 2.3) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const getLevelLabel = (level) => {
    if (level < 1.5) return 'Foundational';
    if (level < 2.3) return 'Proficient';
    return 'Advanced';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Competency
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Workforce Distribution
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
              NAHQ Standard
            </th>
            <th className="px-8 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Avg Score
            </th>
            <th className="px-8 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Distance to Standard
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {competencies.map((competency, idx) => {
            const allScores = competency.users.map(u => u.score);
            const avgScore = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1);
            const distToStandard = (expectedLevel - avgScore).toFixed(2);

            return (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <p className="text-sm font-medium text-gray-900">{competency.name}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="w-48">
                    <DistributionBar
                      competency={competency}
                      expectedLevel={expectedLevel}
                      height="h-6"
                    />
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getLevelBadgeColor(expectedLevel)}`}>
                    {getLevelLabel(expectedLevel)}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="text-sm font-semibold text-gray-900">{avgScore}</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="text-sm font-medium text-gray-700">{distToStandard}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}