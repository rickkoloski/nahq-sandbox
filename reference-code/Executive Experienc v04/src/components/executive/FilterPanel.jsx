import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FilterPanel({ filters, onFiltersChange, onClose }) {
  const [expandedSection, setExpandedSection] = useState('population');

  const handleFilterChange = (category, field, value) => {
    onFiltersChange({
      ...filters,
      [category]: {
        ...filters[category],
        [field]: value
      }
    });
  };

  const handleMultiSelectChange = (category, field, value) => {
    const currentValues = filters[category][field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    handleFilterChange(category, field, newValues);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      population: {
        job_level: [],
        primary_responsibility: [],
        percent_time_quality: [],
        years_with_employer: [],
        years_in_role: [],
        cphq_status: []
      },
      organization: {
        org_type: [],
        bed_size_category: [],
        total_fte_band: [],
        hqp_count_band: [],
        peer_group_assignment: [],
        health_system_grouping: []
      }
    });
  };

  const hasActiveFilters = () => {
    const popFilters = Object.values(filters.population).some(v => 
      (Array.isArray(v) && v.length > 0) || (typeof v === 'string' && v !== 'all')
    );
    const orgFilters = Object.values(filters.organization).some(v => 
      Array.isArray(v) && v.length > 0
    );
    return popFilters || orgFilters;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#00A3E0]" />
          <h3 className="font-bold text-[#3D3D3D]">Filter Data</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-gray-600 hover:text-[#00A3E0]"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Population Filters */}
      <div className="mb-4">
        <button
          onClick={() => setExpandedSection(expandedSection === 'population' ? null : 'population')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-sm text-[#3D3D3D]">Population Filters</span>
          {expandedSection === 'population' ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {expandedSection === 'population' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-4 max-h-[600px] overflow-y-auto pr-2"
            >
              {/* Job Level */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Job Level</label>
                <div className="space-y-1">
                  {[
                    'President or CEO',
                    'C-Level executive (CQO, CNO, CMO, CIO, etc.; excludes CEO)',
                    'Vice President',
                    'Director / Executive Director',
                    'Manager / Supervisor',
                    'Specialist / Analyst',
                    'Coordinator',
                    'Consultant / Advisor',
                    'Clinical Staff',
                    'Retired / Not Employed'
                  ].map(level => (
                    <label key={level} className="flex items-start gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.population.job_level?.includes(level)}
                        onChange={() => handleMultiSelectChange('population', 'job_level', level)}
                        className="rounded border-gray-300 text-[#00A3E0] focus:ring-[#00A3E0] mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700 text-xs leading-tight">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Primary Responsibility */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Primary Responsibility</label>
                <div className="space-y-1">
                  {[
                    'Administration',
                    'Ancillary to clinical (radiology, lab techs)',
                    'Case Management',
                    'Clinician — other (excludes physicians, nurses)',
                    'Education / Training',
                    'Executive Leadership',
                    'Finance',
                    'Health Data Analytics',
                    'Infection Prevention / Control',
                    'Marketing',
                    'Medicine',
                    'Nursing',
                    'Operations (IT, data abstraction, facilities, etc.)',
                    'Patient Experience / Relations / Advocacy',
                    'Patient Safety',
                    'Performance & Process Improvement (Lean, Six Sigma)',
                    'Population Health & Care Transitions',
                    'Project Management',
                    'Quality Management',
                    'Regulatory/Accreditation',
                    'Retired/not Employed',
                    'Risk Management',
                    'Other'
                  ].map(resp => (
                    <label key={resp} className="flex items-start gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.population.primary_responsibility?.includes(resp)}
                        onChange={() => handleMultiSelectChange('population', 'primary_responsibility', resp)}
                        className="rounded border-gray-300 text-[#00A3E0] focus:ring-[#00A3E0] mt-0.5 flex-shrink-0"
                      />
                      <span className="text-gray-700 text-xs leading-tight">{resp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Percent Time in Quality Role */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Percent Time in Quality Role</label>
                <div className="space-y-1">
                  {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map(percent => (
                    <label key={percent} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.population.percent_time_quality?.includes(percent)}
                        onChange={() => handleMultiSelectChange('population', 'percent_time_quality', percent)}
                        className="rounded border-gray-300 text-[#00A3E0] focus:ring-[#00A3E0]"
                      />
                      <span className="text-gray-700">{percent}%</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Years with Employer */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Years with Current Employer</label>
                <div className="space-y-1">
                  {[
                    'Less than 1 year',
                    '1–2 years',
                    '3–5 years',
                    '6–10 years',
                    'More than 10 years'
                  ].map(band => (
                    <label key={band} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.population.years_with_employer?.includes(band)}
                        onChange={() => handleMultiSelectChange('population', 'years_with_employer', band)}
                        className="rounded border-gray-300 text-[#00A3E0] focus:ring-[#00A3E0]"
                      />
                      <span className="text-gray-700 text-xs">{band}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Years in Role */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Years in Current Role</label>
                <div className="space-y-1">
                  {[
                    'Less than 1 year',
                    '1–2 years',
                    '3–4 years',
                    '5–10 years',
                    'More than 10 years'
                  ].map(band => (
                    <label key={band} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.population.years_in_role?.includes(band)}
                        onChange={() => handleMultiSelectChange('population', 'years_in_role', band)}
                        className="rounded border-gray-300 text-[#00A3E0] focus:ring-[#00A3E0]"
                      />
                      <span className="text-gray-700 text-xs">{band}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* CPHQ Status */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">CPHQ Status</label>
                <div className="space-y-1">
                  {[
                    'CPHQ Certified',
                    'Not Certified',
                    'Certification Lapsed'
                  ].map(status => (
                    <label key={status} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.population.cphq_status?.includes(status)}
                        onChange={() => handleMultiSelectChange('population', 'cphq_status', status)}
                        className="rounded border-gray-300 text-[#00A3E0] focus:ring-[#00A3E0]"
                      />
                      <span className="text-gray-700 text-xs">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Organization Profile Filters */}
      <div>
        <button
          onClick={() => setExpandedSection(expandedSection === 'organization' ? null : 'organization')}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="font-semibold text-sm text-[#3D3D3D]">Organization Profile Filters</span>
          {expandedSection === 'organization' ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <AnimatePresence>
          {expandedSection === 'organization' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-4"
            >
              {/* Organization Type */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Organization Type</label>
                <div className="space-y-1">
                  {['Academic Medical Center', 'Community Hospital', 'Critical Access Hospital', 'Specialty Hospital', 'Health System'].map(type => (
                    <label key={type} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.organization.org_type?.includes(type)}
                        onChange={() => handleMultiSelectChange('organization', 'org_type', type)}
                        className="rounded border-gray-300 text-[#00A3E0] focus:ring-[#00A3E0]"
                      />
                      <span className="text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bed Size */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Bed Size</label>
                <div className="space-y-1">
                  {['<50', '50-99', '100-199', '200-299', '300-499', '500+'].map(size => (
                    <label key={size} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.organization.bed_size_category?.includes(size)}
                        onChange={() => handleMultiSelectChange('organization', 'bed_size_category', size)}
                        className="rounded border-gray-300 text-[#00A3E0] focus:ring-[#00A3E0]"
                      />
                      <span className="text-gray-700">{size} beds</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* HQP Count */}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">HQP Count</label>
                <div className="space-y-1">
                  {['1-5', '6-10', '11-25', '26-50', '51-100', '100+'].map(count => (
                    <label key={count} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.organization.hqp_count_band?.includes(count)}
                        onChange={() => handleMultiSelectChange('organization', 'hqp_count_band', count)}
                        className="rounded border-gray-300 text-[#00A3E0] focus:ring-[#00A3E0]"
                      />
                      <span className="text-gray-700">{count} professionals</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters() && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            {Object.values(filters.population).filter(v => Array.isArray(v) && v.length > 0).reduce((acc, v) => acc + v.length, 0) +
             Object.values(filters.organization).filter(v => Array.isArray(v) && v.length > 0).reduce((acc, v) => acc + v.length, 0)} active filters
          </p>
        </div>
      )}
    </motion.div>
  );
}