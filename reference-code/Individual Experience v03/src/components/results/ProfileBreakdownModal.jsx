import React from 'react';
import { motion } from 'framer-motion';
import { X, Users, TrendingUp, CheckCircle, AlertCircle, Bot, Award, Target, ArrowRight, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProfileBreakdownModal({ results, onClose }) {
  const strengths = results.domains.filter(d => d.isStrength);
  const gaps = results.domains.filter(d => d.isGap);
  const developing = results.domains.filter(d => !d.isStrength && !d.isGap);

  const getProfileType = () => {
    if (results.domains.filter(d => d.score >= 2.0).length >= 3) {
      return {
        title: 'Strategic Leader Profile',
        description: 'You excel at high-level strategic work with strong leadership and compliance foundations.',
        icon: Award,
        color: '#10B981'
      };
    }
    return {
      title: 'Balanced Practitioner Profile',
      description: 'You have well-rounded competencies across multiple domains.',
      icon: Users,
      color: '#3B82F6'
    };
  };

  const profileType = getProfileType();
  const ProfileIcon = profileType.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#00A3E0]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A3E0]/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#00A3E0]" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-[#3D3D3D]">Your Professional Profile</h2>
              <p className="text-xs text-gray-500">Competency distribution analysis</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Type */}
          <div 
            className="rounded-2xl p-6 border-2"
            style={{ 
              backgroundColor: `${profileType.color}08`,
              borderColor: `${profileType.color}30`
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${profileType.color}20` }}
              >
                <ProfileIcon className="w-7 h-7" style={{ color: profileType.color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-[#3D3D3D] mb-2">{profileType.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{profileType.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/80 rounded-xl p-4 text-center border border-gray-100">
                <div className="text-3xl font-bold text-green-600 mb-1">{strengths.length}</div>
                <p className="text-xs text-gray-600">Advanced/<br/>High Proficient</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 text-center border border-gray-100">
                <div className="text-3xl font-bold text-blue-600 mb-1">{developing.length}</div>
                <p className="text-xs text-gray-600">Proficient &<br/>Developing</p>
              </div>
              <div className="bg-white/80 rounded-xl p-4 text-center border border-gray-100">
                <div className="text-3xl font-bold text-orange-600 mb-1">{gaps.length}</div>
                <p className="text-xs text-gray-600">Growth<br/>Opportunities</p>
              </div>
            </div>
          </div>

          {/* AI Profile Analysis */}
          <div className="bg-gradient-to-br from-[#00A3E0]/5 via-[#00B5E2]/5 to-transparent border border-[#00A3E0]/20 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#3D3D3D] mb-1">What Your Profile Reveals</h3>
                <p className="text-xs text-gray-500">AI-powered insights about your competency distribution</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                Your profile shows a <strong>classic pattern for quality leaders</strong> moving into senior roles. 
                You've built strong capabilities in strategic areas (Leadership, Safety, Compliance) while having 
                opportunities to deepen technical skills.
              </p>
              
              <p>
                <strong>What makes you stand out:</strong> Your {strengths.length} advanced-level domains 
                position you in the <strong>top quartile</strong> for Quality Managers. Most professionals at your 
                level have 1-2 advanced domains—you have {strengths.length}.
              </p>
              
              <p>
                <strong>Your career trajectory:</strong> This profile is typical of professionals 6-10 years into 
                their quality career who are ready for Director or VP roles. The gap in Analytics is your primary 
                opportunity to accelerate advancement.
              </p>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-green-50 rounded-xl p-5 border border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-[#3D3D3D]">Your Strength Domains</h3>
            </div>
            
            <div className="space-y-3">
              {strengths.map((domain) => (
                <div key={domain.name} className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-[#3D3D3D] mb-1">{domain.name}</h4>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-green-700">{domain.score.toFixed(1)}</span>
                        <span className="text-gray-500">{domain.level}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-green-600 font-medium">{domain.percentile}th percentile</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This is a core strength that sets you apart from peers. Continue to leverage and maintain this expertise.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Developing Areas */}
          {developing.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-[#3D3D3D]">Proficient & Developing Domains</h3>
              </div>
              
              <div className="space-y-2">
                {developing.map((domain) => (
                  <div key={domain.name} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-[#3D3D3D]">{domain.name}</h4>
                        <div className="flex items-center gap-3 text-xs mt-1">
                          <span className="font-bold text-blue-700">{domain.score.toFixed(1)}</span>
                          <span className="text-gray-500">{domain.level}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Growth Opportunities */}
          <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-[#3D3D3D]">Priority Growth Opportunities</h3>
            </div>
            
            <div className="space-y-3">
              {gaps.map((domain) => (
                <div key={domain.name} className="bg-white rounded-lg p-4 border border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-[#3D3D3D] mb-1">{domain.name}</h4>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-orange-700">{domain.score.toFixed(1)}</span>
                        <span className="text-gray-500">{domain.level}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-orange-600 font-medium">{domain.percentile}th percentile</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-2">
                    <strong>Why this matters:</strong> Combined with your leadership strengths, developing this skill 
                    will significantly amplify your impact and open doors to senior positions.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Target className="w-3 h-3 text-orange-600" />
                    <span className="text-orange-700 font-medium">High priority for your development plan</span>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          <div className="flex gap-3">
            <Link to={createPageUrl('PlanGeneration')} className="flex-1">
              <Button className="w-full bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold">
                <Map className="w-4 h-4 mr-2" />
                Develop My Personal Roadmap
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button 
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}