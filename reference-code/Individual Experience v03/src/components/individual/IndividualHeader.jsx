import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { createPageUrl } from '@/utils';
import Header from '../shared/Header';

export default function IndividualHeader({ breadcrumbs = [] }) {
  return (
    <>
      <Header currentPage="Individual" />
      {breadcrumbs.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-[#00A3E0] transition-colors font-medium">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#3D3D3D] font-semibold truncate">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}