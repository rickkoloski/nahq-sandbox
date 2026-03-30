import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Shield, Archive, Sliders, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Header from '@/components/shared/Header';

const CURRENT_USERS = [
  { id: 1, name: 'Sarah Chen', role: 'Director of Quality', email: 'sarah.chen@hospital.org', status: 'active', completedDate: '2026-01-25' },
  { id: 2, name: 'James Rodriguez', role: 'Quality Manager', email: 'james.rodriguez@hospital.org', status: 'active', completedDate: '2026-01-22' },
  { id: 3, name: 'Maria Garcia', role: 'Quality Manager', email: 'maria.garcia@hospital.org', status: 'active', completedDate: '2026-01-20' },
  { id: 4, name: 'David Kim', role: 'Quality Specialist', email: 'david.kim@hospital.org', status: 'active', completedDate: '2026-01-18' },
];

const DEACTIVATED_USERS = [
  { id: 5, name: 'Jennifer Lee', role: 'Director of Quality', email: 'jennifer.lee@hospital.org', status: 'deactivated', deactivatedDate: '2025-11-15' },
  { id: 6, name: 'Michael Brown', role: 'Quality Manager', email: 'michael.brown@hospital.org', status: 'deactivated', deactivatedDate: '2025-10-20' },
];

export default function ManageUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [includeDeactivated, setIncludeDeactivated] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', role: '' });

  const filterUsers = (users) => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const currentUsers = filterUsers(CURRENT_USERS);
  const deactivatedUsers = filterUsers(DEACTIVATED_USERS);
  const displayedDeactivated = includeDeactivated ? deactivatedUsers : [];

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    // Here the form data would be sent to NAHQ
    console.log('Sending to NAHQ:', formData);
    setFormData({ firstName: '', lastName: '', email: '', role: '' });
    setShowRequestForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="Manage Users" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D3D3D]">
            Manage User Accounts
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            View your organization's team members and request new user invitations from NAHQ.
          </p>
        </motion.div>

        {/* Request New User Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#00A3E0]/5 to-[#00B5E2]/5 rounded-2xl p-6 border border-[#00A3E0]/20 mb-12"
        >
          {!showRequestForm ? (
            <button
              onClick={() => setShowRequestForm(true)}
              className="flex items-center gap-3 text-[#00A3E0] hover:text-[#0093c9] font-semibold transition-colors w-full"
            >
              <Plus className="w-5 h-5" />
              Request New User Invitation from NAHQ
            </button>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <h3 className="font-semibold text-[#3D3D3D] mb-4">Request New User</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                  className="border-gray-200"
                />
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                  className="border-gray-200"
                />
              </div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="border-gray-200"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#00A3E0]"
              >
                <option value="">Select Role</option>
                <option value="Director of Quality">Director of Quality</option>
                <option value="Quality Manager">Quality Manager</option>
                <option value="Quality Specialist">Quality Specialist</option>
                <option value="Quality Analyst">Quality Analyst</option>
              </select>
              <div className="flex gap-3">
                <Button type="submit" className="bg-[#00A3E0] hover:bg-[#0093c9] text-white">
                  Submit Request to NAHQ
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                Your request will be sent to NAHQ, where an administrator will set up the account and send an invitation to the user.
              </p>
            </form>
          )}
        </motion.div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 mb-12"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0">
                <Sliders className="w-5 h-5 text-[#00A3E0]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#3D3D3D]">Include Deactivated Users in Results</h3>
                <p className="text-sm text-gray-600 mt-1">
                  When enabled, deactivated users' historical data will be included in your aggregated organizational results.
                </p>
              </div>
            </div>
            <Switch checked={includeDeactivated} onCheckedChange={setIncludeDeactivated} />
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-200 focus:border-[#00A3E0]"
          />
        </div>

        {/* Active Users Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-lg font-semibold text-[#3D3D3D] mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#10B981]" />
            Active Users ({currentUsers.length})
          </h2>
          <div className="space-y-3">
            {currentUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-[#00A3E0]/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-[#3D3D3D]">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#10B981]/10 text-[#10B981]">
                      Active
                    </span>
                    <p className="text-xs text-gray-600 mt-2">Completed {new Date(user.completedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Deactivated Users Section */}
        {displayedDeactivated.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-lg font-semibold text-[#3D3D3D] mb-4 flex items-center gap-2">
              <Archive className="w-5 h-5 text-[#9CA3AF]" />
              Deactivated Users ({displayedDeactivated.length})
            </h2>
            <div className="space-y-3">
              {displayedDeactivated.map((user) => (
                <div key={user.id} className="bg-white rounded-lg p-4 border border-gray-100 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-[#3D3D3D]">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.role}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#9CA3AF]/10 text-[#9CA3AF]">
                        Deactivated
                      </span>
                      <p className="text-xs text-gray-600 mt-2">Deactivated {new Date(user.deactivatedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {currentUsers.length === 0 && displayedDeactivated.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No users found matching your search.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}