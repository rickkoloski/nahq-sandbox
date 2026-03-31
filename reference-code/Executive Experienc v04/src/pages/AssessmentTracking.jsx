import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Search, Calendar, ChevronLeft, ChevronRight, Bell, X, Send, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/shared/Header';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

const COHORTS = [
  {
    id: 'cohort1',
    name: 'Org Cohort 1',
    label: 'January 2026',
    status: 'closed',
    startDate: 'Jan 15, 2026',
    window: 'Jan 15 – Feb 14, 2026',
    users: [
      { id: 1, name: 'Sarah Johnson', roleGroup: 'Role Group 1', site: 'Regional Medical Center', status: 'completed', completedDate: '2026-01-25' },
      { id: 2, name: 'Michael Chen', roleGroup: 'Role Group 1', site: 'Regional Medical Center', status: 'completed', completedDate: '2026-01-22' },
      { id: 3, name: 'Jessica Lee', roleGroup: 'Role Group 2', site: 'Community Hospital', status: 'completed', completedDate: '2026-01-20' },
      { id: 4, name: 'Robert Martinez', roleGroup: 'Role Group 2', site: 'Community Hospital', status: 'completed', completedDate: '2026-01-18' },
      { id: 5, name: 'Linda Pham', roleGroup: 'Role Group 1', site: 'Specialty Care Hospital', status: 'completed', completedDate: '2026-01-28' },
      { id: 6, name: 'Thomas Brooks', roleGroup: 'Role Group 1', site: 'Specialty Care Hospital', status: 'completed', completedDate: '2026-01-30' },
      { id: 7, name: 'Angela Ruiz', roleGroup: 'Role Group 2', site: 'Regional Medical Center', status: 'completed', completedDate: '2026-02-01' },
      { id: 8, name: 'Kevin Park', roleGroup: 'Role Group 3', site: 'Regional Medical Center', status: 'completed', completedDate: '2026-02-05' },
      { id: 9, name: 'Rachel Kim', roleGroup: 'Role Group 1', site: 'Community Hospital', status: 'completed', completedDate: '2026-02-08' },
      { id: 10, name: 'David Anderson', roleGroup: 'Role Group 2', site: 'Specialty Care Hospital', status: 'not_started', invitedDate: '2026-01-15' },
    ]
  },
  {
    id: 'cohort2',
    name: 'Org Cohort 2',
    label: 'March 2026',
    status: 'active',
    startDate: 'Mar 3, 2026',
    window: 'Mar 3 – Apr 2, 2026',
    users: [
      { id: 11, name: 'Emily Rodriguez', roleGroup: 'Role Group 2', site: 'Regional Medical Center', status: 'completed', completedDate: '2026-03-05' },
      { id: 12, name: 'James Wilson', roleGroup: 'Role Group 2', site: 'Regional Medical Center', status: 'completed', completedDate: '2026-03-07' },
      { id: 13, name: 'Patricia Brown', roleGroup: 'Role Group 3', site: 'Community Hospital', status: 'completed', completedDate: '2026-03-10' },
      { id: 14, name: 'Daniel Garcia', roleGroup: 'Role Group 2', site: 'Community Hospital', status: 'not_started', invitedDate: '2026-03-03' },
      { id: 15, name: 'Susan Taylor', roleGroup: 'Role Group 3', site: 'Specialty Care Hospital', status: 'not_started', invitedDate: '2026-03-03' },
      { id: 16, name: 'Mark Thompson', roleGroup: 'Role Group 2', site: 'Specialty Care Hospital', status: 'not_started', invitedDate: '2026-03-03' },
      { id: 17, name: 'Nancy White', roleGroup: 'Role Group 3', site: 'Regional Medical Center', status: 'not_started', invitedDate: '2026-03-03' },
      { id: 18, name: 'Christopher Lee', roleGroup: 'Role Group 2', site: 'Community Hospital', status: 'not_started', invitedDate: '2026-03-03' },
      { id: 19, name: 'Amanda Hall', roleGroup: 'Role Group 2', site: 'Specialty Care Hospital', status: 'not_started', invitedDate: '2026-03-03' },
      { id: 20, name: 'Brian Scott', roleGroup: 'Role Group 3', site: 'Regional Medical Center', status: 'not_started', invitedDate: '2026-03-03' },
    ]
  },
  {
    id: 'cohort3',
    name: 'Org Cohort 3',
    label: 'June 2026',
    status: 'active',
    startDate: 'Jun 1, 2026',
    window: 'Jun 1 – Jun 30, 2026',
    users: [
      { id: 21, name: 'Laura Adams', roleGroup: 'Role Group 3', site: 'Regional Medical Center', status: 'not_started', invitedDate: '2026-06-01' },
      { id: 22, name: 'Steven Clark', roleGroup: 'Role Group 3', site: 'Regional Medical Center', status: 'not_started', invitedDate: '2026-06-01' },
      { id: 23, name: 'Megan Turner', roleGroup: 'Role Group 3', site: 'Community Hospital', status: 'not_started', invitedDate: '2026-06-01' },
      { id: 24, name: 'Ryan Harris', roleGroup: 'Role Group 1', site: 'Community Hospital', status: 'not_started', invitedDate: '2026-06-01' },
      { id: 25, name: 'Stephanie Lewis', roleGroup: 'Role Group 2', site: 'Specialty Care Hospital', status: 'not_started', invitedDate: '2026-06-01' },
      { id: 26, name: 'Brandon Young', roleGroup: 'Role Group 3', site: 'Specialty Care Hospital', status: 'not_started', invitedDate: '2026-06-01' },
      { id: 27, name: 'Melissa Walker', roleGroup: 'Role Group 2', site: 'Regional Medical Center', status: 'not_started', invitedDate: '2026-06-01' },
    ]
  },
  {
    id: 'cohort4',
    name: 'Org Cohort 4',
    label: 'September 2026',
    status: 'active',
    startDate: 'Sep 1, 2026',
    window: 'Sep 1 – Sep 30, 2026',
    users: [
      { id: 28, name: 'Chris Nguyen', roleGroup: 'Role Group 3', site: 'Regional Medical Center', status: 'not_started', invitedDate: '2026-09-01' },
      { id: 29, name: 'Dana Flores', roleGroup: 'Role Group 2', site: 'Community Hospital', status: 'not_started', invitedDate: '2026-09-01' },
      { id: 30, name: 'Marcus Webb', roleGroup: 'Role Group 3', site: 'Specialty Care Hospital', status: 'not_started', invitedDate: '2026-09-01' },
      { id: 31, name: 'Tanya Morris', roleGroup: 'Role Group 1', site: 'Regional Medical Center', status: 'not_started', invitedDate: '2026-09-01' },
      { id: 32, name: 'Jordan Banks', roleGroup: 'Role Group 2', site: 'Community Hospital', status: 'not_started', invitedDate: '2026-09-01' },
    ]
  }
];

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: '#12B76A', bg: '#ECFDF3', icon: CheckCircle2 },
  not_started: { label: 'Not Started', color: '#667085', bg: '#F9FAFB', icon: Circle },
};

const COHORT_STATUS_CONFIG = {
  active: { label: 'Active', color: '#12B76A', bg: '#ECFDF3' },
  closed: { label: 'Closed', color: '#667085', bg: '#F9FAFB' },
};

const VISIBLE_COHORT_COUNT = 3;

function AISummaryCard({ cohorts }) {
  const totalParticipants = cohorts.reduce((sum, c) => sum + c.users.length, 0);
  const totalCompleted = cohorts.reduce((sum, c) => sum + c.users.filter(u => u.status === 'completed').length, 0);
  const totalPending = totalParticipants - totalCompleted;
  const overallRate = Math.round((totalCompleted / totalParticipants) * 100);

  const activeCohorts = cohorts.filter(c => c.status === 'active');
  const closedCohorts = cohorts.filter(c => c.status === 'closed');

  const closedCompleted = closedCohorts.reduce((sum, c) => sum + c.users.filter(u => u.status === 'completed').length, 0);
  const closedTotal = closedCohorts.reduce((sum, c) => sum + c.users.length, 0);
  const closedRate = closedTotal > 0 ? Math.round((closedCompleted / closedTotal) * 100) : 0;

  const urgentCohort = activeCohorts.reduce((worst, c) => {
    const rate = Math.round((c.users.filter(u => u.status === 'completed').length / c.users.length) * 100);
    return (!worst || rate < worst.rate) ? { cohort: c, rate } : worst;
  }, null);

  const insights = [
    `${overallRate}% overall completion across all ${cohorts.length} cohorts (${totalCompleted} of ${totalParticipants} participants).`,
    closedCohorts.length > 0
      ? `${closedCohorts.length} cohort${closedCohorts.length > 1 ? 's are' : ' is'} closed with ${closedRate}% completion.`
      : null,
    activeCohorts.length > 0
      ? `${activeCohorts.length} cohort${activeCohorts.length > 1 ? 's are' : ' is'} currently active.`
      : null,
    urgentCohort && urgentCohort.rate < 50
      ? `${urgentCohort.cohort.name} has the lowest completion at ${urgentCohort.rate}% — consider sending reminders to the ${urgentCohort.cohort.users.filter(u => u.status === 'not_started').length} non-completers.`
      : null,
    totalPending > 0
      ? `${totalPending} participant${totalPending > 1 ? 's have' : ' has'} not yet started their assessment.`
      : 'All participants have completed their assessments — great work!',
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm motion-reduce:transform-none motion-reduce:opacity-100"
    >
      <div className="relative z-10 flex items-start gap-4 p-6">
        <div className="w-12 h-12 rounded-xl bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
          <Sparkles className="w-6 h-6 text-[#00A3E0]" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">AI Assessment Overview</p>
          <div className="space-y-1.5">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium leading-relaxed">
                <div className="w-1 h-1 rounded-full bg-[#00A3E0] mt-2 flex-shrink-0" aria-hidden="true" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-center gap-1 text-center flex-shrink-0" aria-hidden="true">
          <div className="text-3xl font-bold text-[#00A3E0]">{overallRate}%</div>
          <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Overall completion</div>
        </div>
      </div>
    </motion.div>
  );
}

function NotifyModal({ notStartedUsers, onClose }) {
  const [selectedUsers, setSelectedUsers] = useState(notStartedUsers.map(u => u.id));
  const [sent, setSent] = useState(false);

  const toggleUser = (id) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 2000);
  };

  const modalTitleId = 'notify-modal-title';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 id={modalTitleId} className="text-lg font-semibold text-[#3D3D3D]">Send Assessment Reminder</h2>
            <p className="text-xs text-gray-600 mt-0.5">{notStartedUsers.length} participants have not completed their assessment</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog"><X className="w-5 h-5" aria-hidden="true" /></Button>
        </div>

        {sent ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF3] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#12B76A]" />
            </div>
            <p className="text-lg font-semibold text-[#3D3D3D]">Notifications sent!</p>
            <p className="text-sm text-gray-500 mt-1">{selectedUsers.length} participants have been notified.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Recipients */}
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Recipients ({selectedUsers.length} selected)</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {notStartedUsers.map(user => (
                  <label key={user.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                      className="rounded border-gray-300 text-[#3D3D3D]"
                    />
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-600">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#3D3D3D] truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.role} · {user.site}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setSelectedUsers(notStartedUsers.map(u => u.id))} className="text-xs text-[#3D3D3D] underline">Select all</button>
                <span className="text-gray-300">·</span>
                <button onClick={() => setSelectedUsers([])} className="text-xs text-gray-500 underline">Deselect all</button>
              </div>
            </div>


          </div>
        )}

        {!sent && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <Button variant="outline" onClick={onClose} className="border-gray-200 text-gray-600">Cancel</Button>
            <Button
              onClick={handleSend}
              disabled={selectedUsers.length === 0}
              className="bg-[#3D3D3D] hover:bg-[#2a2a2a] text-white gap-2"
            >
              <Send className="w-4 h-4" />
              Send to {selectedUsers.length} participant{selectedUsers.length !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function AssessmentTracking() {
  const [selectedCohortId, setSelectedCohortId] = useState('cohort2');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [siteFilter, setSiteFilter] = useState('all');
  const [cohortPage, setCohortPage] = useState(0);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);

  const selectedCohort = COHORTS.find(c => c.id === selectedCohortId);
  const completed = selectedCohort.users.filter(u => u.status === 'completed');
  const notStarted = selectedCohort.users.filter(u => u.status === 'not_started');
  const completionRate = Math.round((completed.length / selectedCohort.users.length) * 100);

  const sites = [...new Set(selectedCohort.users.map(u => u.site))];

  const filteredUsers = selectedCohort.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roleGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.site.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.roleGroup === roleFilter;
    const matchesSite = siteFilter === 'all' || user.site === siteFilter;
    return matchesSearch && matchesStatus && matchesRole && matchesSite;
  });

  // Pagination for cohort cards
  const totalPages = Math.ceil(COHORTS.length / VISIBLE_COHORT_COUNT);
  const visibleCohorts = COHORTS.slice(cohortPage * VISIBLE_COHORT_COUNT, (cohortPage + 1) * VISIBLE_COHORT_COUNT);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="Executive" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         {/* Breadcrumbs */}
         <Breadcrumbs currentPage="AssessmentTracking" />

         {/* Page Header */}
         <div className="mb-6">
           <h1 className="text-2xl font-bold text-[#3D3D3D]">Assessment Tracking</h1>
           <p className="text-sm text-gray-500 mt-1">Track professional assessment completion by cohort</p>
         </div>

        {/* AI Summary Card */}
        <AISummaryCard cohorts={COHORTS} />

        {/* Cohort Selector with pagination */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cohorts ({COHORTS.length} total)</p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCohortPage(p => Math.max(0, p - 1))}
                  disabled={cohortPage === 0}
                  aria-label="Previous cohorts page"
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D3D3D]"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="text-xs text-gray-600" aria-live="polite">{cohortPage + 1} / {totalPages}</span>
                <button
                  onClick={() => setCohortPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={cohortPage === totalPages - 1}
                  aria-label="Next cohorts page"
                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D3D3D]"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {visibleCohorts.map(cohort => {
              const cohortCompleted = cohort.users.filter(u => u.status === 'completed').length;
              const cohortRate = Math.round((cohortCompleted / cohort.users.length) * 100);
              const statusCfg = COHORT_STATUS_CONFIG[cohort.status];
              const isSelected = cohort.id === selectedCohortId;
              return (
                <button
                  key={cohort.id}
                  onClick={() => { setSelectedCohortId(cohort.id); setSearchTerm(''); setStatusFilter('all'); setRoleFilter('all'); setSiteFilter('all'); }}
                  aria-pressed={isSelected}
                  aria-label={`Select ${cohort.name} (${cohort.label})`}
                  className={`text-left p-5 rounded-xl border-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D3D3D] ${
                    isSelected
                      ? 'border-[#3D3D3D] bg-white shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-[#3D3D3D] text-base">{cohort.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{cohort.label}</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Start: {cohort.startDate}</p>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-500">{cohortCompleted}/{cohort.users.length} completed</span>
                    <span className="font-semibold text-[#3D3D3D]">{cohortRate}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden" aria-hidden="true">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${cohortRate}%`, backgroundColor: cohort.status === 'active' ? '#3D3D3D' : cohort.status === 'closed' ? '#12B76A' : '#D0D5DD' }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Cohort Detail */}
        <motion.div
          key={selectedCohortId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="motion-reduce:transform-none motion-reduce:opacity-100"
        >
          {/* Cohort Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-[#3D3D3D]">{selectedCohort.name} — {selectedCohort.label}</h2>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: COHORT_STATUS_CONFIG[selectedCohort.status].color, backgroundColor: COHORT_STATUS_CONFIG[selectedCohort.status].bg }}
                  >
                    {COHORT_STATUS_CONFIG[selectedCohort.status].label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>Assessment window: {selectedCohort.window}</span>
                </div>
              </div>
              {notStarted.length > 0 && selectedCohort.status !== 'closed' && (
                <Button
                  onClick={() => setNotifyModalOpen(true)}
                  className="bg-[#00A3E0] hover:bg-[#0087b8] text-white gap-2 flex-shrink-0"
                >
                  <Bell className="w-4 h-4" aria-hidden="true" />
                  Notify Incomplete Users ({notStarted.length})
                </Button>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Enrolled</p>
                <p className="text-2xl font-bold text-[#3D3D3D]">{selectedCohort.users.length}</p>
              </div>
              <div className="bg-[#ECFDF3] rounded-lg p-4 border border-green-100">
                <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Completed</p>
                <p className="text-2xl font-bold text-[#0D8A4F]">{completed.length}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide font-semibold">Not Started</p>
                <p className="text-2xl font-bold text-[#4A5568]">{notStarted.length}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                <span className="font-medium">Overall completion progress</span>
                <span className="font-semibold text-[#3D3D3D]">{completionRate}% complete</span>
              </div>
              <div
                className="h-3 bg-gray-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={completionRate}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Overall completion: ${completionRate}%`}
              >
                <div className="h-full bg-[#0D8A4F] transition-all rounded-full" style={{ width: `${completionRate}%` }} />
              </div>
            </div>
          </div>

          {/* Participant Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-semibold text-[#3D3D3D]">Participants ({filteredUsers.length})</h3>
              <div className="flex flex-wrap items-center gap-2">
                 <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                   <label htmlFor="participant-search" className="sr-only">Search participants</label>
                   <input
                     id="participant-search"
                     type="text"
                     placeholder="Search participants..."
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                     className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#3D3D3D] focus-visible:ring-2 focus-visible:ring-[#3D3D3D]/30 w-52"
                   />
                 </div>
                 <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                 <select
                   id="status-filter"
                   value={statusFilter}
                   onChange={e => setStatusFilter(e.target.value)}
                   className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-[#3D3D3D] focus:outline-none focus:border-[#3D3D3D] focus-visible:ring-2 focus-visible:ring-[#3D3D3D]/30"
                 >
                   <option value="all">All Statuses</option>
                   <option value="completed">Completed</option>
                   <option value="not_started">Not Started</option>
                 </select>
                 <label htmlFor="role-filter" className="sr-only">Filter by role group</label>
                 <select
                   id="role-filter"
                   value={roleFilter}
                   onChange={e => setRoleFilter(e.target.value)}
                   className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-[#3D3D3D] focus:outline-none focus:border-[#3D3D3D] focus-visible:ring-2 focus-visible:ring-[#3D3D3D]/30"
                 >
                   <option value="all">All Role Groups</option>
                   <option value="Role Group 1">Role Group 1</option>
                   <option value="Role Group 2">Role Group 2</option>
                   <option value="Role Group 3">Role Group 3</option>
                 </select>
                 <label htmlFor="site-filter" className="sr-only">Filter by site</label>
                 <select
                   id="site-filter"
                   value={siteFilter}
                   onChange={e => setSiteFilter(e.target.value)}
                   className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-[#3D3D3D] focus:outline-none focus:border-[#3D3D3D] focus-visible:ring-2 focus-visible:ring-[#3D3D3D]/30"
                 >
                   <option value="all">All Sites</option>
                   {sites.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label={`Participants in ${selectedCohort.name}`}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th scope="col" className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Participant</th>
                    <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Role Group</th>
                    <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Site</th>
                    <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                    <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(user => {
                    const statusCfg = STATUS_CONFIG[user.status];
                    const StatusIcon = statusCfg.icon;
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-gray-600">
                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <span className="font-medium text-[#3D3D3D]">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600">{user.roleGroup}</td>
                        <td className="px-4 py-4 text-gray-500 text-xs">{user.site}</td>
                        <td className="px-4 py-4">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
                          >
                            <StatusIcon className="w-3 h-3" aria-hidden="true" />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-500">
                          {user.completedDate
                            ? new Date(user.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : user.invitedDate
                              ? `Invited ${new Date(user.invitedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                              : '—'}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                        No participants match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {notifyModalOpen && (
        <NotifyModal
        notStartedUsers={notStarted}
        onClose={() => setNotifyModalOpen(false)}
        />
        )}

      </AnimatePresence>
    </div>
  );
}