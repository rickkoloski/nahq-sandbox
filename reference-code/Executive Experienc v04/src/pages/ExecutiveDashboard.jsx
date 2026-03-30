import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Target, TrendingUp, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import Header from '@/components/shared/Header';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import ExecutiveAIChat from '@/components/executive/ExecutiveAIChat.jsx';
import FilterPanel from '@/components/executive/FilterPanel';
import DashboardFilterBar from '@/components/executive/DashboardFilterBar';
import BenchmarkingCard from '@/components/executive/BenchmarkingCard';
import ReassessmentProgressCard from '@/components/executive/ReassessmentProgressCard';
import StrategicSummaryBar from '@/components/executive/StrategicSummaryBar';
import WorkforceExplorer from '@/components/executive/WorkforceExplorer';

const SAMPLE_HOSPITALS = [
  { id: 'all', name: 'All Hospitals' },
  { id: 'regional', name: 'Regional Medical Center' },
  { id: 'community', name: 'Community Hospital' },
  { id: 'specialty', name: 'Specialty Care Hospital' }
];

const HOSPITAL_DATA = {
  all: { totalInvited: 47, totalCompleted: 34, completionRate: 72, assessmentDate: 'January 27, 2026',
    byRole: [
      { role: 'Director of Quality', invited: 12, completed: 10, status: 'completed' },
      { role: 'Quality Manager', invited: 18, completed: 14, status: 'in_progress' },
      { role: 'Quality Specialist', invited: 17, completed: 10, status: 'in_progress' }
    ],
    domainDistribution: [
      { name: 'Quality Leadership', foundational: 8, proficient: 15, advanced: 11, color: '#003DA5' },
      { name: 'Patient Safety', foundational: 5, proficient: 18, advanced: 11, color: '#ED1C24' },
      { name: 'Professional Engagement', foundational: 4, proficient: 12, advanced: 8, color: '#6B4C9A' },
      { name: 'Performance Improvement', foundational: 12, proficient: 16, advanced: 6, color: '#00B5E2' },
      { name: 'Health Data Analytics', foundational: 22, proficient: 10, advanced: 2, color: '#F68B1F' },
      { name: 'Regulatory & Accreditation', foundational: 6, proficient: 20, advanced: 8, color: '#99154B' },
      { name: 'Quality Review & Accountability', foundational: 3, proficient: 14, advanced: 5, color: '#ED1C24' },
      { name: 'Population Health', foundational: 10, proficient: 12, advanced: 3, color: '#8BC53F' }
    ],
    organizationalScore: 1.72, benchmarkScore: 1.95
  },
  regional: { totalInvited: 20, totalCompleted: 16, completionRate: 80, assessmentDate: 'January 27, 2026',
    byRole: [
      { role: 'Director of Quality', invited: 6, completed: 6, status: 'completed' },
      { role: 'Quality Manager', invited: 9, completed: 7, status: 'in_progress' },
      { role: 'Quality Specialist', invited: 5, completed: 3, status: 'in_progress' }
    ],
    domainDistribution: [
      { name: 'Quality Leadership', foundational: 3, proficient: 8, advanced: 5, color: '#003DA5' },
      { name: 'Patient Safety', foundational: 2, proficient: 9, advanced: 5, color: '#ED1C24' },
      { name: 'Professional Engagement', foundational: 1, proficient: 5, advanced: 4, color: '#6B4C9A' },
      { name: 'Performance Improvement', foundational: 5, proficient: 7, advanced: 4, color: '#00B5E2' },
      { name: 'Health Data Analytics', foundational: 10, proficient: 4, advanced: 2, color: '#F68B1F' },
      { name: 'Regulatory & Accreditation', foundational: 2, proficient: 10, advanced: 4, color: '#99154B' },
      { name: 'Quality Review & Accountability', foundational: 1, proficient: 8, advanced: 2, color: '#ED1C24' },
      { name: 'Population Health', foundational: 5, proficient: 6, advanced: 1, color: '#8BC53F' }
    ],
    organizationalScore: 1.85, benchmarkScore: 1.95
  },
  community: { totalInvited: 15, totalCompleted: 11, completionRate: 73, assessmentDate: 'January 27, 2026',
    byRole: [
      { role: 'Quality Manager', invited: 8, completed: 6, status: 'in_progress' },
      { role: 'Quality Specialist', invited: 7, completed: 5, status: 'in_progress' }
    ],
    domainDistribution: [
      { name: 'Quality Leadership', foundational: 3, proficient: 5, advanced: 3, color: '#003DA5' },
      { name: 'Patient Safety', foundational: 2, proficient: 6, advanced: 3, color: '#ED1C24' },
      { name: 'Professional Engagement', foundational: 1, proficient: 3, advanced: 2, color: '#6B4C9A' },
      { name: 'Performance Improvement', foundational: 4, proficient: 6, advanced: 1, color: '#00B5E2' },
      { name: 'Health Data Analytics', foundational: 8, proficient: 3, advanced: 0, color: '#F68B1F' },
      { name: 'Regulatory & Accreditation', foundational: 2, proficient: 7, advanced: 2, color: '#99154B' },
      { name: 'Quality Review & Accountability', foundational: 1, proficient: 4, advanced: 1, color: '#ED1C24' },
      { name: 'Population Health', foundational: 3, proficient: 3, advanced: 0, color: '#8BC53F' }
    ],
    organizationalScore: 1.64, benchmarkScore: 1.95
  },
  specialty: { totalInvited: 12, totalCompleted: 7, completionRate: 58, assessmentDate: 'January 27, 2026',
    byRole: [
      { role: 'Director of Quality', invited: 6, completed: 4, status: 'completed' },
      { role: 'Quality Specialist', invited: 6, completed: 3, status: 'in_progress' }
    ],
    domainDistribution: [
      { name: 'Quality Leadership', foundational: 2, proficient: 2, advanced: 3, color: '#003DA5' },
      { name: 'Patient Safety', foundational: 1, proficient: 3, advanced: 3, color: '#ED1C24' },
      { name: 'Professional Engagement', foundational: 1, proficient: 2, advanced: 1, color: '#6B4C9A' },
      { name: 'Performance Improvement', foundational: 3, proficient: 3, advanced: 1, color: '#00B5E2' },
      { name: 'Health Data Analytics', foundational: 4, proficient: 3, advanced: 0, color: '#F68B1F' },
      { name: 'Regulatory & Accreditation', foundational: 2, proficient: 3, advanced: 2, color: '#99154B' },
      { name: 'Quality Review & Accountability', foundational: 1, proficient: 2, advanced: 0, color: '#ED1C24' },
      { name: 'Population Health', foundational: 2, proficient: 2, advanced: 0, color: '#8BC53F' }
    ],
    organizationalScore: 1.68, benchmarkScore: 1.95
  }
};

const TABS = [
  { id: 'explorer', label: 'Workforce Explorer', icon: Target },
];

export default function ExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatContext, setAiChatContext] = useState(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedBenchmark, setSelectedBenchmark] = useState('nahq');
  const [filters, setFilters] = useState({
    population: { job_level: [], primary_responsibility: [], percent_time_quality: [], years_with_employer: [], years_in_role: [], cphq_status: [] },
    organization: { org_type: [], bed_size_category: [], total_fte_band: [], hqp_count_band: [], peer_group_assignment: [], health_system_grouping: [] }
  });
  const [dashboardFilters, setDashboardFilters] = useState({
    assessmentCycle: [],
    cohort: [],
    role: [],
    site: [],
  });
  const [showKpiMetrics, setShowKpiMetrics] = useState(true);

  const currentData = HOSPITAL_DATA[selectedHospital];
  const hasActiveFilters = Object.values(filters.population).some(v => v.length > 0) || Object.values(filters.organization).some(v => v.length > 0);
  const filterCount = Object.values(filters.population).reduce((a, v) => a + v.length, 0) + Object.values(filters.organization).reduce((a, v) => a + v.length, 0);

  const [aiChatInitialSummary, setAiChatInitialSummary] = useState('');
  const handleAiChat = (context, summary = '') => { setAiChatContext(context); setAiChatInitialSummary(summary); setAiChatOpen(true); };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Header currentPage="Executive" />

      {/* Page Header */}
       <div className="bg-white border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Breadcrumbs */}
           <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 py-3">
             <Link to={createPageUrl('Home')} className="hover:text-[#00A3E0] transition-colors font-medium">Home</Link>
             <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
             <span className="text-[#3D3D3D] font-semibold" aria-current="page">Organizational Dashboard</span>
           </nav>

           <div className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-xl font-bold text-[#3D3D3D]">Organizational Dashboard</h1>
                <p className="text-xs text-gray-600 mt-0.5">Workforce capability · Assessment results · Development insights</p>
              </div>
            </div>

          {/* Tab Navigation */}
           <div className="flex gap-1 -mb-px" role="tablist" aria-label="Dashboard views">
             {TABS.map(tab => (
               <button
                 key={tab.id}
                 role="tab"
                 aria-selected={activeTab === tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                   activeTab === tab.id
                     ? 'border-[#00A3E0] text-[#00A3E0]'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 {tab.label}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${filterPanelOpen ? 'grid lg:grid-cols-[1fr_300px] gap-6 items-start' : ''}`}>
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'explorer' && (
              <motion.div key="explorer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                {/* Dashboard Filter Bar */}
                <DashboardFilterBar filters={dashboardFilters} onFiltersChange={setDashboardFilters} />
                
                {/* KPI Metrics Toggle */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowKpiMetrics(!showKpiMetrics)}
                    aria-pressed={showKpiMetrics}
                    className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#00A3E0] transition-colors px-3 py-1.5 border border-gray-200 rounded-lg hover:border-[#00A3E0]"
                  >
                    {showKpiMetrics ? (
                      <>
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        Hide KPI Metrics
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                        Show KPI Metrics
                      </>
                    )}
                  </button>
                </div>

                {/* Strategic Summary Bar — KPI metrics conditionally hidden */}
                <div className="mt-6">
                  <StrategicSummaryBar onChatOpen={handleAiChat} hideKpis={!showKpiMetrics} />
                </div>
                
                {/* Workforce Explorer — drill-down */}
                <div className="mt-6">
                  <WorkforceExplorer data={currentData} onChatOpen={handleAiChat} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterPanelOpen && (
            <FilterPanel filters={filters} onFiltersChange={setFilters} onClose={() => setFilterPanelOpen(false)} />
          )}
        </AnimatePresence>
      </div>

      <FloatingChatButton onClick={() => handleAiChat('capability')} />

      <AnimatePresence>
        {aiChatOpen && (
          <ExecutiveAIChat isOpen={aiChatOpen} onClose={() => { setAiChatOpen(false); setAiChatContext(null); }} context={aiChatContext || 'capability'} initialSummary={aiChatInitialSummary} data={currentData} />
        )}
      </AnimatePresence>
    </div>
  );
}