import React from 'react';
import { severityConfig } from '@/components/individual/individualMockData';

export default function SeverityChip({ gap }) {
  const { label, bg, text } = severityConfig(gap);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}