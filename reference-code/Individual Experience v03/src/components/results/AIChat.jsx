import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Bot, Send, Lightbulb, TrendingUp, Users, Map, ArrowRight, CheckCircle, Flag, HelpCircle, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ReactMarkdown from 'react-markdown';

const CONTEXT_QUESTIONS = {
  default: [
    { icon: HelpCircle, label: 'Help me understand my results' },
    { icon: TrendingUp, label: 'Why is analytics important for my role?' },
    { icon: Lightbulb, label: 'What does "Advanced" level mean?' },
    { icon: Map, label: 'How do I close my gaps?' }
  ],
  framework: [
    { icon: HelpCircle, label: 'What is the framework used for?' },
    { icon: Lightbulb, label: 'How do I get assessed?' },
    { icon: TrendingUp, label: 'What are the skill levels?' },
    { icon: Map, label: 'How can I improve my skills?' }
  ],
  assessment: [
    { icon: HelpCircle, label: 'What does this question mean?' },
    { icon: Lightbulb, label: 'How should I answer this?' },
    { icon: TrendingUp, label: 'What are the activity groupings?' },
    { icon: Map, label: 'How is my score calculated?' }
  ],
  adjust_plan: [
    { icon: TrendingUp, label: 'I want to accelerate my progress' },
    { icon: Calendar, label: 'Can I extend my target date?' },
    { icon: Map, label: 'Add the Analytics Workshop' },
    { icon: RefreshCw, label: 'Change my focus area' }
  ]
};

const CONVERSATION_FLOWS = {
  'what are the skill levels?': {
    response: `The framework has three skill levels that reflect your progression:

**Foundational Level**

• Entry-level knowledge and understanding
• Performing tasks with assistance or guidance
• Explaining basic concepts to others
• Identifying key elements and components

**Proficient Level**

• Working independently on complex tasks
• Implementing processes and managing projects
• Problem-solving and decision-making
• Training and supporting others

**Advanced Level**

• Leading strategic initiatives organization-wide
• Developing policies and frameworks
• Mentoring and coaching professionals
• Advising leadership on strategic direction

Most professionals progress through these levels over 5-10 years, with some domains advancing faster based on your role and experience.`,
    hasAction: false
  },
  'how can i improve my skills?': {
    response: `There are several proven ways to develop your healthcare quality competencies:

**1. Targeted Learning**

Take NAHQ courses specifically designed for the domains where you want to grow. Each course is mapped to specific competency statements and skill levels.

**2. On-the-Job Application**

The best learning happens when you apply new skills in your current role. Our courses include practice projects you can complete with your organization's data.

**3. Mentorship & Coaching**

Connect with advanced practitioners in your focus areas. NAHQ's community can help you find mentors, and our AI coach provides ongoing guidance.

**4. Structured Development Plans**

Follow a personalized learning pathway that sequences courses and experiences to build competencies systematically.

After you complete your assessment, I'll create a customized development plan based on your specific profile and career goals.`,
    hasAction: true,
    actionLabel: 'Take Assessment First',
    actionLink: 'Assessment'
  },
  'what does this question mean?': {
    response: `Each assessment question has two parts:

**Part 1 - Agreement Scale**

This asks how much the competency statement describes your *current work*. Be honest about what you actually do today, not what you aspire to do.

**Part 2 - Activity Groupings**

The three groupings represent different skill levels:

• **Grouping 1:** Foundational activities (learning, explaining, identifying)
• **Grouping 2:** Proficient activities (implementing, managing, designing)
• **Grouping 3:** Advanced activities (leading, developing strategy, mentoring)

Select the grouping that best matches what you do *regularly*—not occasionally or aspirationally.

**Tip:** It's okay to select "I don't perform these activities" if you haven't worked in that area yet.`,
    hasAction: false
  },
  'what are the activity groupings?': {
    response: `The activity groupings represent different skill levels for each competency:

**Grouping 1 (Foundational)**

• Learning and understanding concepts
• Explaining and identifying key elements
• Performing tasks with guidance

**Grouping 2 (Proficient)**

• Implementing and managing independently
• Designing and developing solutions
• Training and supporting others

**Grouping 3 (Advanced)**

• Leading strategic initiatives
• Advising leadership on policy
• Mentoring and coaching
• Developing organizational strategy

Choose the grouping that best describes what you *regularly do* in your current role, not what you could do or hope to do.`,
    hasAction: false
  },
  'how is my score calculated?': {
    response: `Your scores are calculated from your responses across multiple dimensions:

**Competency Level**

The activity grouping you select determines your level for that competency (Foundational, Proficient, or Advanced). Your agreement level also influences the scoring.

**Domain Score**

Your domain score is the average of all competency scores within that domain. For example, Quality Leadership has 5 competencies, so your score reflects your average level across all 5.

**Overall Score**

Your overall score is the weighted average across all 8 domains, giving you a comprehensive view of your professional competency.

**Percentile Ranking**

We compare your profile to thousands of other quality professionals to show where you rank relative to peers with similar roles and experience levels.

The assessment is designed to be honest and developmental—there are no "wrong" answers, only opportunities to grow!`,
    hasAction: false
  },
  'why are these my strengths?': {
    response: `Great question! Your strengths in **Quality Leadership** (2.1), **Patient Safety** (1.9), and **Regulatory & Accreditation** (1.8) reflect your experience and focus areas.

**What this tells me about you:**

• You excel at strategic planning and organizational alignment

• You have strong compliance and regulatory knowledge

• You effectively communicate quality initiatives to stakeholders

• You understand how to build and maintain safety programs

These are foundational leadership competencies that position you well for advancement to VP or Chief Quality Officer roles.`,
    hasAction: false
  },
  'what does my analytics gap mean?': {
    response: `Great question! Your Health Data Analytics score of **1.4 (Foundational)** tells me you're currently:

**What you can do now:**

• Explaining types of quality measures

• Discussing best practices for data collection

• Identifying data sources for benchmarking

• Describing importance of accurate data

**What PROFICIENT level looks like:**

• Developing measures with operational definitions

• Designing data collection plans independently

• Creating visualizations that drive decisions

• Performing complex data extractions

---

**Why this matters for you:**

Your strong leadership skills (2.1 Advanced) combined with foundational analytics creates a specific challenge. You can strategically plan quality initiatives, but you may:

• Rely on others for data analysis and reporting

• Have limited ability to validate data independently

• Miss opportunities to spot trends early

• Struggle to demonstrate ROI quantitatively

**The good news:** With your leadership foundation, developing analytics skills will amplify your impact significantly!`,
    hasAction: true,
    actionLabel: 'Yes, Show My Path',
    actionLink: 'PlanGeneration'
  },
  'how do i compare to my peers?': {
    response: `Here's how your profile compares to other quality professionals:`,
    hasAction: false,
    showPeerComparison: true
  },
  'show me my development path': {
    response: `Based on your profile, I recommend focusing on **Health Data Analytics** to maximize your career growth.

**Why this focus?**

• Your leadership scores are already strong (2.1)

• Analytics is the most impactful skill gap to close

• Data skills will amplify your existing strengths

---

**Your 12-Month Goal:**

Health Data Analytics: 1.4 → 1.7 (Proficient)

**Recommended Learning Path:**

1. **Phase 1 (Months 1-3):** Foundation building

2. **Phase 2 (Months 4-8):** Hands-on application

3. **Phase 3 (Months 9-12):** Advanced mastery

**Total time investment:** ~45-60 hours

Ready to see the detailed roadmap with specific courses and milestones?`,
    hasAction: true,
    actionLabel: 'View Full Development Plan',
    actionLink: 'PlanGeneration'
  },
  'what is the framework used for?': {
    response: `The **NAHQ Healthcare Quality Competency Framework** is the industry standard for defining what healthcare quality professionals need to know and do.

**How organizations use it:**

• Define job requirements and competencies

• Build career ladders for quality professionals

• Assess team capabilities and identify gaps

• Design training and development programs

**How individuals use it:**

• Understand your current skill level

• Identify areas for professional growth

• Plan your career development path

• Demonstrate your competencies to employers

The framework covers 8 domains, 29 competencies, and 486 specific skills—all stratified across Foundational, Proficient, and Advanced levels.`,
    hasAction: false
  },
  'how do i get assessed?': {
    response: `The assessment process is straightforward and takes about 40-45 minutes.

**How it works:**

1. **Self-Assessment**
   You'll review competency statements and rate how well they describe your current work

2. **Activity Selection**
   For each competency, you'll select which group of activities you regularly perform

3. **AI Analysis**
   Our system analyzes your responses across all 29 competencies

4. **Personalized Results**
   You receive your domain scores, percentile rankings, and detailed insights

**What you'll get:**

• Scores for all 8 domains
• Comparison to peer benchmarks
• Identification of strengths and gaps
• Personalized development recommendations

Ready to start your assessment?`,
    hasAction: true,
    actionLabel: 'Start Assessment',
    actionLink: 'Assessment'
  },
  'how should i answer this?': {
    response: `Here's my advice for getting the most accurate assessment:

**Be honest, not aspirational:**

Answer based on what you *actually do* in your current role, not what you'd like to do or think you should be doing.

**Consider your regular activities:**

Focus on tasks you perform at least monthly. Occasional or one-time activities shouldn't drive your selection.

**Don't overthink it:**

Your first instinct is usually correct. The assessment is designed to capture your overall competency level, not test specific knowledge.

**It's okay to have gaps:**

Most professionals have 2-3 strong domains and are developing in others. That's completely normal and expected!

The goal is to get an accurate picture so we can give you the best personalized recommendations.`,
    hasAction: false
  }
};

const DOMAIN_DATA = {
  'Professional Engagement': {
    competencies: [
      { name: 'Integrate ethical standards into healthcare quality practice', score: 2.2, benchmark: 2.0, average: 1.9 },
      { name: 'Engage in lifelong learning as a healthcare quality professional', score: 2.1, benchmark: 2.1, average: 1.8 },
      { name: 'Participate in activities that advance the healthcare quality profession', score: 2.0, benchmark: 1.9, average: 1.7 }
    ]
  },
  'Quality Leadership and Integration': {
    competencies: [
      { name: 'Direct the quality infrastructure to achieve organizational objectives', score: 2.3, benchmark: 2.2, average: 2.0 },
      { name: 'Apply procedures to regulate the use of privileged or confidential information', score: 2.1, benchmark: 2.2, average: 1.9 },
      { name: 'Implement processes to promote stakeholder engagement and interprofessional teamwork', score: 2.0, benchmark: 2.3, average: 1.9 },
      { name: 'Create learning opportunities to advance healthcare quality throughout the organization', score: 2.2, benchmark: 2.1, average: 1.8 },
      { name: 'Communicate effectively with different audiences to achieve quality goals', score: 2.1, benchmark: 2.2, average: 1.9 }
    ]
  },
  'Performance and Process Improvement': {
    competencies: [
      { name: 'Implement standard performance and process improvement (PPI) methods', score: 1.8, benchmark: 2.1, average: 1.7 },
      { name: 'Apply project management methods', score: 1.7, benchmark: 2.0, average: 1.6 },
      { name: 'Use change management principles and tools', score: 1.6, benchmark: 2.2, average: 1.8 }
    ]
  },
  'Population Health and Care Transitions': {
    competencies: [
      { name: 'Integrate population health management strategies into quality work', score: 1.6, benchmark: 1.8, average: 1.6 },
      { name: 'Apply a holistic approach to improvement', score: 1.5, benchmark: 1.7, average: 1.5 },
      { name: 'Collaborate with stakeholders to improve care processes and transitions', score: 1.4, benchmark: 1.9, average: 1.7 }
    ]
  },
  'Health Data Analytics': {
    competencies: [
      { name: 'Apply procedures for the governance of data assets', score: 1.5, benchmark: 2.0, average: 1.6 },
      { name: 'Design data collection plans for key metrics and performance indicators', score: 1.4, benchmark: 2.1, average: 1.7 },
      { name: 'Acquire data from source systems', score: 1.3, benchmark: 1.9, average: 1.5 },
      { name: 'Integrate data from internal and external electronic data systems', score: 1.4, benchmark: 2.0, average: 1.6 },
      { name: 'Use statistical and visualization methods', score: 1.4, benchmark: 2.1, average: 1.6 }
    ]
  },
  'Patient Safety': {
    competencies: [
      { name: 'Assess the organization\'s patient safety culture', score: 2.0, benchmark: 2.1, average: 1.8 },
      { name: 'Apply safety science principles and methods in healthcare quality work', score: 1.9, benchmark: 2.2, average: 1.9 },
      { name: 'Use organizational procedures to identify and report patient safety risks and events', score: 1.8, benchmark: 2.0, average: 1.7 },
      { name: 'Collaborate with stakeholders to analyze patient safety risks and events', score: 1.9, benchmark: 2.1, average: 1.8 }
    ]
  },
  'Regulatory and Accreditation': {
    competencies: [
      { name: 'Operationalize processes to support compliance with regulations and standards', score: 1.9, benchmark: 2.0, average: 1.7 },
      { name: 'Facilitate continuous survey readiness activities', score: 1.8, benchmark: 2.1, average: 1.8 },
      { name: 'Guide the organization through survey processes and findings', score: 1.7, benchmark: 1.9, average: 1.6 }
    ]
  },
  'Quality Review and Accountability': {
    competencies: [
      { name: 'Relate current and emerging payment models to healthcare quality work', score: 1.7, benchmark: 1.9, average: 1.6 },
      { name: 'Conduct the activities to execute measure requirements', score: 1.6, benchmark: 2.0, average: 1.7 },
      { name: 'Implement processes to facilitate practitioner performance review activities', score: 1.5, benchmark: 1.8, average: 1.5 }
    ]
  }
};

export default function AIChat({ onClose, results, context = 'default' }) {
  const suggestedQuestions = CONTEXT_QUESTIONS[context] || CONTEXT_QUESTIONS.default;
  
  const getInitialMessage = () => {
    if (context === 'adjust_plan') {
      return `Hi Sarah! Let's review your current progress and adjust your learning plan.

**Your Current Status:**

✅ **Completed:** 2 courses (10 hours)
• HQ Principles: Data-Driven Decisions
• Introduction to Healthcare Analytics

🔄 **In Progress:** Statistical Process Control (45% complete)
• 2.5 hours remaining

📊 **Progress toward goal:** 30% complete (1.4 → 1.6 so far)

**On track for:** Proficient level (1.7) by April 2026

---

I can help you:
• Speed up your timeline (add the May workshop?)
• Extend your target date if you need more time
• Adjust course sequence based on your schedule
• Switch focus areas if priorities have changed

What would you like to adjust?`;
    }
    if (context === 'assessment') {
      return `Hi Sarah! I'm here to help you with the assessment. If you have any questions about what a competency statement means or how to answer, just ask!

What would you like to know?`;
    }
    if (context === 'framework') {
      return `Hi Sarah! I can help you understand the Healthcare Quality Competency Framework and how it applies to your professional development.

What would you like to know about the framework?`;
    }
    return `Hi Sarah! I've analyzed all 29 of your competency responses. Your profile shows you're a quality leader who's strong in strategic areas but could benefit from strengthening your analytics foundation.

**Your Strengths:**
• Quality Leadership & Integration (2.1 - Advanced)
• Patient Safety (1.9 - Proficient)
• Regulatory & Accreditation (1.8 - Proficient)

**Your Growth Opportunity:**
• Health Data Analytics (1.4 - Foundational)

What would you like to explore first?`;
  };

  const [messages, setMessages] = useState([
    { role: 'assistant', content: getInitialMessage() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text.toLowerCase());
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  const getAIResponse = (userInput) => {
    // Check for exact match first
    if (CONVERSATION_FLOWS[userInput]) {
      const flow = CONVERSATION_FLOWS[userInput];
      return { 
        role: 'assistant', 
        content: flow.response,
        hasAction: flow.hasAction,
        actionLabel: flow.actionLabel,
        actionLink: flow.actionLink,
        showPeerComparison: flow.showPeerComparison,
        showResultsBreakdown: flow.showResultsBreakdown,
        showCompetencyBreakdown: flow.showCompetencyBreakdown,
        competencyData: flow.competencyData
        };
        }

    // Smart pattern matching for coaching responses
    if (userInput.includes('gap') || userInput.includes('analytics') || userInput.includes('weak')) {
      return {
        role: 'assistant',
        content: `I see you're asking about your Analytics gap. Let me break this down for you:

**Your Current Analytics Score: 1.4 (Foundational)**

This means you understand data concepts but aren't yet independently working with healthcare data. Given your strong leadership skills (2.1 - Advanced), this gap is actually your biggest opportunity!

**Here's what I recommend:**

1. **Start immediately with:** HQ Principles: Data-Driven Decisions (2 hours)
   - Available now on your Roadmap
   - Builds foundation you need

2. **Then progress to:** Introduction to Healthcare Analytics (8 hours)
   - Target: Complete by March 1, 2026
   - This gets you to Proficient level

3. **Upcoming workshop:** Healthcare Analytics Workshop (Feb 20, 2026 at 2:00 PM)
   - Live hands-on session
   - Perfect timing after your first course

Would you like me to walk you through the full Analytics pathway?`,
        hasAction: true,
        actionLabel: 'View Full Roadmap',
        actionLink: 'Roadmap'
      };
    }

    if (userInput.includes('course') || userInput.includes('learn') || userInput.includes('should i take')) {
      return {
        role: 'assistant',
        content: `Based on your assessment results, here are the courses I recommend **in priority order**:

**🎯 High Priority - Start Now:**

1. **HQ Principles: Data-Driven Decisions** (2 hours)
   - Status: Available now
   - Why: Closes your Analytics gap (1.4 → 1.5)
   - Action: Click "View Course" on your Roadmap

**📊 Next Steps - Within 2 Weeks:**

2. **Introduction to Healthcare Analytics** (8 hours)  
   - Unlocks: After completing HQ Principles
   - Why: Gets you to Proficient level (1.5 → 1.7)
   - Target date: March 1, 2026

3. **Data Visualization for Quality** (6 hours)
   - Target date: April 15, 2026
   - Why: Leverages your communication strengths

**💡 Reminder:** You don't have any courses in progress right now, so this is the perfect time to start!

Want to see the complete 12-month pathway?`,
        hasAction: true,
        actionLabel: 'Start First Course',
        actionLink: 'Roadmap'
      };
    }

    if (userInput.includes('event') || userInput.includes('workshop') || userInput.includes('webinar') || userInput.includes('conference')) {
      return {
        role: 'assistant',
        content: `Great question! NAHQ has several upcoming events that would benefit your development:

**🔥 Recommended for You:**

**Healthcare Analytics Workshop**
- Date: February 20, 2026 at 2:00 PM EST
- Format: Live interactive workshop
- Why perfect for you: Complements your Analytics learning pathway
- Duration: 3 hours
- Action: Add to calendar from your Roadmap

**Quality Leadership Webinar**
- Date: March 5, 2026 at 1:00 PM EST
- Format: Live webinar
- Why: Maintains your leadership strength (2.1)
- Topic: Leading quality initiatives in complex organizations

**Patient Safety Best Practices Conference**
- Date: March 12, 2026 at 3:00 PM EST
- Format: Virtual conference
- Why: Builds on your Patient Safety strength (1.9)

All events are on your Roadmap page. Would you like me to explain why I prioritized the Analytics Workshop first?`,
        hasAction: true,
        actionLabel: 'View All Events',
        actionLink: 'Roadmap'
      };
    }

    if (userInput.includes('roadmap') || userInput.includes('plan') || userInput.includes('pathway') || userInput.includes('development')) {
      return {
        role: 'assistant',
        content: `Your personalized 12-month development plan focuses on **closing your Analytics gap** while maintaining your leadership strengths.

**Phase 1: Foundation (Months 1-4)**
- HQ Principles: Data-Driven Decisions ✓ Start now
- Introduction to Healthcare Analytics (Target: March 1)
- Data Visualization for Quality (Target: April 15)
- Analytics Workshop (Feb 20) - Live event!

**Phase 2: Practical Application (Months 5-7)**
- Lean Six Sigma Fundamentals
- Project Management for Quality
- Change Management Workshop

**Phase 3: Strategic Mastery (Months 8-12)**
- Population Health Management
- Advanced courses in your strength areas

**Your Target:** Analytics 1.4 → 1.7 (Proficient) by April 2026

**Key Insight:** Your strong leadership + data skills = VP/Chief Quality Officer profile!

Ready to start? Your first course is waiting on the Roadmap page.`,
        hasAction: true,
        actionLabel: 'Go to Roadmap',
        actionLink: 'Roadmap'
      };
    }

    if (userInput.includes('strength') || userInput.includes('good at') || userInput.includes('proficient')) {
      return {
        role: 'assistant',
        content: `Your strengths paint a clear picture of an effective quality leader:

**🌟 Your Top Strengths:**

1. **Quality Leadership (2.1 - Advanced)**
   - You're in the 78th percentile
   - You excel at strategic planning and organizational alignment
   - This is VP/Chief Quality Officer level capability

2. **Patient Safety (1.9 - Proficient)**  
   - 65th percentile among peers
   - Strong understanding of safety culture and risk management

3. **Regulatory & Accreditation (1.8 - Proficient)**
   - 60th percentile
   - Solid compliance and accreditation expertise

**What This Means:**

You have the leadership foundation and safety/compliance skills needed for senior roles. Your opportunity is to add data literacy to this strong foundation.

**My Recommendation:** Focus 80% of your learning time on Analytics (your gap) and 20% on maintaining/growing your strengths.

Want to see specific courses for each domain?`,
        hasAction: true,
        actionLabel: 'View Results Page',
        actionLink: 'Results'
      };
    }

    if (userInput.includes('in progress') || userInput.includes('current') || userInput.includes('working on')) {
      return {
        role: 'assistant',
        content: `Let me check your current learning status:

**📚 Current Status:**

You don't have any courses in progress right now. This is actually perfect timing to start your Analytics pathway!

**🎯 Ready to Start:**

Your first recommended course is **HQ Principles: Data-Driven Decisions** (2 hours). This course is:
- Available immediately
- Foundational for your Analytics development  
- Short enough to complete in one sitting
- Designed specifically for quality professionals

**Next Actions:**

1. Go to your Roadmap page
2. Find "HQ Principles" in the Health Data Analytics section
3. Click "Preview Course" to learn more
4. Click "Start Course" when ready

Want me to walk you through what you'll learn in this course?`,
        hasAction: true,
        actionLabel: 'Start Learning Now',
        actionLink: 'Roadmap'
      };
    }

    if (userInput.includes('compare') || userInput.includes('peer') || userInput.includes('percentile') || userInput.includes('rank')) {
      return {
        role: 'assistant',
        content: `Let me show you how you compare to other Quality Managers:`,
        hasAction: false,
        showPeerComparison: true
      };
    }

    if (userInput.includes('framework') || userInput.includes('domain') || userInput.includes('competenc')) {
      return {
        role: 'assistant',
        content: `The NAHQ Healthcare Quality Competency Framework has **8 domains** that define what quality professionals need to know:

**Your Domain Breakdown:**

🟢 **Strong Areas** (Proficient/Advanced):
- Quality Leadership (2.1) - Your superpower!
- Patient Safety (1.9)
- Regulatory & Accreditation (1.8)
- Professional Engagement (1.9)

🟡 **Developing Areas** (Mid-Proficient):
- Performance Improvement (1.7)
- Quality Review (1.6)
- Population Health (1.5)

🟠 **Growth Opportunity** (Foundational):
- Health Data Analytics (1.4) - Focus here!

Each domain has multiple competencies assessed at three levels: Foundational → Proficient → Advanced.

Want to understand what each domain covers?`,
        hasAction: true,
        actionLabel: 'Explore Framework',
        actionLink: 'Framework'
      };
    }

    // Competency-level questions about specific domains
    const domainMatch = Object.keys(DOMAIN_DATA).find(domain => 
      userInput.toLowerCase().includes(domain.toLowerCase())
    );

    if (domainMatch && (userInput.includes('competenc') || userInput.includes('score') || userInput.includes('compare'))) {
      const domainInfo = results?.domains?.find(d => d.name === domainMatch);
      const competencies = DOMAIN_DATA[domainMatch]?.competencies || [];

      const strengths = competencies.filter(c => c.score >= c.benchmark);
      const meetsTarget = competencies.filter(c => c.score >= c.benchmark - 0.2 && c.score < c.benchmark);
      const gaps = competencies.filter(c => c.score < c.benchmark - 0.2);

      return {
        role: 'assistant',
        content: `Here's your **${domainMatch}** competency breakdown:

**Your Score:** ${domainInfo?.score.toFixed(1)} (${domainInfo?.level}, ${domainInfo?.percentile}th percentile)
**Role Benchmark:** ${domainInfo?.benchmark.toFixed(1)} for ${results?.position}

${strengths.length > 0 ? `**✓ Strengths (${strengths.length}):**
${strengths.map(c => `• ${c.name}: **${c.score.toFixed(1)}** (target: ${c.benchmark.toFixed(1)})`).join('\n')}
` : ''}${meetsTarget.length > 0 ? `**→ Meeting Target (${meetsTarget.length}):**
${meetsTarget.map(c => `• ${c.name}: **${c.score.toFixed(1)}** (target: ${c.benchmark.toFixed(1)})`).join('\n')}
` : ''}${gaps.length > 0 ? `**⚠ Development Areas (${gaps.length}):**
${gaps.map(c => `• ${c.name}: **${c.score.toFixed(1)}** (target: ${c.benchmark.toFixed(1)}, gap: ${Math.abs(c.score - c.benchmark).toFixed(1)})`).join('\n')}` : ''}`,
        hasAction: false,
        showCompetencyBreakdown: true,
        competencyData: { domainName: domainMatch, competencies, domainColor: domainInfo?.color }
      };
    }

    // Help me understand my results
    if (userInput.includes('help') || userInput.includes('understand') || userInput.includes('explain my results') || userInput.includes('my results')) {
      return {
        role: 'assistant',
        content: `Here's your Professional Competency Profile:

**Overall Score:** 1.8/3.0 (47th percentile - Proficient level)

**Your Strengths:**
• Quality Leadership (2.1 - Advanced, 78th percentile)
• Patient Safety (1.9 - Proficient, 65th percentile)
• Regulatory & Accreditation (1.8 - Proficient, 60th percentile)

**Priority Development Area:**
• Health Data Analytics (1.4 - Foundational, 31st percentile)
• Gap of 0.6 points to role benchmark (2.0)

**What This Means:**
You're a strategic leader strong in organizational alignment, safety, and compliance. Your analytics gap is common for professionals advancing through operations. With your leadership foundation, developing data skills will amplify your impact.`,
        hasAction: true,
        actionLabel: 'View Development Plan',
        actionLink: 'PlanGeneration',
        showResultsBreakdown: true
      };
    }

    // Default coaching response
    return {
      role: 'assistant',
      content: `I can help you understand your assessment results and the NAHQ framework. Try asking:

• "Help me understand my results"
• "What does 'Advanced' mean in Health Data Analytics?"
• "Why does NAHQ include Population Health?"
• "How should someone in my role think about Professional Engagement?"

What would you like to know?`,
      hasAction: false
    };
  };

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#00A3E0]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center shadow-md shadow-[#00A3E0]/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-[#3D3D3D]">AI Development Guide</span>
              <p className="text-xs text-gray-500">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
              <Minimize2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : ''}`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-2xl rounded-tl-md px-5 py-4">
                          <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-[#3D3D3D] prose-headings:font-bold prose-headings:text-base prose-headings:mt-6 prose-headings:mb-3 prose-headings:first:mt-0 prose-p:my-3 prose-p:leading-relaxed prose-p:text-[15px] prose-ul:my-3 prose-ul:space-y-2 prose-li:my-0 prose-li:leading-relaxed prose-strong:text-[#3D3D3D] prose-strong:font-semibold prose-hr:my-5 prose-hr:border-gray-200">
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => <p className="mb-3">{children}</p>,
                                  ul: ({ children }) => <ul className="my-3 space-y-2">{children}</ul>,
                                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                        </div>
                        
                        {message.showResultsBreakdown && (
                         <div className="mt-3 ml-1 bg-white rounded-xl border border-gray-200 p-3 max-w-full overflow-hidden">
                           <p className="text-xs font-semibold text-[#3D3D3D] mb-2.5">Your Domain Scores</p>
                           <div className="space-y-2">
                             {(results?.domains || []).map((domain) => (
                               <div key={domain.name} className="flex items-center gap-2">
                                 <div className="flex-1 min-w-0">
                                   <div className="flex items-center justify-between mb-1 gap-2">
                                     <span className="text-xs font-medium text-gray-600 truncate">{domain.name}</span>
                                     <div className="flex items-center gap-1.5 flex-shrink-0">
                                       <span className="text-xs font-bold" style={{ color: domain.color }}>
                                         {domain.score.toFixed(1)}
                                       </span>
                                       <span className="text-xs text-gray-400">/</span>
                                       <span className="text-xs text-gray-500">
                                         {domain.benchmark.toFixed(1)}
                                       </span>
                                     </div>
                                   </div>
                                   <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                     <div 
                                       className="h-full rounded-full transition-all"
                                       style={{ 
                                         width: `${(domain.score / 3) * 100}%`,
                                         backgroundColor: domain.color
                                       }}
                                     />
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                           <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-1">
                             <p className="text-xs text-gray-600 flex items-center gap-1.5">
                               <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                               <span><strong>3 strength domains</strong> at or above benchmark</span>
                             </p>
                             <p className="text-xs text-gray-600 flex items-center gap-1.5">
                               <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                               <span><strong>1 priority gap</strong> with highest impact</span>
                             </p>
                             <p className="text-xs text-gray-600 flex items-center gap-1.5">
                               <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                               <span>You're in the <strong>47th percentile</strong></span>
                             </p>
                           </div>
                         </div>
                        )}

                        {message.showCompetencyBreakdown && message.competencyData && (
                          <div className="mt-3 ml-1 bg-white rounded-xl border border-gray-200 p-3 max-w-full overflow-hidden">
                            <p className="text-xs font-semibold text-[#3D3D3D] mb-2.5">Competency Scores</p>
                            <div className="space-y-2.5">
                              {message.competencyData.competencies.map((comp, i) => {
                                const status = comp.score >= comp.benchmark ? 'strength' : 
                                               comp.score >= comp.benchmark - 0.2 ? 'meets' : 'gap';
                                return (
                                  <div key={i} className="pb-2.5 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <span className="text-xs text-gray-700 leading-tight flex-1 min-w-0">{comp.name}</span>
                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <span className="text-xs font-bold" style={{ color: message.competencyData.domainColor }}>
                                          {comp.score.toFixed(1)}
                                        </span>
                                        <span className="text-xs text-gray-400">/</span>
                                        <span className="text-xs text-gray-500">{comp.benchmark.toFixed(1)}</span>
                                      </div>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full rounded-full transition-all"
                                        style={{ 
                                          width: `${(comp.score / 3) * 100}%`,
                                          backgroundColor: status === 'strength' ? '#10B981' : 
                                                         status === 'meets' ? '#FBBF24' : '#F97316'
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {message.showPeerComparison && (
                          <div className="mt-3 ml-1 bg-white rounded-xl border border-gray-200 p-4">
                            <p className="text-sm font-semibold text-[#3D3D3D] mb-3">Your Percentile Rankings</p>
                            <div className="space-y-2">
                              {(results?.domains || []).sort((a, b) => b.percentile - a.percentile).slice(0, 5).map((domain) => (
                                <div key={domain.name} className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-gray-600">{domain.name}</span>
                                      <span className="text-xs font-bold text-[#00A3E0]">{domain.percentile}th</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full rounded-full transition-all"
                                        style={{ 
                                          width: `${domain.percentile}%`,
                                          backgroundColor: domain.percentile >= 60 ? '#10B981' : domain.percentile >= 40 ? '#FBBF24' : '#F97316'
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                              <p className="text-xs text-gray-600 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                You're in the <strong>top quartile</strong> for Quality Leadership
                              </p>
                              <p className="text-xs text-gray-600 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Overall profile is <strong>stronger than 47%</strong> of peers
                              </p>
                              <p className="text-xs text-gray-600 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                Analytics is your biggest <strong>opportunity area</strong>
                              </p>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Link to={createPageUrl('Roadmap')}>
                                <Button className="bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold text-xs py-2 px-4">
                                  View Learning Pathway
                                  <ArrowRight className="w-3 h-3 ml-1.5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {message.hasAction && (
                          <div className="flex gap-2 mt-3 ml-1">
                            <Link to={createPageUrl(message.actionLink)}>
                              <Button className="bg-[#FFED00] hover:bg-[#e6d600] text-[#3D3D3D] font-semibold shadow-md">
                                {message.actionLabel}
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {message.role === 'user' && (
                    <div className="bg-[#00A3E0] text-white rounded-2xl rounded-tr-md px-5 py-3 shadow-md">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00A3E0] to-[#00B5E2] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-tl-md px-5 py-4">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-[#00A3E0] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#00A3E0] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#00A3E0] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {(messages.length <= 2 || context === 'assessment') && (
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-400 mb-2">
              {context === 'assessment' ? 'Need help with this assessment?' : 'Suggested questions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(question.label)}
                  className="border-[#00A3E0]/20 text-[#00A3E0] hover:bg-[#00A3E0]/5 hover:border-[#00A3E0]/40 text-xs"
                >
                  <question.icon className="w-3 h-3 mr-1.5" />
                  {question.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Type your message..."
              className="flex-1 border-gray-200 focus:border-[#00A3E0] focus:ring-[#00A3E0] bg-white"
            />
            <Button 
              onClick={() => handleSendMessage(inputValue)}
              className="bg-[#00A3E0] hover:bg-[#0093c9] text-white shadow-md"
              disabled={!inputValue.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}