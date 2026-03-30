import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SYSTEM_PROMPT = `You are an AI Professional Development Guide supporting a healthcare quality professional reviewing their Professional Assessment results and Upskill Plan.

Your purpose is to help users:
- Understand what their assessment results mean
- Interpret results within the Healthcare Quality Competency Framework
- Recognize their strengths
- Understand development opportunities
- Understand why competencies appear in their Upskill Plan
- Stay motivated to complete recommended actions

CRITICAL GUARDRAIL: You must only reference development actions that already exist in the user's Upskill Plan. Never suggest new courses, recommend new training, propose alternative activities, or provide development advice outside the Upskill Plan.

If asked for recommendations outside the Upskill Plan, respond: "Your Upskill Plan includes the recommended actions designed for your development. I can help explain how those recommendations support your growth."

RESPONSE STRUCTURE (keep responses brief, 2-4 sentences max per point):
1. Result Interpretation - Brief insight on what their scores mean
2. Strength Recognition - One key strength area
3. Development Opportunities - One priority growth area
4. Upskill Plan Link - Why this matters for their plan
5. Next Step - Single actionable recommendation

TONE: Professional, supportive, encouraging, action-oriented. Be concise and direct.

IMPORTANT: Keep responses SHORT and SPARTAN. Format as plain text without markdown. No lists, no padding. Get straight to the point.`;

function formatAIResponse(text) {
  if (!text) return text;
  
  // Remove markdown asterisks and bold formatting
  let formatted = text.replace(/\*\*/g, '').replace(/\*/g, '');
  
  // Remove markdown headers
  formatted = formatted.replace(/#{1,6}\s/g, '');
  
  // Clean up backticks
  formatted = formatted.replace(/`/g, '');
  
  return formatted.trim();
}

export default function AIChatModal({ isOpen, onClose, context = {} }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Welcome! I\'m here to help you understand your assessment results and Upskill Plan. What would you like to explore?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText !== null ? messageText : input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (messageText === null) setInput('');
    setIsLoading(true);

    try {
      const contextString = context && Object.keys(context).length > 0
        ? `\n\nContext about the user's results:\n${JSON.stringify(context, null, 2)}`
        : '';

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${SYSTEM_PROMPT}${contextString}\n\nUser message: ${textToSend}`,
      });

      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        text: formatAIResponse(typeof response === 'string' ? response : response?.data || 'I apologize, I was unable to generate a response. Please try again.'),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI response failed:', error);
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        text: 'I encountered an issue generating a response. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal - Centered */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-[#00A3E0] to-[#0087bd] text-white px-6 py-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="text-lg font-bold">AI Development Guide</h3>
                  </div>
                  <p className="text-sm text-blue-100 mt-0.5">Ask about your assessment & Upskill Plan</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-sm px-4 py-3 rounded-lg text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#00A3E0] text-white rounded-br-none'
                          : 'bg-white text-gray-700 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-2">
                      <Loader className="w-4 h-4 text-[#00A3E0] animate-spin" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested starters or input */}
              {messages.length === 1 && (
                <div className="border-t border-gray-200 p-4 bg-white space-y-3">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Suggested conversation starters:</p>
                  {[
                    'What does my overall score mean?',
                    'Which competencies should I focus on first?',
                    'How does my score compare to peers?',
                    'Tell me about my Upskill Plan',
                  ].map((starter, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(starter)}
                      disabled={isLoading}
                      className="w-full text-left px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#00A3E0] hover:bg-blue-50 transition-colors text-sm text-gray-700 hover:text-[#00A3E0] disabled:opacity-50"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your results or learning plan..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#00A3E0] focus:border-transparent disabled:bg-gray-50 transition-colors"
                    rows="3"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2.5 bg-[#00A3E0] text-white rounded-lg hover:bg-[#0087bd] disabled:bg-gray-300 transition-colors flex items-center justify-center flex-shrink-0 h-fit"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}