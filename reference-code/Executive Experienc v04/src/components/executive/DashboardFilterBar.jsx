import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Search, X } from 'lucide-react';

export default function DashboardFilterBar({ filters, onFiltersChange }) {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  // Filter options
  const ASSESSMENT_CYCLES = ['2026-Q1', '2025-Q4', '2025-Q3', '2025-Q2'];
  const COHORTS = ['Cohort A', 'Cohort B', 'Cohort C', 'Cohort D'];
  const ROLES = ['Director of Quality', 'Quality Manager', 'Quality Specialist', 'Quality Analyst'];
  const SITES = ['Regional Medical Center', 'Community Hospital', 'Specialty Care Hospital', 'Academic Medical Center'];

  const filterOptions = {
    assessmentCycle: ASSESSMENT_CYCLES,
    cohort: COHORTS,
    role: ROLES,
    site: SITES,
  };

  const filterLabels = {
    assessmentCycle: 'Assessment Cycle',
    cohort: 'Cohort',
    role: 'Role',
    site: 'Site',
  };

  const handleToggleFilter = (filterKey, value) => {
    onFiltersChange({
      ...filters,
      [filterKey]: filters[filterKey]?.includes(value)
        ? filters[filterKey].filter(v => v !== value)
        : [...(filters[filterKey] || []), value],
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      assessmentCycle: [],
      cohort: [],
      role: [],
      site: [],
    });
  };

  const totalActiveFilters = Object.values(filters).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const renderFilterButton = (filterKey) => {
    const selected = filters[filterKey] || [];
    const label = filterLabels[filterKey];
    const options = filterOptions[filterKey];

    const isOpen = dropdownOpen === filterKey;
    return (
      <div key={filterKey} className="relative" ref={isOpen ? dropdownRef : null}>
        <button
          onClick={() => setDropdownOpen(isOpen ? null : filterKey)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Filter by ${label}`}
          className="flex items-center gap-1.5 text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#00A3E0] hover:text-[#00A3E0] transition-colors bg-white"
        >
          {label}
          <ChevronDown className="w-3 h-3" aria-hidden="true" />
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.1 }}
            role="listbox"
            aria-label={`${label} options`}
            aria-multiselectable="true"
            className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg w-56"
          >
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((option) => (
                <button
                  key={option}
                  role="option"
                  aria-selected={selected.includes(option)}
                  onClick={() => handleToggleFilter(filterKey, option)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                    selected.includes(option) ? 'text-[#00A3E0] font-semibold' : 'text-gray-700'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                      selected.includes(option) ? 'bg-[#00A3E0] border-[#00A3E0]' : 'border-gray-300'
                    }`}
                  >
                    {selected.includes(option) && <span className="text-white text-[8px]">✓</span>}
                  </span>
                  {option}
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => handleToggleFilter(filterKey, null)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear
              </button>
              <button onClick={() => setDropdownOpen(null)} className="text-xs text-[#00A3E0] font-semibold hover:underline">
                Done
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide flex-shrink-0">
          <Filter className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Filters</span>
        </div>

        {renderFilterButton('assessmentCycle')}
        {renderFilterButton('cohort')}
        {renderFilterButton('role')}
        {renderFilterButton('site')}

        {/* Selected filter tags */}
        {Object.entries(filters).map(([filterKey, values]) =>
          values?.map((value) => (
            <span key={`${filterKey}-${value}`} className="inline-flex items-center gap-1 bg-[#00A3E0]/10 text-[#00A3E0] text-[11px] font-medium rounded-full px-2.5 py-0.5">
              {value}
              <button
                onClick={() => handleToggleFilter(filterKey, value)}
                aria-label={`Remove filter: ${value}`}
                className="hover:text-[#0087bd] transition-colors"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </span>
          ))
        )}

        {/* Clear all button */}
        {totalActiveFilters > 0 && (
          <button onClick={handleClearAll} className="text-xs text-gray-400 hover:text-gray-600 ml-auto transition-colors">
            Clear all
          </button>
        )}
      </div>
    </motion.div>
  );
}