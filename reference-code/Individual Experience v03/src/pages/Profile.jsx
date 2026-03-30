import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Building2, Users, GraduationCap, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/shared/Header';

export default function Profile() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@healthcare.org',
    jobTitle: 'Quality Director',
    organization: 'Metro Healthcare System',
    organizationSize: '500-1000',
    yearsExperience: '8',
    educationLevel: 'Masters',
    certifications: 'CPHQ',
    primaryRole: 'Quality Management',
    careerGoals: 'Advance to VP of Quality within 2 years'
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
      <Header currentPage="Profile" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#00A3E0]/10 flex items-center justify-center">
              <User className="w-6 h-6 text-[#00A3E0]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#3D3D3D]">
              Account & Profile Settings
            </h1>
          </div>
          <p className="text-gray-600">
            Manage your personal information and professional background
          </p>
        </motion.div>

        {/* Success Message */}
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">Profile updated successfully!</p>
          </motion.div>
        )}

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-[#00A3E0]" />
            <h2 className="text-lg font-semibold text-[#3D3D3D]">Personal Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="border-gray-200"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="border-gray-200"
              />
            </div>
          </div>
        </motion.div>

        {/* Professional Background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-[#00A3E0]" />
            <h2 className="text-lg font-semibold text-[#3D3D3D]">Professional Background</h2>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700 mb-2 block">
                  Current Job Title
                </Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  className="border-gray-200"
                />
              </div>

              <div>
                <Label htmlFor="primaryRole" className="text-sm font-medium text-gray-700 mb-2 block">
                  Primary Role
                </Label>
                <Select value={formData.primaryRole} onValueChange={(value) => handleChange('primaryRole', value)}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quality Management">Quality Management</SelectItem>
                    <SelectItem value="Patient Safety">Patient Safety</SelectItem>
                    <SelectItem value="Regulatory Compliance">Regulatory Compliance</SelectItem>
                    <SelectItem value="Performance Improvement">Performance Improvement</SelectItem>
                    <SelectItem value="Clinical Excellence">Clinical Excellence</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="yearsExperience" className="text-sm font-medium text-gray-700 mb-2 block">
                  Years of Experience
                </Label>
                <Select value={formData.yearsExperience} onValueChange={(value) => handleChange('yearsExperience', value)}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-15">11-15 years</SelectItem>
                    <SelectItem value="16+">16+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="educationLevel" className="text-sm font-medium text-gray-700 mb-2 block">
                  Education Level
                </Label>
                <Select value={formData.educationLevel} onValueChange={(value) => handleChange('educationLevel', value)}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Associates">Associate's Degree</SelectItem>
                    <SelectItem value="Bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="Masters">Master's Degree</SelectItem>
                    <SelectItem value="Doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="certifications" className="text-sm font-medium text-gray-700 mb-2 block">
                Professional Certifications
              </Label>
              <Input
                id="certifications"
                placeholder="e.g., CPHQ, CPPS, CQA"
                value={formData.certifications}
                onChange={(e) => handleChange('certifications', e.target.value)}
                className="border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple certifications with commas</p>
            </div>
          </div>
        </motion.div>

        {/* Organization Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-[#00A3E0]" />
            <h2 className="text-lg font-semibold text-[#3D3D3D]">Organization Information</h2>
          </div>

          <div>
              <Label htmlFor="organization" className="text-sm font-medium text-gray-700 mb-2 block">
                Organization Name
              </Label>
              <Input
                id="organization"
                value={formData.organization}
                disabled
                className="border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Organization name is managed by your administrator</p>
          </div>
        </motion.div>

        {/* Career Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-[#00A3E0]" />
            <h2 className="text-lg font-semibold text-[#3D3D3D]">Career Development</h2>
          </div>

          <div>
            <Label htmlFor="careerGoals" className="text-sm font-medium text-gray-700 mb-2 block">
              Career Goals
            </Label>
            <Textarea
              id="careerGoals"
              placeholder="Describe your professional development goals..."
              value={formData.careerGoals}
              onChange={(e) => handleChange('careerGoals', e.target.value)}
              className="border-gray-200 min-h-24"
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps us personalize your learning recommendations
            </p>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end"
        >
          <Button 
            onClick={handleSave}
            className="bg-[#00A3E0] hover:bg-[#0093c9] text-white px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </main>
    </div>
  );
}