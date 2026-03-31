import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { createPageUrl } from '@/utils';

/**
 * Breadcrumb component matching Untitled UI pattern.
 * 
 * items: Array of { label, href? } — last item is current page (no href needed)
 * showHome: boolean — whether to prepend a Home icon link
 */
export default function Breadcrumb({ items = [], showHome = true }) {
  const allItems = showHome
    ? [{ label: 'Home', href: createPageUrl('IndividualHome'), icon: Home }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            )}
            {isLast ? (
              <span className="font-semibold text-[#3D3D3D] truncate max-w-[200px]">
                {Icon && <Icon className="w-4 h-4 inline-block mr-1 -mt-0.5" />}
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="hover:text-[#00A3E0] transition-colors font-medium flex items-center gap-1 flex-shrink-0"
                style={item.color ? { color: item.color } : {}}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {!Icon && item.label}
                {Icon && !item.label && null}
                {Icon && item.label && item.label}
              </Link>
            ) : (
              <span className="font-medium flex items-center gap-1 flex-shrink-0" style={item.color ? { color: item.color } : {}}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}