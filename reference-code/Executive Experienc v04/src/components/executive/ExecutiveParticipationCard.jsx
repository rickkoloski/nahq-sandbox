import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import ParticipationDetailsModal from './ParticipationDetailsModal';

export default function ExecutiveParticipationCard({ data }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState(null);
  return (
    <div className="space-y-6">
      {/* Overall Completion */}
      <div>
        <h4 className="font-semibold text-[#3D3D3D] mb-4 text-sm">Overall Completion Status for Professional Assessment</h4>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-[#10B981]">{data.totalCompleted}</p>
            <p className="text-xs text-gray-500 mt-1">out of {data.totalInvited} invited</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Not Started</p>
            <p className="text-2xl font-bold text-[#9CA3AF]">{data.totalInvited - data.totalCompleted}</p>
            <p className="text-xs text-gray-500 mt-1">invitation sent</p>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Completion Progress</span>
            <span className="text-sm font-bold text-[#3D3D3D]">{data.completionRate}%</span>
          </div>
          <div className="relative h-4 bg-gray-100/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00A3E0]/80 transition-all rounded-full"
              style={{ width: `${data.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* By Role */}
      <div className="border-t pt-6">
        <h4 className="font-semibold text-[#3D3D3D] mb-4 text-sm">Completion by Role</h4>
        <div className="space-y-4">
          {data.byRole.map((role) => {
            const roleCompletion = Math.round((role.completed / role.invited) * 100);
            return (
              <button
                key={role.role}
                onClick={() => {
                  setSelectedRoleFilter(role.role);
                  setShowDetailsModal(true);
                }}
                className="w-full bg-white rounded-lg p-4 border border-gray-100 hover:border-[#00A3E0] hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm text-[#3D3D3D]">{role.role}</p>
                    <p className="text-xs text-gray-600">{role.completed} of {role.invited} completed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ color: roleCompletion >= 70 ? '#10B981' : '#F59E0B' }}>
                      {roleCompletion}%
                    </p>
                  </div>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00A3E0] transition-all rounded-full"
                    style={{ width: `${roleCompletion}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Button */}
      <div className="border-t pt-4 mt-6">
        <Button 
          onClick={() => setShowDetailsModal(true)}
          className="w-full bg-[#00A3E0] hover:bg-[#0093c9] text-white font-semibold"
        >
          View All Participants
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>



      {/* Modal */}
      <AnimatePresence>
        {showDetailsModal && <ParticipationDetailsModal onClose={() => {
          setShowDetailsModal(false);
          setSelectedRoleFilter(null);
        }} initialRoleFilter={selectedRoleFilter} />}
      </AnimatePresence>
    </div>
  );
}