import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

const CONTEXT_LABELS = {
  participation: 'Assessment Participation & Adoption',
  capability: 'Organizational Capability Snapshot',
  domain: 'Domain-Level Capability Analysis',
  competency: 'Competency-Level Capability Analysis',
  benchmarking: 'Benchmarking & Comparative Views',
  reassessment: 'Change Over Time & Reassessment',
};

const SUGGESTED_QUESTIONS = {
  participation: [
    'Which role has the lowest assessment completion?',
    'How does participation vary across sites?',
    'What factors typically drive lower completion rates?',
  ],
  capability: [
    'Where is capability most concentrated across domains?',
    'Which domains show the widest range of proficiency?',
    'How does foundational representation vary?',
    'What does leadership density look like in Advanced tiers?',
  ],
  domain: [
    'How does proficiency composition vary across competencies?',
    'Which competencies show the closest alignment to role standards?',
    'Where is advanced proficiency most concentrated?',
    'How does this domain fit within the NAHQ framework?',
  ],
  competency: [
    'How does proficiency vary across sites for this competency?',
    'Where is alignment to role standards strongest?',
    'What does the NAHQ framework say about this competency?',
    'How does foundational representation compare across sites?',
  ],
  benchmarking: [
    'How does our profile compare to similar organizations?',
    'Which domains show the widest structural variation?',
    'What patterns distinguish top-performing organizations?',
  ],
  reassessment: [
    'Where has proficiency composition shifted the most?',
    'Which domains show the strongest movement toward role standards?',
    'How has leadership density changed over assessment cycles?',
  ],
};

const SYSTEM_PROMPT = `You are a senior healthcare quality workforce strategist advising C-suite executives on the NAHQ (National Association for Healthcare Quality) Workforce Framework.

Your communication style:
- Write for senior executive audiences — strategic, concise, analytical.
- Never use alarmist, evaluative, or prescriptive language.
- Avoid binary framing (ready/not ready, pass/fail).
- Never say: "significantly below", "fails to meet", "critical deficiency", "underperforming", "must", "alarming".
- Do not repeat exact numbers already visible in the dashboard unless directly asked.
- Use relative language: "highest leadership density", "narrowest gap", "more foundational concentration", "widest structural variation".

What to focus on:
- Patterns and relative contrasts across domains, competencies, or sites.
- Capability composition: where Advanced proficiency is concentrated (leadership density), where Foundational is dominant.
- Role Standard alignment as a continuous spectrum, not binary.
- Structural variation — especially at competency or site level.
- NAHQ Framework education when relevant: there are 8 domains, each with 2-5 competencies, scored 0-3 (0=Not Responsible, 1=Foundational, 2=Proficient, 3=Advanced).

Always be educational about the NAHQ framework when it adds context. Keep responses to 3-5 bullet points or 2-3 concise paragraphs. No lengthy lists of recommendations.`;

export default function ExecutiveAIChat({ isOpen, onClose, context = 'capability', data = {}, initialSummary }) {
  const contextLabel = CONTEXT_LABELS[context] || CONTEXT_LABELS.capability;
  const suggested = SUGGESTED_QUESTIONS[context] || SUGGESTED_QUESTIONS.capability;

  const buildSystemContext = () => {
    const lines = [`Context: ${contextLabel}`];
    if (data.domainName) lines.push(`Domain in view: ${data.domainName}`);
    if (data.competencyName) lines.push(`Competency in view: ${data.competencyName}`);
    if (data.organizationalScore !== undefined) lines.push(`Avg proficiency score: ${data.organizationalScore}`);
    if (data.benchmarkScore !== undefined) lines.push(`NAHQ role standard target: ${data.benchmarkScore}`);
    if (data.totalUsers) lines.push(`Participants: ${data.totalUsers}`);
    if (data.pctAdvanced !== undefined) lines.push(`% Advanced: ${data.pctAdvanced}%`);
    if (data.avgDist !== undefined) lines.push(`Avg distance to role standard: ${data.avgDist}`);
    if (data.competencyStats) lines.push(`\nCompetency-level data:\n${JSON.stringify(data.competencyStats, null, 2)}`);
    if (data.siteStats) lines.push(`\nSite-level data:\n${JSON.stringify(data.siteStats, null, 2)}`);
    if (data.domainStats) lines.push(`\nDomain-level data:\n${JSON.stringify(data.domainStats, null, 2)}`);
    if (initialSummary) lines.push(`\nAI-generated summary visible on the page:\n${initialSummary}`);
    return lines.join('\n');
  };

  const [messages, setMessages] = useState(() => [
    {
      type: 'assistant',
      content: initialSummary
        ? `I've reviewed the AI summary for this view. What would you like to explore further?`
        : `I'm here to help you explore your ${contextLabel.toLowerCase()}. What would you like to understand?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { type: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => `${m.type === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const prompt = [
      SYSTEM_PROMPT,
      '--- Page Context ---',
      buildSystemContext(),
      '--- Conversation so far ---',
      history,
      'User: ' + text,
      'Assistant (respond in 3-5 concise bullets or 2-3 short paragraphs; use strategic, executive-level language; educate on NAHQ framework where relevant):'
    ].join('\n\n');



    base44.integrations.Core.InvokeLLM({ prompt })
      .then(res => {
        const content = typeof res === 'string' ? res : res?.text || 'Unable to generate a response at this time.';
        setMessages(prev => [...prev, { type: 'assistant', content }]);
      })
      .catch(() => {
        setMessages(prev => [...prev, { type: 'assistant', content: 'Unable to generate a response at this time.' }]);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSend = () => sendMessage(input);
  const handleSuggested = (q) => sendMessage(q);

  const renderAssistantContent = (content) => {
    const lines = content.split('\n').filter(l => l.trim());
    return (
      <div className="text-sm space-y-2">
        {lines.map((line, i) => {
          const clean = line.replace(/^[-•*]\s*/, '').trim();
          const match = clean.match(/^\*\*(.+?)\*\*[:\s]+(.*)/);
          if (match) {
            return (
              <p key={i} className="leading-relaxed">
                <span className="font-semibold text-[#3D3D3D]">{match[1]}:</span>{' '}
                <span>{match[2]}</span>
              </p>
            );
          }
          if (line.includes('**')) {
            const parts = line.split('**');
            return (
              <p key={i} className="leading-relaxed">
                {parts.map((part, j) =>
                  j % 2 === 0 ? part : <strong key={j} className="font-semibold text-[#3D3D3D]">{part}</strong>
                )}
              </p>
            );
          }
          return <p key={i} className="leading-relaxed">{clean}</p>;
        })}
      </div>
    );
  };

  if (!isOpen) return null;

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[75vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#00A3E0]/10 to-transparent flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#3D3D3D]">NAHQ Workforce Strategist</h2>
              <p className="text-xs text-gray-500">{contextLabel}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message, idx) => (
            <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-[#00A3E0]/15 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-[#00A3E0]" />
                </div>
              )}
              <div className={`max-w-lg px-4 py-3 rounded-xl text-sm ${
                message.type === 'user'
                  ? 'bg-[#00A3E0] text-white rounded-br-none'
                  : 'bg-[#F8F9FB] border border-gray-100 text-gray-800 rounded-bl-none'
              }`}>
                {message.type === 'assistant'
                  ? renderAssistantContent(message.content)
                  : <p>{message.content}</p>
                }
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-[#00A3E0]/15 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-[#00A3E0]" />
              </div>
              <div className="bg-[#F8F9FB] border border-gray-100 px-4 py-3 rounded-xl rounded-bl-none">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A3E0] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Suggested questions — only on first message */}
          {messages.length === 1 && !isLoading && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F68B1F]" />
                <p className="text-xs font-semibold text-gray-500">Suggested questions</p>
              </div>
              {suggested.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggested(q)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-[#00A3E0]/8 border border-gray-200 hover:border-[#00A3E0] transition-all text-xs text-gray-700 hover:text-[#00A3E0]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex-shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about patterns, capability composition, or the NAHQ framework…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="border-gray-200 focus:border-[#00A3E0] text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-[#00A3E0] hover:bg-[#0093c9] text-white flex-shrink-0"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">Responses describe observed patterns and do not constitute recommendations.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}