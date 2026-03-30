import React from 'react';
import { Bot, TrendingUp, Target, Lightbulb, ArrowUp, Award } from 'lucide-react';

export default function AIAnalysisSummary({ results, domainName, onViewCourses }) {
  const domain = results.domains.find(d => d.name === domainName);
  if (!domain) return null;

  const isStrength = domain.score >= domain.benchmark;
  const gap = domain.benchmark - domain.score;
  const isHighPriority = domain.priority === 'HIGH PRIORITY';

  return (
    <div className="bg-gradient-to-br from-[#00A3E0]/5 via-white to-[#00B5E2]/5 rounded-xl border border-[#00A3E0]/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A3E0] to-[#00B5E2] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-base">AI Analysis & Course Recommendations</h4>
            <p className="text-xs text-white/90 mt-0.5">Personalized insights based on your assessment</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* What This Means for You */}
        <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4 text-[#00A3E0]" />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-bold text-[#3D3D3D] mb-2">What This Means for You</h5>
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                {isStrength ? (
                  <>
                    <p>
                      You're <strong>effectively applying {domainName} skills</strong> in your daily work. This shows you regularly engage in 
                      proficient or advanced-level activities in this area—like implementing processes independently, solving complex problems, 
                      or leading initiatives.
                    </p>
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-2">
                      <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <p className="text-xs text-green-800">
                        <strong>This is a strength</strong> — Continue building on this foundation to expand your impact
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      Your assessment shows you're <strong>building foundational skills</strong> in {domainName}. You're likely familiar with 
                      core concepts and perform some activities in this area, but haven't yet applied them regularly or independently in 
                      your role.
                    </p>
                    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 mt-2 ${
                      isHighPriority 
                        ? 'bg-orange-50 border border-orange-200' 
                        : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <ArrowUp className={`w-4 h-4 flex-shrink-0 ${isHighPriority ? 'text-orange-600' : 'text-blue-600'}`} />
                      <p className={`text-xs ${isHighPriority ? 'text-orange-800' : 'text-blue-800'}`}>
                        <strong>Development opportunity</strong> — Growing these skills will increase your effectiveness and confidence{' '}
                        {isHighPriority && <span className="font-bold">• HIGHEST IMPACT AREA</span>}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
                      <em>Context: Your score ({domain.score.toFixed(1)}) reflects typical skill levels at the {domain.level.toLowerCase()} stage. 
                      The {domain.benchmark.toFixed(1)} benchmark shows where {results.position} roles typically grow to over time with experience and learning.</em>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* How to Grow These Skills */}
        <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4 text-[#00A3E0]" />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-bold text-[#3D3D3D] mb-2">How to Grow These Skills</h5>
              <p className="text-sm text-gray-700 leading-relaxed">
                {isStrength ? (
                  <>
                    Your recommended courses help you <strong>advance to strategic-level work</strong>—like designing frameworks, 
                    mentoring others, and leading organization-wide initiatives. They'll deepen your expertise so you can 
                    guide teams and influence policy decisions.
                  </>
                ) : (
                  <>
                    The courses teach you <strong>practical, applied skills</strong> you can use right away in your role. You'll learn 
                    how to perform key activities independently, understand when and why to apply different approaches, and build 
                    confidence through hands-on practice with real-world scenarios.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* What You'll Be Able to Do */}
        <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#00A3E0]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-[#00A3E0]" />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-bold text-[#3D3D3D] mb-2">What You'll Be Able to Do</h5>
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                {isStrength ? (
                  <>
                    <p>
                      You'll expand your ability to <strong>design and lead strategic initiatives</strong>, mentor team members, 
                      and advise leadership on organizational direction in {domainName}.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2">
                      <li>Develop organization-wide frameworks and policies</li>
                      <li>Coach and train others to build team capabilities</li>
                      <li>Influence strategic decisions at executive levels</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p>
                      After completing these courses, you'll confidently <strong>apply {domainName} skills independently</strong> in your daily work:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2">
                      <li>Perform key activities without needing supervision or guidance</li>
                      <li>Solve problems and make informed decisions in this domain</li>
                      <li>Take on projects and responsibilities that require this expertise</li>
                      <li>Support and guide colleagues who are building these skills</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#00A3E0] to-[#00B5E2] rounded-lg p-5 border-2 border-[#00A3E0]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h5 className="text-sm font-bold text-white mb-2">✨ Your Next Step</h5>
              <p className="text-sm text-white/95 leading-relaxed">
                Review your personalized course recommendations to see specific learning activities that will help you develop these skills. 
                Each course connects directly to the competencies identified in your assessment.
              </p>
            </div>
            <button
              onClick={onViewCourses}
              className="flex-shrink-0 bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-bold px-5 py-2.5 rounded-lg transition-all text-sm shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              View Courses →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}