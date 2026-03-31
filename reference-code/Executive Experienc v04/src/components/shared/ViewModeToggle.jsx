import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ViewModeToggle() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('individual');

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('viewMode') || 'individual';
    setViewMode(savedMode);
  }, []);

  const handleModeChange = (mode) => {
    localStorage.setItem('viewMode', mode);
    setViewMode(mode);
    
    // Navigate to appropriate home page
    if (mode === 'executive') {
      navigate(createPageUrl('ExecutiveOverview'));
    } else {
      navigate(createPageUrl('Home'));
    }
  };

  // Only show toggle if user is in executive role (would be passed from auth context in production)
  const isExecutive = true; // TODO: Get from auth context

  if (!isExecutive) return null;

  const isExecutiveView = viewMode === 'executive';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`hidden sm:flex items-center gap-2 transition-all ${
            isExecutiveView
              ? 'border-[#8BC53F] text-[#8BC53F] hover:bg-[#8BC53F]/5'
              : 'border-[#00A3E0] text-[#00A3E0] hover:bg-[#00A3E0]/5'
          }`}
        >
          {isExecutiveView ? (
            <Users className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
          {isExecutiveView ? 'Executive View' : 'My View'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleModeChange('individual')}
          className={viewMode === 'individual' ? 'bg-[#00A3E0]/10' : ''}
        >
          <User className="w-4 h-4 mr-2" />
          <span>My Individual View</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleModeChange('executive')}
          className={viewMode === 'executive' ? 'bg-[#8BC53F]/10' : ''}
        >
          <Users className="w-4 h-4 mr-2" />
          <span>Executive View</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}