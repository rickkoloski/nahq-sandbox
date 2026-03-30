import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight } from 'lucide-react';

const BREADCRUMB_MAP = {
  'ExecutiveOverview': [{ label: 'Home', page: 'ExecutiveOverview' }],
  'Assessment': [{ label: 'Home', page: 'ExecutiveOverview' }, { label: 'Assessment' }],
  'AssessmentTracking': [{ label: 'Home', page: 'ExecutiveOverview' }, { label: 'Assessment Tracking' }],
  'ExecutiveDashboard': [{ label: 'Home', page: 'ExecutiveOverview' }, { label: 'Dashboard' }],
  'ManageUsers': [{ label: 'Home', page: 'ExecutiveOverview' }, { label: 'Manage Users' }],
  'OrganizationalFramework': [{ label: 'Home', page: 'ExecutiveOverview' }, { label: 'Framework' }],
  'CompetencyDetail': [{ label: 'Home', page: 'ExecutiveOverview' }, { label: 'Dashboard', page: 'ExecutiveDashboard' }, { label: 'Competency Detail' }],
};

export default function Breadcrumbs({ currentPage }) {
  const breadcrumbs = BREADCRUMB_MAP[currentPage] || [];

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          {crumb.page ? (
            <Link
              to={createPageUrl(crumb.page)}
              className="text-sm text-[#00A3E0] hover:underline"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-sm text-gray-600">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}