import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ROLE_TARGETS } from '@/components/shared/workforceData';

export default function RoleTargetDistributionChart({ users, domainColor = '#00A3E0' }) {
  // Deduplicate users by name (same logic as UserRow)
  const uniqueUsers = Object.values(
    users.reduce((acc, u) => { if (!acc[u.name]) acc[u.name] = u; return acc; }, {})
  );

  const distribution = { 'On Target': 0, 'Below Target': 0, 'Critical': 0 };

  uniqueUsers.forEach(user => {
    const target = ROLE_TARGETS[user.role] || 2.0;
    const attainmentPct = Math.round((user.score / target) * 100);
    if (attainmentPct >= 90) distribution['On Target']++;
    else if (attainmentPct >= 60) distribution['Below Target']++;
    else distribution['Critical']++;
  });

  const total = uniqueUsers.length || 1;
  const chartData = [
    { name: 'On Target',     count: distribution['On Target'],    percentage: Math.round((distribution['On Target'] / total) * 100),    fill: '#059669' },
    { name: 'Below Target',  count: distribution['Below Target'], percentage: Math.round((distribution['Below Target'] / total) * 100), fill: '#D97706' },
    { name: 'Critical',      count: distribution['Critical'],     percentage: Math.round((distribution['Critical'] / total) * 100),     fill: '#DC2626' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#3D3D3D] mb-0.5">
          Distribution of Workforce Capability Alignment
        </h3>
        <p className="text-xs text-gray-500">Percentage of participants by alignment status</p>
      </div>

      <div className="h-36 mb-5 pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 8, left: 65, bottom: 8 }}>
            <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
            <XAxis type="number" stroke="#E5E7EB" style={{ fontSize: '11px' }} tick={{ fill: '#9CA3AF' }} domain={[0, 100]} />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="none" 
              style={{ fontSize: '12px' }} 
              tick={{ fill: '#3D3D3D', fontWeight: 500 }}
              width={105}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                padding: '6px 10px',
                fontSize: '12px',
              }}
              cursor={{ fill: 'rgba(0, 163, 224, 0.05)' }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="text-xs font-medium text-[#3D3D3D]">
                      {data.name}: {data.count} ({data.percentage}%)
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]} isAnimationActive={true}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend below chart */}
      <div className="flex justify-center gap-8 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
            <div className="text-center">
              <p className="text-[10px] font-medium text-[#3D3D3D]">{item.name}</p>
              <p className="text-xs font-bold text-[#3D3D3D]">{item.percentage}% ({item.count})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}