import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { FileText, BookOpen, User, HelpCircle, ChevronDown, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import ViewModeToggle from './ViewModeToggle';

export default function Header({ currentPage = 'home', userName = 'Sarah' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('IndividualHome')} className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png" 
              alt="NAHQ Logo" 
              className="h-10 w-auto"
            />
            <span className="hidden sm:block text-sm font-semibold text-[#3D3D3D] border-l border-gray-300 pl-3">
              Accelerate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-[#00A3E0]/10 text-[#00A3E0]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link to={createPageUrl('Framework')}>
              <Button variant="ghost" size="icon" className="hidden sm:flex text-gray-500 hover:text-gray-700">
                <HelpCircle className="w-5 h-5" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 rounded-full bg-[#00A3E0]/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#00A3E0]" />
                  </div>
                  <span className="hidden sm:block font-medium">{userName}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl('Profile')} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl('Framework')} className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Framework
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl('IndividualDashboard')} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    My Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl('DemoLogin')} className="flex items-center gap-2 text-red-500 hover:text-red-600">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.page)}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-[#00A3E0]/10 text-[#00A3E0]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}