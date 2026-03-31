import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Filter, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SAMPLE_USERS = [
  // Completed
  { id: 1, name: 'Sarah Johnson', role: 'Director of Quality', status: 'completed', completedDate: '2026-01-25', score: 2.1 },
  { id: 2, name: 'Michael Chen', role: 'Director of Quality', status: 'completed', completedDate: '2026-01-22', score: 2.0 },
  { id: 3, name: 'Jessica Lee', role: 'Quality Manager', status: 'completed', completedDate: '2026-01-20', score: 1.8 },
  { id: 4, name: 'Robert Martinez', role: 'Quality Manager', status: 'completed', completedDate: '2026-01-18', score: 1.75 },
  
  // Not Started
  { id: 5, name: 'David Anderson', role: 'Quality Manager', status: 'not_started', invitedDate: '2026-01-27' },
  { id: 6, name: 'Emily Rodriguez', role: 'Quality Specialist', status: 'not_started', invitedDate: '2026-01-24' },
  { id: 7, name: 'James Wilson', role: 'Quality Specialist', status: 'not_started', invitedDate: '2026-01-26' },
  { id: 8, name: 'Patricia Brown', role: 'Quality Specialist', status: 'not_started', invitedDate: '2026-01-15' },
  { id: 9, name: 'Daniel Garcia', role: 'Quality Specialist', status: 'not_started', invitedDate: '2026-01-20' },
  { id: 10, name: 'Susan Taylor', role: 'Quality Manager', status: 'not_started', invitedDate: '2026-01-25' },
];

const STATUS_COLORS = {
  completed: { bg: '#10B981', text: 'Completed', light: '#D1FAE5' },
  not_started: { bg: '#9CA3AF', text: 'Not Started', light: '#F3F4F6' }
};

export default function ParticipationDetailsModal({ onClose, initialRoleFilter = null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState(initialRoleFilter || 'all');

  const filteredUsers = SAMPLE_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const completed = filteredUsers.filter(u => u.status === 'completed');
  const notStarted = filteredUsers.filter(u => u.status === 'not_started');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#00A3E0]/5 to-transparent">
          <div>
            <h2 className="text-2xl font-bold text-[#3D3D3D]">Assessment Participation Details</h2>
             <p className="text-sm text-gray-600 mt-1">See who has completed or hasn't started</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="space-y-3">
            <div>
              <Input
                placeholder="Search by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-200 focus:border-[#00A3E0]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-2">
                <span className="text-xs text-gray-600 font-semibold self-center">Status:</span>
                {['all', 'completed', 'not_started'].map(status => (
                  <Button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    className={status === filterStatus ? 'bg-[#00A3E0]' : ''}
                  >
                    {status === 'all' ? 'All' : status === 'completed' ? 'Completed' : 'Not Started'}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <span className="text-xs text-gray-600 font-semibold self-center">Role:</span>
                {['all', 'Director of Quality', 'Quality Manager', 'Quality Specialist'].map(role => (
                  <Button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    variant={filterRole === role ? 'default' : 'outline'}
                    size="sm"
                    className={role === filterRole ? 'bg-[#00A3E0]' : ''}
                  >
                    {role === 'all' ? 'All Roles' : role}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Completed Section */}
          {completed.length > 0 && (
            <div>
              <h3 className="font-semibold text-[#3D3D3D] mb-3 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.completed.bg }} />
                Completed ({completed.length})
              </h3>
              <div className="space-y-2">
                {completed.map(user => (
                  <div key={user.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-[#3D3D3D]">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#8BC53F]">Score: {user.score.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">Completed {new Date(user.completedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not Started Section */}
          {notStarted.length > 0 && (
            <div>
              <h3 className="font-semibold text-[#3D3D3D] mb-3 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.not_started.bg }} />
                Not Started ({notStarted.length})
              </h3>
              <div className="space-y-2">
                {notStarted.map(user => (
                  <div key={user.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-[#3D3D3D]">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Invited {new Date(user.invitedDate).toLocaleDateString()}</p>
                        <Button size="sm" className="mt-2 h-7 text-xs">Send Reminder</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insight */}
          <div className="bg-gradient-to-br from-[#00A3E0]/5 to-[#00B5E2]/5 border border-[#00A3E0]/20 rounded-lg p-4 mt-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#3D3D3D] text-sm mb-1">AI Insight</p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Your completion rate is strong at 72%. Focus on engaging the 10 team members who haven't started yet, particularly in the Quality Specialist role where engagement is lower. Consider sending a reminder with the business case for their participation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}