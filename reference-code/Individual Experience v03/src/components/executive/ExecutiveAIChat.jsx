import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CONTEXT_DESCRIPTIONS = {
  participation: 'Assessment Participation & Adoption',
  capability: 'Organizational Capability Snapshot',
  benchmarking: 'Benchmarking & Comparative Views',
  reassessment: 'Change Over Time & Reassessment'
};

const SUGGESTED_QUESTIONS = {
  participation: [
    'What percentage of our team has completed the assessment?',
    'Which role has the lowest completion rate?',
    'How do we compare by hospital location?'
  ],
  capability: [
    'How do we compare to the NAHQ benchmark?',
    'What are our strongest domains?',
    'Which domain needs the most development?',
    'What does our score distribution look like?'
  ],
  benchmarking: [
    'How do we compare to similar organizations?',
    'What\'s our biggest gap to benchmark?',
    'Which domains should we prioritize for development?',
    'What benchmark view would help our planning?'
  ],
  reassessment: [
    'How much have we improved year-over-year?',
    'Which domains showed the most growth?',
    'When should we schedule the next assessment?',
    'What\'s our improvement trajectory?'
  ]
};

// Competency data for detailed insights
const COMPETENCY_DATABASE = {
  'Quality Leadership': {
    competencies: [
      { name: 'Lead and sponsor quality initiatives', yourScore: 1.8, benchmark: 2.1 },
      { name: 'Foster a culture of continuous improvement', yourScore: 1.9, benchmark: 2.2 },
      { name: 'Communicate quality priorities and results', yourScore: 1.7, benchmark: 2.0 },
      { name: 'Build and sustain cross-functional teams', yourScore: 1.6, benchmark: 1.9 }
    ]
  },
  'Patient Safety': {
    competencies: [
      { name: 'Create and maintain a safe environment', yourScore: 1.9, benchmark: 2.0 },
      { name: 'Identify and mitigate patient safety risks', yourScore: 1.8, benchmark: 2.1 },
      { name: 'Respond to and learn from safety events', yourScore: 2.0, benchmark: 2.2 }
    ]
  },
  'Health Data Analytics': {
    competencies: [
      { name: 'Apply procedures for governance of data assets', yourScore: 1.5, benchmark: 2.0 },
      { name: 'Design data collection plans', yourScore: 1.4, benchmark: 2.1 },
      { name: 'Acquire data from source systems', yourScore: 1.3, benchmark: 1.9 }
    ]
  },
  'Performance Improvement': {
    competencies: [
      { name: 'Use data to identify improvement opportunities', yourScore: 1.5, benchmark: 2.0 },
      { name: 'Plan and implement improvement initiatives', yourScore: 1.6, benchmark: 2.1 }
    ]
  }
};

export default function ExecutiveAIChat({ isOpen, onClose, context, data, competencyData }) {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: `Hi! I'm here to help you understand your ${CONTEXT_DESCRIPTIONS[context] || 'assessment results'}. What would you like to know?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'assistant',
        content: generateResponse(input, context, data)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleSuggestedQuestion = (question) => {
    const userMessage = { type: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = {
        type: 'assistant',
        content: generateResponse(question, context, data)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const generateResponse = (userInput, context, data) => {
    const input_lower = userInput.toLowerCase();
    
    // Check if user is asking about a specific domain
    const domainNames = Object.keys(COMPETENCY_DATABASE);
    const mentionedDomain = domainNames.find(domain => input_lower.includes(domain.toLowerCase()));
    
    if (mentionedDomain) {
      const competencies = COMPETENCY_DATABASE[mentionedDomain].competencies;
      const avgYourScore = competencies.reduce((sum, c) => sum + c.yourScore, 0) / competencies.length;
      const avgBenchmark = competencies.reduce((sum, c) => sum + c.benchmark, 0) / competencies.length;
      const gap = avgBenchmark - avgYourScore;
      const gapPct = ((gap / avgBenchmark) * 100).toFixed(0);
      
      const strongestComp = competencies.reduce((max, c) => c.yourScore > max.yourScore ? c : max);
      const weakestComp = competencies.reduce((min, c) => c.yourScore < min.yourScore ? c : min);
      const priorityComps = competencies.filter(c => (c.benchmark - c.yourScore) > 0.2);
      
      let response = `## ${mentionedDomain}\n\n`;
      response += `**Current State:**\n`;
      response += `Your organization: **${avgYourScore.toFixed(2)}/3.0** (${avgYourScore < 1.7 ? 'Foundational' : avgYourScore < 2.4 ? 'Proficient' : 'Advanced'})\n`;
      response += `NAHQ Benchmark: **${avgBenchmark.toFixed(2)}/3.0**\n`;
      response += `Gap: **${Math.abs(gap).toFixed(2)} points** (${gapPct}% below benchmark)\n\n`;
      
      response += `**Competency Breakdown:**\n`;
      competencies.forEach(comp => {
        const compGap = comp.benchmark - comp.yourScore;
        const status = compGap > 0.2 ? '🔴 Priority' : compGap > 0 ? '🟡 Monitor' : '🟢 Strength';
        response += `• **${comp.name}:** ${comp.yourScore.toFixed(1)} → ${comp.benchmark.toFixed(1)} ${status}\n`;
      });
      
      response += `\n**Recommended Actions:**\n`;
      response += `1. **Focus first on:** "${weakestComp.name}" (currently ${weakestComp.yourScore.toFixed(1)}, target ${weakestComp.benchmark.toFixed(1)})\n`;
      response += `2. **Leverage strength in:** "${strongestComp.name}" (${strongestComp.yourScore.toFixed(1)}/3.0) - use as mentoring opportunity\n`;
      if (priorityComps.length > 0) {
        response += `3. **Priority development areas:** ${priorityComps.length} of ${competencies.length} competencies need attention\n`;
      }
      
      return response;
    }
    
    // Check if asking about specific competencies
    const allCompetencies = Object.values(COMPETENCY_DATABASE).flatMap(d => d.competencies);
    const mentionedCompetency = allCompetencies.find(comp => input_lower.includes(comp.name.toLowerCase()));
    
    if (mentionedCompetency) {
      const gap = mentionedCompetency.benchmark - mentionedCompetency.yourScore;
      const gapPct = ((gap / mentionedCompetency.benchmark) * 100).toFixed(0);
      
      let response = `## ${mentionedCompetency.name}\n\n`;
      response += `**Performance:**\n`;
      response += `Your score: **${mentionedCompetency.yourScore.toFixed(1)}/3.0**\n`;
      response += `Benchmark: **${mentionedCompetency.benchmark.toFixed(1)}/3.0**\n`;
      response += `Gap: **${Math.abs(gap).toFixed(2)} points** (${gapPct}% below)\n\n`;
      
      if (gap > 0.3) {
        response += `**Status:** 🔴 **Priority Development Area**\n\n`;
        response += `**Why it matters:** This competency is significantly below industry standard. Closing this gap would improve organizational capability and quality outcomes.\n\n`;
        response += `**Recommended approach:**\n`;
        response += `• Identify top performers in this competency and create mentoring relationships\n`;
        response += `• Implement targeted training with hands-on practice\n`;
        response += `• Set 6-month milestone targets and track progress\n`;
        response += `• Allocate resources to support skill development\n`;
      } else if (gap > 0) {
        response += `**Status:** 🟡 **Moderate Gap**\n\n`;
        response += `**Why it matters:** Your team is approaching benchmark but not quite there. Closing this gap strengthens your overall capability.\n\n`;
        response += `**Recommended approach:**\n`;
        response += `• Provide advanced training for mid-level performers\n`;
        response += `• Create peer learning groups\n`;
        response += `• Reinforce through on-the-job application\n`;
      } else {
        response += `**Status:** 🟢 **Strength**\n\n`;
        response += `This is a strong area. Maintain and deepen expertise while focusing development resources on larger gaps.`;
      }
      
      return response;
    }

    // Participation context
    if (context === 'participation') {
      if (input_lower.includes('completion') || input_lower.includes('completed') || input_lower.includes('percentage')) {
        const remaining = data.totalInvited - data.totalCompleted;
        return `## Assessment Participation Status\n\n**Overall Progress:**\n${data.totalCompleted}/${data.totalInvited} completed (**${data.completionRate}%**)\n\n**What this means:**\nYou have strong participation momentum. To reach 100%, focus follow-up on the remaining ${remaining} participants.\n\n**Next steps:**\n• Send personalized reminders to incomplete participants\n• Highlight the value of assessment for their development\n• Address any barriers (time, technical issues, understanding)\n• Plan celebration when you reach 100% participation`;
      }
      if (input_lower.includes('role') || input_lower.includes('director') || input_lower.includes('manager') || input_lower.includes('specialist')) {
        const directorPct = Math.round((data.byRole[0].completed / data.byRole[0].invited) * 100);
        const managerPct = Math.round((data.byRole[1].completed / data.byRole[1].invited) * 100);
        const specialistPct = Math.round((data.byRole[2].completed / data.byRole[2].invited) * 100);
        return `## Participation by Role\n\n**Directors:** ${directorPct}% (${data.byRole[0].completed}/${data.byRole[0].invited}) 🟢\n**Quality Managers:** ${managerPct}% (${data.byRole[1].completed}/${data.byRole[1].invited}) ${managerPct < 70 ? '🟡' : '🟢'}\n**Quality Specialists:** ${specialistPct}% (${data.byRole[2].completed}/${data.byRole[2].invited}) ${specialistPct < 60 ? '🔴' : '🟡'}\n\n**Key insight:** Directors lead participation—leverage their completion to encourage others.\n\n**Recommended actions:**\n• Pair incomplete managers with director mentors\n• Create peer encouragement among specialists\n• Address role-specific barriers (time availability, technical support)`;
      }
    }

    // Capability context
    if (context === 'capability') {
      if (input_lower.includes('compare') || input_lower.includes('benchmark') || input_lower.includes('how')) {
        const gap = (data.benchmarkScore - data.organizationalScore).toFixed(2);
        const gapPct = ((gap / data.benchmarkScore) * 100).toFixed(0);
        return `## Your Organization vs NAHQ Benchmark\n\n**Your Score:** ${data.organizationalScore.toFixed(2)}/3.0 (Proficient)\n**NAHQ Benchmark:** ${data.benchmarkScore}/3.0\n**Gap:** ${gap} points (${gapPct}%)\n\n**What this means:**\nYou've achieved proficient-level capability across your organization. This is solid but not yet at the industry gold standard.\n\n**Strategic perspective:**\n• You have strong fundamentals to build on\n• Closing the gap requires focused development in 2-3 priority domains\n• This is achievable in 12-18 months with structured effort\n\n**Recommended first steps:**\n1. Identify which domains have the biggest gaps\n2. Determine if gaps are skills (training needed) or staffing (hiring needed)\n3. Create domain-specific development roadmaps`;
      }
      if (input_lower.includes('strength') || input_lower.includes('strong') || input_lower.includes('excel')) {
        return `## Your Strengths\n\n**Quality Leadership** and **Patient Safety** are your strongest domains with significant concentrations of proficient and advanced staff.\n\n**Why this matters:**\nThese are foundational areas that support everything else you do. Quality-minded leadership and safe environments are prerequisites for improvement.\n\n**How to leverage these:**\n• Use quality-minded leaders to champion development initiatives\n• Have patient safety champions mentor in weaker domains\n• Share best practices from these domains to other areas\n• Build on this foundation to reach advanced capabilities\n\n**Next level:** Move some of your proficient staff to advanced through specialized training and mentoring`;
      }
      if (input_lower.includes('development') || input_lower.includes('improve') || input_lower.includes('weakest') || input_lower.includes('gap')) {
        const analyticsComps = COMPETENCY_DATABASE['Health Data Analytics'].competencies;
        const avgAnalytics = analyticsComps.reduce((sum, c) => sum + c.yourScore, 0) / analyticsComps.length;
        const analyticsGap = (2.0 - avgAnalytics).toFixed(2);
        return `## Priority Development Area: Health Data Analytics\n\n**Current State:** ${avgAnalytics.toFixed(2)}/3.0 (Foundational)\n**Benchmark:** 2.0/3.0 (Proficient)\n**Gap:** ${analyticsGap} points — **Your largest opportunity**\n\n**Competency Details:**\n${analyticsComps.map(c => `• ${c.name}: ${c.yourScore.toFixed(1)}/3.0\n`).join('')}\n**Why this matters:**\nData-driven decision-making is critical to modern healthcare quality. This is where you can have the highest impact.\n\n**Recommended roadmap:**\n1. **Month 1-2:** Foundation training on data governance and collection principles\n2. **Month 2-4:** Hands-on analytics tools and basic statistical methods\n3. **Month 4-6:** Apply learning to actual quality improvement projects\n4. **Ongoing:** Advanced training for high-performers\n\n**Investment needed:** Dedicated training budget, tools, and release time`;
      }
    }

    // Benchmarking context
    if (context === 'benchmarking') {
      if (input_lower.includes('compare') || input_lower.includes('similar')) {
        return `## How You Compare to Similar Organizations\n\n**Your Position:** Above-average performer\n**Peer Average:** 1.65/3.0\n**Top Performers:** 1.95/3.0\n\n**What this means:**\nYou're doing better than most similar organizations, but the gap to top performers shows where you can gain competitive advantage.\n\n**Growth opportunity:** 0.30 points (18-month goal)\n\n**Why the gap exists:**\n• Top performers invest heavily in specific domains\n• They have structured talent pipelines\n• They use peer learning and best practice sharing\n\n**Your competitive advantage strategy:**\n1. Pick 2 domains where you can become a top performer\n2. Invest focused resources there\n3. Promote this expertise as organizational brand`;
      }
      if (input_lower.includes('gap') || input_lower.includes('biggest') || input_lower.includes('largest')) {
        const gap = (data.benchmarkScore - data.organizationalScore).toFixed(2);
        return `## Your Capability Gaps\n\n**Overall Gap:** ${gap} points to NAHQ benchmark\n\n**Highest Impact Opportunities:**\n1. **Health Data Analytics** — Largest domain gap\n   Closing this alone: +0.25 point improvement\n2. **Performance Improvement** — High criticality\n   Closing this: +0.20 point improvement\n3. **Professional Engagement** — Foundation for everything\n   Closing this: +0.15 point improvement\n\n**Resource allocation strategy:**\n• 40% to Analytics (highest impact)\n• 35% to Performance Improvement\n• 25% to Professional Engagement & Maintenance\n\n**Timeline:** Closing all three gaps = reaching benchmark in 12-18 months`;
      }
      if (input_lower.includes('priorit') || input_lower.includes('focus') || input_lower.includes('where')) {
        return `## Where to Focus Your Development Investment\n\n**Top 3 Priorities (in order of ROI):**\n\n1. **Health Data Analytics** 🔴 CRITICAL\n   • Largest gap (0.55 points)\n   • Enables all other improvements\n   • Budget: $50K-75K for tools + training\n\n2. **Performance Improvement** 🟡 HIGH\n   • Supports methodology implementation\n   • Reinforces analytics learning\n   • Budget: $25K-35K for training\n\n3. **Professional Engagement** 🟡 MODERATE\n   • Foundation for staff adoption\n   • Reduces resistance to change\n   • Budget: $15K-25K for programs\n\n**Together these will move you from Proficient to Advanced level**`;
      }
    }

    // Reassessment context
    if (context === 'reassessment') {
      if (input_lower.includes('improve') || input_lower.includes('growth') || input_lower.includes('progress') || input_lower.includes('year')) {
        return `## Year-Over-Year Progress\n\n**Organization Score Growth:** +0.20 points (27% improvement)\n\n**What this proves:**\nYour development initiatives are working. This isn't random variation—your staff is genuinely building capabilities.\n\n**Domain breakdown:**\n• Health Data Analytics: +0.25 (strongest growth)\n• Quality Leadership: +0.05 (maintained strength)\n• Patient Safety: +0.05 (solid performance)\n\n**What changed between assessments:**\n✓ Training programs you invested in\n✓ New processes you implemented\n✓ Staff development activities\n✓ Mentoring relationships\n\n**Momentum indicators:**\nYour trajectory suggests you'll reach benchmark by Q4 2026 if you maintain pace.`;
      }
      if (input_lower.includes('trajectory') || input_lower.includes('trend') || input_lower.includes('continue')) {
        return `## Your Improvement Trajectory\n\n**Current:** 1.65/3.0 (Proficient)\n**Benchmark:** 2.0/3.0\n**Time to benchmark:** 12-18 months at current pace\n\n**Your growth curve:**\n• Last 12 months: +0.20 points\n• Projected next 12 months: +0.20-0.25 points\n• Realistic benchmark date: October 2026\n\n**To accelerate (reach by June 2026):**\n• Increase training investment by 25%\n• Add dedicated analytics role\n• Create peer learning cohorts\n• Monthly progress reviews\n\n**If you maintain current effort:** On track for steady, sustainable improvement`;
      }
    }

    // Fallback for unmatched questions
    return `## How I Can Help\n\nI can provide guidance on:\n\n**Domain & Competency Questions:**\n• "How do we stack up in Health Data Analytics?"\n• "Tell me about our patient safety performance"\n• "What's our biggest gap?"\n\n**Strategic Questions:**\n• "What should we prioritize first?"\n• "How long to reach benchmark?"\n• "How do we compare to similar organizations?"\n\n**Tactical Questions:**\n• "Which roles need the most development?"\n• "What training should we invest in?"\n• "When should we reassess?"\n\nWhat would be most helpful for you right now?`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[70vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#00A3E0]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3D3D3D]">AI Assistant</h2>
              <p className="text-xs text-gray-600">{CONTEXT_DESCRIPTIONS[context] || 'Assessment'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-[#00A3E0] text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {message.type === 'assistant' ? (
                  <div className="text-sm prose prose-sm max-w-none">
                    {message.content.split('\n').map((line, i) => {
                      // Headers
                      if (line.startsWith('## ')) {
                        return <h3 key={i} className="text-base font-bold text-[#00A3E0] mt-3 mb-2 first:mt-0">{line.replace('## ', '')}</h3>;
                      }
                      // Bold sections
                      if (line.startsWith('**') && line.endsWith(':**')) {
                        return <p key={i} className="font-bold text-[#3D3D3D] mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
                      }
                      // Bullet points
                      if (line.startsWith('• ') || line.startsWith('✓ ')) {
                        const cleanLine = line.substring(2);
                        const parts = cleanLine.split('**');
                        return (
                          <div key={i} className="flex gap-2 ml-2 mb-1.5">
                            <span className="text-[#00A3E0] font-bold">{line[0]}</span>
                            <span className="flex-1">
                              {parts.map((part, j) => 
                                j % 2 === 0 ? part : <strong key={j} className="font-bold text-[#3D3D3D]">{part}</strong>
                              )}
                            </span>
                          </div>
                        );
                      }
                      // Numbered lists
                      if (/^\d+\.\s/.test(line)) {
                        const parts = line.split('**');
                        return (
                          <div key={i} className="mb-1.5">
                            {parts.map((part, j) => 
                              j % 2 === 0 ? part : <strong key={j} className="font-bold text-[#3D3D3D]">{part}</strong>
                            )}
                          </div>
                        );
                      }
                      // Regular text with bold formatting
                      if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                          <p key={i} className="mb-2">
                            {parts.map((part, j) => 
                              j % 2 === 0 ? part : <strong key={j} className="font-bold text-[#3D3D3D]">{part}</strong>
                            )}
                          </p>
                        );
                      }
                      // Empty lines
                      if (line === '') {
                        return <div key={i} className="h-2" />;
                      }
                      // Default text
                      return <p key={i} className="mb-2">{line}</p>;
                    })}
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          {/* Suggested Questions - Show after initial greeting */}
          {messages.length === 1 && !isLoading && (
            <div className="space-y-2 mt-6">
              <div className="flex items-center gap-2 px-2">
                <Sparkles className="w-4 h-4 text-[#F68B1F]" />
                <p className="text-xs font-semibold text-gray-600">Try asking about:</p>
              </div>
              {(SUGGESTED_QUESTIONS[context] || SUGGESTED_QUESTIONS.capability).map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-[#00A3E0]/10 border border-gray-200 hover:border-[#00A3E0] transition-all text-sm text-gray-700 hover:text-[#00A3E0]"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about your results..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="border-gray-200 focus:border-[#00A3E0]"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-[#00A3E0] hover:bg-[#0093c9] text-white"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}