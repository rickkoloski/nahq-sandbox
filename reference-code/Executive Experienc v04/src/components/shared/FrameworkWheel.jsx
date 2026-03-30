import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DOMAINS = [
  { name: 'Professional Engagement', color: '#6B4C9A', shortName: 'PE' },
  { name: 'Quality Leadership & Integration', color: '#003DA5', shortName: 'QL' },
  { name: 'Performance & Process Improvement', color: '#00B5E2', shortName: 'PP' },
  { name: 'Population Health & Care Transitions', color: '#8BC53F', shortName: 'PH' },
  { name: 'Health Data Analytics', color: '#F68B1F', shortName: 'HD' },
  { name: 'Patient Safety', color: '#009CA6', shortName: 'PS' },
  { name: 'Regulatory & Accreditation', color: '#ED1C24', shortName: 'RA' },
  { name: 'Quality Review & Accountability', color: '#99154B', shortName: 'QR' },
];

export default function FrameworkWheel({ 
  size = 300, 
  scores = null, 
  interactive = true,
  showCenter = true,
  centerText = null,
  onDomainClick = null 
}) {
  const [hoveredDomain, setHoveredDomain] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2 - 10;
  const innerRadius = size / 4;
  
  const segmentAngle = (2 * Math.PI) / 8;
  const startOffset = -Math.PI / 2; // Start from top

  const getSegmentPath = (index, radius = outerRadius) => {
    const startAngle = startOffset + index * segmentAngle;
    const endAngle = startAngle + segmentAngle;
    
    const x1 = centerX + innerRadius * Math.cos(startAngle);
    const y1 = centerY + innerRadius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(startAngle);
    const y2 = centerY + radius * Math.sin(startAngle);
    const x3 = centerX + radius * Math.cos(endAngle);
    const y3 = centerY + radius * Math.sin(endAngle);
    const x4 = centerX + innerRadius * Math.cos(endAngle);
    const y4 = centerY + innerRadius * Math.sin(endAngle);
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`;
  };

  const getScoreRadius = (score) => {
    if (!score) return outerRadius;
    // Score ranges from 1.0 to 3.0, map to radius
    const minRadius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const scoreRatio = (score - 1) / 2; // 0 to 1
    return minRadius + (outerRadius - minRadius) * scoreRatio;
  };

  const handleMouseMove = (e, domain) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 60
    });
    setHoveredDomain(domain);
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {DOMAINS.map((domain, index) => {
          const score = scores?.[index]?.score;
          const radius = scores ? getScoreRadius(score) : outerRadius;
          
          return (
            <motion.path
              key={domain.name}
              d={getSegmentPath(index, radius)}
              fill={domain.color}
              stroke="white"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={interactive ? 'cursor-pointer' : ''}
              style={{
                transformOrigin: `${centerX}px ${centerY}px`,
                filter: hoveredDomain === domain ? 'brightness(1.1)' : 'none',
                transition: 'filter 0.2s, transform 0.2s'
              }}
              onMouseMove={(e) => handleMouseMove(e, domain)}
              onMouseLeave={() => setHoveredDomain(null)}
              onClick={() => onDomainClick?.(domain, index)}
            />
          );
        })}
        
        {/* Center circle */}
        {showCenter && (
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius - 5}
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        )}
        
        {/* Center text */}
        {showCenter && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold fill-[#3D3D3D]"
            style={{ fontSize: size / 12 }}
          >
            {centerText || 'NAHQ'}
          </text>
        )}
      </motion.svg>

      {/* Tooltip */}
      {hoveredDomain && interactive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute pointer-events-none bg-white rounded-lg shadow-xl border border-gray-200 px-4 py-3 z-10"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: hoveredDomain.color }}
            />
            <span className="font-semibold text-sm text-[#3D3D3D]">
              {hoveredDomain.name}
            </span>
          </div>
          {scores && (
            <div className="text-xs text-gray-500">
              Score: {scores[DOMAINS.indexOf(hoveredDomain)]?.score?.toFixed(1) || 'N/A'}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}