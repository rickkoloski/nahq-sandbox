import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InvitationEmail() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Email container */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#009FE8] to-[#414042] px-8 py-8">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png"
              alt="NAHQ"
              className="h-8 w-auto brightness-0 invert"
            />
          </div>

          {/* Content */}
          <div className="px-8 py-12">
            {/* Greeting */}
            <h1 className="text-3xl font-bold text-[#3D3D3D] mb-2">
              Welcome to Accelerate
            </h1>
            <p className="text-gray-500 text-lg mb-8">
              Your invitation to join the Healthcare Quality Workforce Competency Platform
            </p>

            {/* Video section */}
            <div className="mb-8 relative rounded-2xl overflow-hidden h-96" style={{ background: 'linear-gradient(135deg, #009FE8 0%, #414042 100%)' }}>
              {/* Decorative blobs */}
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white" />
              <div className="absolute -bottom-20 -left-12 w-72 h-72 rounded-full opacity-10 bg-white" />
              <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full opacity-5 bg-white" />
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
                <div className="text-white/80 mb-6">
                  <svg className="w-20 h-20 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Video: Welcome to Accelerate</h3>
                <p className="text-white/70 text-sm max-w-xs mb-8">Get a 3-minute overview of how the platform works</p>
                
                {/* Play button */}
                <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow transform hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-[#009FE8] fill-[#009FE8] ml-1" />
                </button>
              </div>
            </div>

            {/* Body text */}
            <div className="space-y-4 mb-8 text-gray-600">
              <p>
                Your organization has invited you to join <strong>Accelerate</strong>, powered by the NAHQ Healthcare Quality Competency Framework.
              </p>
              <p>
                This innovative platform helps healthcare quality professionals:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Assess competencies across 8 domains and 28 competencies</li>
                <li>Identify skill gaps with data-driven insights</li>
                <li>Build personalized learning and development plans</li>
                <li>Track progress and achieve career growth</li>
              </ul>
              <p>
                Your journey starts with a personalized competency assessment—it takes about 45 minutes and gives you an honest, developmental baseline of your current capabilities.
              </p>
            </div>

            {/* CTA Button */}
            <Link to={createPageUrl('IndividualOnboarding')}>
              <Button className="w-full h-12 bg-[#009FE8] hover:bg-[#0086b8] text-white text-base font-semibold rounded-lg">
                Accept Invitation & Get Started
              </Button>
            </Link>

            {/* Footer text */}
            <p className="text-xs text-gray-400 text-center mt-6">
              If you have questions about this invitation, reach out to your organization's administrator.
            </p>
          </div>

          {/* Email footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6978f965d09546069bd9609b/a94c116b2_image.png"
                alt="NAHQ"
                className="h-6 w-auto brightness-0 invert opacity-50"
              />
            </div>
            <p className="text-xs text-gray-400 text-center">
              © 2026 National Association for Healthcare Quality. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}